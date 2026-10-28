import fs from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import path from 'node:path'

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

function stripApiPrefix(url: string): string {
  return url.replace(/^\/api/, '') || '/'
}

function serveStatic(root: string, req: http.IncomingMessage, res: http.ServerResponse): void {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  let file = path.join(root, pathname)
  // Impede sair de `dist/` com `..`.
  if (!file.startsWith(root)) {
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
  fs.createReadStream(file).pipe(res)
}

function proxyHttp(api: URL, req: http.IncomingMessage, res: http.ServerResponse): void {
  const upstream = http.request(
    {
      host: api.hostname,
      port: api.port || 80,
      method: req.method,
      path: stripApiPrefix(req.url ?? '/'),
      headers: { ...req.headers, host: api.host },
    },
    (upRes) => {
      res.writeHead(upRes.statusCode ?? 502, upRes.headers)
      upRes.pipe(res)
    },
  )
  upstream.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ code: 'api_unreachable', message: 'API indisponível.' }))
  })
  req.pipe(upstream)
}

function proxyUpgrade(api: URL, req: http.IncomingMessage, socket: net.Socket, head: Buffer): void {
  const upstream = net.connect(Number(api.port || 80), api.hostname, () => {
    const lines = [`${req.method} ${stripApiPrefix(req.url ?? '/')} HTTP/1.1`]
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      const name = req.rawHeaders[i]
      const value = name.toLowerCase() === 'host' ? api.host : req.rawHeaders[i + 1]
      lines.push(`${name}: ${value}`)
    }
    upstream.write(lines.join('\r\n') + '\r\n\r\n')
    upstream.write(head)
    socket.pipe(upstream).pipe(socket)
  })
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
  const api = new URL(opts.apiUrl)
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith('/api')) proxyHttp(api, req, res)
    else serveStatic(opts.root, req, res)
  })
  server.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/api')) proxyUpgrade(api, req, socket as net.Socket, head)
    else socket.destroy()
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(opts.port, LOCAL_SERVER_HOST, () => resolve(server))
  })
}
