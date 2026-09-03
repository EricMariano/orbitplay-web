import React from "react";

interface Game {
  id: string;
  name: string;
  version: string;
  status: "Em teste" | "Aguardando revisão" | "Pronto para lançar" | "Pausado";
  testersOnline: number;
  openBugs: number;
  gradient: string;
  glow: string;
}

const games: Game[] = [
  {
    id: "azure-card",
    name: "Azure Card Game",
    version: "v0.9.2",
    status: "Em teste",
    testersOnline: 9,
    openBugs: 1,
    gradient: "linear-gradient(135deg, #1a2f4f 0%, #0f2340 100%)",
    glow: "#3ddc97",
  },
  {
    id: "racha-de-rua",
    name: "Racha de Rua",
    version: "v1.4.0",
    status: "Em teste",
    testersOnline: 154,
    openBugs: 3,
    gradient: "linear-gradient(135deg, #3a1c5c 0%, #1c1140 100%)",
    glow: "#ff5da2",
  },
  {
    id: "orbit-arena",
    name: "Orbit Arena",
    version: "v0.6.1",
    status: "Aguardando revisão",
    testersOnline: 42,
    openBugs: 0,
    gradient: "linear-gradient(135deg, #142b52 0%, #1c1140 100%)",
    glow: "#5b8cff",
  },
  {
    id: "neon-quiz",
    name: "Neon Quiz",
    version: "v2.0.0",
    status: "Pronto para lançar",
    testersOnline: 27,
    openBugs: 0,
    gradient: "linear-gradient(135deg, #2c1450 0%, #170c30 100%)",
    glow: "#c084fc",
  },
];

const statusColor: Record<Game["status"], string> = {
  "Em teste": "#5b8cff",
  "Aguardando revisão": "#f5b942",
  "Pronto para lançar": "#3ddc97",
  Pausado: "#8f89b3",
};

const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-flex", width: 16, height: 16 }}>{children}</span>
);

const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </svg>
);

const GamesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="2" y="7" width="20" height="10" rx="4" />
    <path d="M7 12h4M9 10v4M15.5 12h.01M18 10.5h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17.5" cy="9" r="2.4" />
    <path d="M15.5 14.2c2.9.3 5.5 2.6 5.5 5.8" />
  </svg>
);

const BugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="8" y="8" width="8" height="10" rx="4" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2M5 12H2M22 12h-3M5 17l-2 2M19 17l2 2M5 8l-2-2M19 8l2-2" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
  </svg>
);

const PlusOrbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const navItems = [
  { label: "Painel", icon: <DashIcon /> },
  { label: "Jogos", icon: <GamesIcon /> },
  { label: "Testadores", icon: <UsersIcon /> },
  { label: "Relatórios de bugs", icon: <BugIcon /> },
  { label: "Configurações", icon: <SettingsIcon /> },
];

const summary = [
  { label: "Jogos ativos", value: String(games.length) },
  {
    label: "Testadores online",
    value: String(games.reduce((sum, g) => sum + g.testersOnline, 0)),
  },
  {
    label: "Bugs em aberto",
    value: String(games.reduce((sum, g) => sum + g.openBugs, 0)),
  },
  { label: "Builds pendentes", value: "1" },
];

const SummaryCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(148,120,255,0.16)",
      borderRadius: 14,
      padding: "16px 18px",
      flex: 1,
      minWidth: 160,
    }}
  >
    <p style={{ margin: 0, fontSize: 12, color: "#8f89b3" }}>{label}</p>
    <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 600, color: "#f1eefc" }}>
      {value}
    </p>
  </div>
);

const AdminGameCard: React.FC<{ game: Game }> = ({ game }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(148,120,255,0.16)",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        height: 120,
        background: game.gradient,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${game.glow}33, transparent 60%)`,
        }}
      />
      <span
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: game.glow,
          textShadow: `0 0 18px ${game.glow}99`,
          zIndex: 1,
        }}
      >
        {game.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </span>

      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 11,
          fontWeight: 500,
          padding: "4px 9px",
          borderRadius: 20,
          background: "rgba(10,6,24,0.55)",
          color: statusColor[game.status],
          border: `1px solid ${statusColor[game.status]}55`,
        }}
      >
        {game.status}
      </span>
    </div>

    <div style={{ padding: "14px 16px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#f1eefc" }}>
          {game.name}
        </p>
        <span style={{ fontSize: 12, color: "#736c99" }}>{game.version}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          fontSize: 12,
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#736c99" }}>Testadores</p>
          <p style={{ margin: "2px 0 0", color: "#e7e3fb", fontWeight: 500 }}>
            {game.testersOnline} online
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: "#736c99" }}>Bugs abertos</p>
          <p
            style={{
              margin: "2px 0 0",
              color: game.openBugs > 0 ? "#ff8f8f" : "#7ce3b0",
              fontWeight: 500,
            }}
          >
            {game.openBugs}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(90deg, #4a5cf5 0%, #7c4dff 100%)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Gerenciar
        </button>
        <button
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(148,120,255,0.3)",
            background: "transparent",
            color: "#c9befa",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Bugs
        </button>
      </div>
    </div>
  </div>
);

const AddGameCard: React.FC = () => (
  <div
    style={{
      border: "1.5px dashed rgba(148,120,255,0.35)",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 24px",
      minHeight: 260,
      gap: 12,
    }}
  >
    <div style={{ width: 40, height: 40, color: "#9c8dfc" }}>
      <PlusOrbIcon />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#f1eefc" }}>
        Novo jogo
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#736c99", maxWidth: 180 }}>
        Cadastre um jogo e publique uma build para testes.
      </p>
    </div>
    <button
      style={{
        marginTop: 4,
        background: "transparent",
        border: "none",
        color: "#9c8dfc",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Cadastrar jogo
    </button>
  </div>
);

const GameLibraryAdmin: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(165deg, #140b2e 0%, #1c1140 45%, #2a1454 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#f1eefc",
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          borderBottom: "1px solid rgba(148,120,255,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: "linear-gradient(135deg,#5b6cff,#9c4dff)",
              }}
            />
            OrbitPlay
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.5,
                padding: "2px 7px",
                borderRadius: 6,
                background: "rgba(255,138,138,0.15)",
                color: "#ff8f8f",
                marginLeft: 4,
              }}
            >
              ADMIN
            </span>
          </div>

          <div style={{ display: "flex", gap: 22 }}>
            {navItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: item.label === "Jogos" ? "#c9befa" : "#8f89b3",
                  fontWeight: item.label === "Jogos" ? 500 : 400,
                }}
              >
                <NavIcon>{item.icon}</NavIcon>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(148,120,255,0.12)",
              color: "#c9befa",
            }}
          >
            Administrador
          </span>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#5b6cff,#9c4dff)",
            }}
          />
          <span style={{ fontSize: 13, color: "#c9befa" }}>admin_orbit</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "28px 28px 48px" }}>
        <p style={{ fontSize: 12, color: "#736c99", margin: "0 0 6px" }}>
          Painel / Jogos
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 20px" }}>
          Gerenciar jogos
        </h1>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
          {summary.map((s) => (
            <SummaryCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 20,
          }}
        >
          {games.map((game) => (
            <AdminGameCard key={game.id} game={game} />
          ))}
          <AddGameCard />
        </div>
      </div>
    </div>
  );
};

export default GameLibraryAdmin;
