import React from "react";

interface GameStat {
  label: string;
  value: string;
}

interface Game {
  id: string;
  name: string;
  testersOnline: number;
  stats: GameStat[];
  gradient: string;
  glow: string;
}

const games: Game[] = [
  {
    id: "azure-card",
    name: "Azure Card Game",
    testersOnline: 9,
    stats: [
      { label: "Versão", value: "v0.9.2" },
      { label: "Status", value: "Em teste" },
    ],
    gradient: "linear-gradient(135deg, #1a2f4f 0%, #0f2340 100%)",
    glow: "#3ddc97",
  },
  {
    id: "racha-de-rua",
    name: "Racha de Rua",
    testersOnline: 154,
    stats: [
      { label: "Versão", value: "v1.4.0" },
      { label: "Status", value: "Bugs abertos: 3" },
    ],
    gradient: "linear-gradient(135deg, #3a1c5c 0%, #1c1140 100%)",
    glow: "#ff5da2",
  },
  {
    id: "orbit-arena",
    name: "Orbit Arena",
    testersOnline: 42,
    stats: [
      { label: "Versão", value: "v0.6.1" },
      { label: "Status", value: "Aguardando revisão" },
    ],
    gradient: "linear-gradient(135deg, #142b52 0%, #1c1140 100%)",
    glow: "#5b8cff",
  },
  {
    id: "neon-quiz",
    name: "Neon Quiz",
    testersOnline: 27,
    stats: [
      { label: "Versão", value: "v2.0.0" },
      { label: "Status", value: "Pronto para lançar" },
    ],
    gradient: "linear-gradient(135deg, #2c1450 0%, #170c30 100%)",
    glow: "#c084fc",
  },
];

const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-flex", width: 16, height: 16 }}>{children}</span>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
    <path d="M8 5H5a2 2 0 0 0 2 4M16 5h3a2 2 0 0 1-2 4" />
    <path d="M12 12v3M9 19h6M10 15h4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2Z" />
  </svg>
);

const GamesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="2" y="7" width="20" height="10" rx="4" />
    <path d="M7 12h4M9 10v4M15.5 12h.01M18 10.5h.01" />
  </svg>
);

const RankingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M6 20V11M12 20V4M18 20v-7" />
  </svg>
);

const BugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="8" y="8" width="8" height="10" rx="4" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2M5 12H2M22 12h-3M5 17l-2 2M19 17l2 2M5 8l-2-2M19 8l2-2" />
  </svg>
);

const PlusOrbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const navItems = [
  { label: "Início", icon: <GamesIcon /> },
  { label: "Meus jogos", icon: <RankingIcon /> },
  { label: "Relatórios enviados", icon: <BugIcon /> },
  { label: "Comunidade", icon: <TrophyIcon /> },
];

const GameCard: React.FC<{ game: Game }> = ({ game }) => (
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
        height: 140,
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
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${game.glow}55 0%, transparent 70%)`,
          filter: "blur(2px)",
          position: "absolute",
        }}
      />
      <span
        style={{
          fontSize: 28,
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
    </div>

    <div style={{ padding: "14px 16px 16px" }}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "#f1eefc" }}>
        {game.name}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 6,
          fontSize: 12,
          color: "#8f89b3",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3ddc97" }} />
        {game.testersOnline} testadores online
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontSize: 12,
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#736c99" }}>{game.stats[0].label}</p>
          <p style={{ margin: "2px 0 0", color: "#e7e3fb", fontWeight: 500 }}>
            {game.stats[0].value}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: "#736c99" }}>{game.stats[1].label}</p>
          <p style={{ margin: "2px 0 0", color: "#c9befa", fontWeight: 500 }}>
            {game.stats[1].value}
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
          Testar jogo
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
          title="Reportar bug"
        >
          <span style={{ width: 14, height: 14, display: "inline-flex" }}>
            <BugIcon />
          </span>
        </button>
      </div>
    </div>
  </div>
);

const RequestAccessCard: React.FC = () => (
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
        Testar mais jogos
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#736c99", maxWidth: 180 }}>
        Solicite acesso a novos títulos disponíveis para teste.
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
      Solicitar acesso
    </button>
  </div>
);

const GameLibraryUser: React.FC = () => {
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
                  color: item.label === "Meus jogos" ? "#c9befa" : "#8f89b3",
                  fontWeight: item.label === "Meus jogos" ? 500 : 400,
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
            Conta de testador
          </span>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#5b6cff,#9c4dff)",
            }}
          />
          <span style={{ fontSize: 13, color: "#c9befa" }}>QA_rockstar</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "28px 28px 48px" }}>
        <p style={{ fontSize: 12, color: "#736c99", margin: "0 0 6px" }}>
          Início / Jogos em teste
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 22px" }}>
          Meus jogos
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          <RequestAccessCard />
        </div>
      </div>
    </div>
  );
};

export default GameLibraryUser;
