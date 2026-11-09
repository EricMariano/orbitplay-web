import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import path from 'node:path'
import tls from 'node:tls'

// Serve o build do front (`dist/`) e repassa `/api/*` para a API, tirando o
// prefixo — o mesmo que o proxy do Vite faz em dev. Front e `/api` ficam na
// mesma origem, então cookie httpOnly e CORS não mudam. A API fica FORA do app.

/** Só loopback IPv4: a janela do app abre neste mesmo endereço. */
export const LOCAL_SERVER_HOST = '127.0.0.1'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

/**
 * Caminho na API para `/api` e `/api/…` (ou `/api?…`), sem o prefixo; `null`
 * para o resto — `startsWith('/api')` pegaria também `/apifoo`.
 */
function apiPath(url: string | undefined): string | null {
  if (url !== '/api' && !url?.startsWith('/api/') && !url?.startsWith('/api?')) return null
  const rest = url.slice('/api'.length)
  return rest.startsWith('/') ? rest : `/${rest}`
}

/** Para onde o proxy fala: `https:` usa TLS, com SNI quando o host é um nome. */
type Upstream = { secure: boolean; host: string; port: number; hostHeader: string }

function upstreamFor(api: URL): Upstream {
  if (api.protocol !== 'http:' && api.protocol !== 'https:') {
    throw new Error(`ORBITPLAY_API_URL precisa ser http:// ou https:// (recebido: ${api.protocol})`)
  }
  const secure = api.protocol === 'https:'
  return {
    secure,
    // `URL.hostname` traz IPv6 entre colchetes, que o `connect` não aceita.
    host: api.hostname.replace(/^\[(.*)\]$/, '$1'),
    port: Number(api.port) || (secure ? 443 : 80),
    hostHeader: api.host,
  }
}

/** SNI só para nomes: a RFC 6066 proíbe IP no `servername` (e o Node avisa). */
function serverName(upstream: Upstream): string | undefined {
  return net.isIP(upstream.host) ? undefined : upstream.host
}

/** Defesa contra DNS rebinding: um site cujo domínio passe a resolver para
 *  127.0.0.1 chega aqui com o próprio `Host`, e não com o do app. */
function isAllowedHost(host: string | undefined, port: number): boolean {
  const value = host?.toLowerCase()
  return value === `${LOCAL_SERVER_HOST}:${port}` || value === `localhost:${port}`
}

/** `startsWith(root)` aceitaria irmãos como `dist-electron/`. */
function isInsideRoot(root: string, file: string): boolean {
  const relative = path.relative(root, file)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

function serveStatic(root: string, req: http.IncomingMessage, res: http.ServerResponse): void {
  let pathname: string
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', `http://${LOCAL_SERVER_HOST}`).pathname)
  } catch {
    // `GET /%` ou `GET //`: sem o catch, o erro sobe até o processo principal.
    res.writeHead(400).end()
    return
  }
  let file = path.join(root, pathname)
  // Impede sair de `dist/` com `..` (o `..%2F` só vira `../` depois do decode).
  if (!isInsideRoot(root, file)) {
    res.writeHead(403).end()
    return
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // Rotas do TanStack Router: qualquer caminho sem arquivo cai no index.html.
    file = path.join(root, 'index.html')
  }
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
  })
  fs.createReadStream(file)
    .on('error', () => res.destroy())
    .pipe(res)
}

function proxyHttp(
  api: Upstream,
  path: string,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const options: https.RequestOptions = {
    host: api.host,
    port: api.port,
    method: req.method,
    path,
    headers: { ...req.headers, host: api.hostHeader },
  }
  const onResponse = (upRes: http.IncomingMessage) => {
    res.writeHead(upRes.statusCode ?? 502, upRes.headers)
    // A API caiu no meio da resposta: os headers já foram, então só resta cortar.
    upRes.on('error', () => res.destroy())
    upRes.pipe(res)
  }
  // Com API remota em `https:`, senha e tokens não podem sair em texto puro.
  const upstream = api.secure
    ? https.request({ ...options, servername: serverName(api) }, onResponse)
    : http.request(options, onResponse)
  upstream.on('error', () => {
    // Um segundo writeHead lançaria ERR_HTTP_HEADERS_SENT no processo principal.
    if (res.headersSent) {
      res.destroy()
      return
    }
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ code: 'api_unreachable', message: 'API indisponível.' }))
  })
  req.pipe(upstream)
}

function proxyUpgrade(
  api: Upstream,
  path: string,
  req: http.IncomingMessage,
  socket: net.Socket,
  head: Buffer,
): void {
  const onConnect = () => {
    const lines = [`${req.method} ${path} HTTP/1.1`]
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      const name = req.rawHeaders[i]
      const value = name.toLowerCase() === 'host' ? api.hostHeader : req.rawHeaders[i + 1]
      lines.push(`${name}: ${value}`)
    }
    upstream.write(lines.join('\r\n') + '\r\n\r\n')
    upstream.write(head)
    socket.pipe(upstream).pipe(socket)
  }
  // `secureConnect` só dispara depois do handshake e da verificação do certificado.
  const upstream: net.Socket = api.secure
    ? tls.connect({ host: api.host, port: api.port, servername: serverName(api) }, onConnect)
    : net.connect(api.port, api.host, onConnect)
  const close = () => {
    socket.destroy()
    upstream.destroy()
  }
  upstream.on('error', close)
  socket.on('error', close)
}

export function startLocalServer(opts: {
  root: string
  apiUrl: string
  port: number
}): Promise<http.Server> {
  const api = upstreamFor(new URL(opts.apiUrl))
  const server = http.createServer((req, res) => {
    const path = apiPath(req.url)
    if (!isAllowedHost(req.headers.host, opts.port)) res.writeHead(403).end()
    else if (path !== null) proxyHttp(api, path, req, res)
    else serveStatic(opts.root, req, res)
  })
  server.on('upgrade', (req, socket, head) => {
    const path = apiPath(req.url)
    if (isAllowedHost(req.headers.host, opts.port) && path !== null) {
      proxyUpgrade(api, path, req, socket as net.Socket, head)
    } else socket.destroy()
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(opts.port, LOCAL_SERVER_HOST, () => resolve(server))
  })
}
