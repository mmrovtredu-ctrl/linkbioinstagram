import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import avatarImg from "../assets/avatar.webp";

// ─── Types ─────────────────────────────────────────────────────────────────────

type WorldId = "shopee" | "mercado" | "tiktok";

interface Product {
  id: string;
  title: string;
  image: string;
  badge?: string;
  category: string;
}

// ─── Product Data ──────────────────────────────────────────────────────────────

const SHOPEE_PRODUCTS: Product[] = [
  { id: "s1", title: "Vara Ultralight Carbono 1,8m", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format", badge: "Mais Vendido", category: "pesca-acessorios" },
  { id: "s2", title: "Carretilha 8 Rolamentos Left", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop&auto=format", badge: "Oferta", category: "pesca-acessorios" },
  { id: "s3", title: "Óculos Polarizados UV400", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&auto=format", badge: "Frete Grátis", category: "pesca-acessorios" },
  { id: "s4", title: "Camisa UV 50+ Manga Longa", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&auto=format", badge: "Promoção", category: "pesca-roupas" },
  { id: "s5", title: "Colete de Pesca Profissional", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop&auto=format", category: "pesca-roupas" },
  { id: "s6", title: "Kit 10 Iscas Minnow 7cm", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&auto=format", badge: "Kit Completo", category: "pesca-iscas" },
  { id: "s7", title: "Isca Slow Jig Articulada 40g", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=400&fit=crop&auto=format", category: "pesca-iscas" },
  { id: "s8", title: "Guia do Pescador Moderno", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&auto=format", badge: "Bestseller", category: "livros" },
  { id: "s9", title: "Arte da Pesca com Mosca", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop&auto=format", category: "livros" },
  { id: "s10", title: "Frigideira Antiaderente 26cm", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format", badge: "Frete Grátis", category: "cozinha" },
  { id: "s11", title: "Kit Facas Inox 6 Peças", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop&auto=format", category: "cozinha" },
];

const ML_PRODUCTS: Product[] = [
  { id: "m1", title: "Vara Telescópica Fibra 2m", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&auto=format", badge: "Frete Grátis", category: "pesca-acessorios" },
  { id: "m2", title: "Molinete Full Metal 3000", image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=400&fit=crop&auto=format", badge: "Parcelado", category: "pesca-acessorios" },
  { id: "m3", title: "Caixa Organizadora de Iscas", image: "https://images.unsplash.com/photo-1541956064527-fd3e6ecfa4c2?w=400&h=400&fit=crop&auto=format", category: "pesca-acessorios" },
  { id: "m4", title: "Jaqueta Impermeável Pesca", image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400&h=400&fit=crop&auto=format", badge: "Novo", category: "pesca-roupas" },
  { id: "m5", title: "Bota de Borracha Pescador", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", category: "pesca-roupas" },
  { id: "m6", title: "Kit Iscas Coloridas 15 Un", image: "https://images.unsplash.com/photo-1580428180098-24b353d7e9d9?w=400&h=400&fit=crop&auto=format", badge: "Kit", category: "pesca-iscas" },
  { id: "m7", title: "Isca Explosiva Articulada 8cm", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format", category: "pesca-iscas" },
  { id: "m8", title: "Manual Completo de Pesca", image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=400&h=400&fit=crop&auto=format", badge: "Mais Vendido", category: "livros" },
  { id: "m9", title: "Receitas com Peixes do Rio", image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop&auto=format", category: "livros" },
  { id: "m10", title: "Grelha para Peixe Premium", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", badge: "Frete Grátis", category: "cozinha" },
  { id: "m11", title: "Temperos Especiais para Peixe", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format", category: "cozinha" },
];

const TIKTOK_VIDEOS: Product[] = [
  { id: "t1", title: "Fisgando o peixe mais raro do rio 🎣", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=711&fit=crop&auto=format", badge: "1.2M views", category: "pesca" },
  { id: "t2", title: "Receita de peixe que viralizou 🐟🔥", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=711&fit=crop&auto=format", badge: "890K views", category: "lifestyle" },
  { id: "t3", title: "Minha melhor pescaria de 2024", image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&h=711&fit=crop&auto=format", badge: "2.1M views", category: "pesca" },
  { id: "t4", title: "O segredo da isca que mais funciona", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=711&fit=crop&auto=format", badge: "450K views", category: "pesca" },
  { id: "t5", title: "Lugar secreto de pesca no interior 🌿", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=711&fit=crop&auto=format", badge: "670K views", category: "lifestyle" },
  { id: "t6", title: "Como montei meu kit de pesca 2024", image: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=400&h=711&fit=crop&auto=format", badge: "320K views", category: "lifestyle" },
];

// ─── World Config ──────────────────────────────────────────────────────────────

const WORLDS = {
  shopee: {
    id: "shopee" as WorldId,
    name: "Shopee",
    tagline: "Meus Achadinhos",
    cardGrad: "linear-gradient(135deg, #EE4D2D 0%, #FF7337 60%, #FFAB40 100%)",
    screenBg: "#FFF5F0",
    headerGrad: "linear-gradient(135deg, #EE4D2D 0%, #FF7337 100%)",
    accent: "#EE4D2D",
    accentDark: "#C83B1F",
    btnBg: "#EE4D2D",
    btnText: "#FFFFFF",
    text: "#1A0500",
    textMuted: "#7A3A20",
    chipBg: "#FFE0D6",
    chipText: "#9A3015",
    chipActiveBg: "#EE4D2D",
    chipActiveText: "#FFFFFF",
    badgeBg: "#EE4D2D",
    badgeText: "#FFFFFF",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(238,77,45,0.15)",
    font: "'Nunito', sans-serif",
    radius: "20px",
    cardRadius: "18px",
    emojis: ["🛍️", "📦", "🛒", "🎁", "💳"],
    filters: [
      { id: "todos", label: "Todos" },
      { id: "pesca-acessorios", label: "🎣 Acessórios" },
      { id: "pesca-roupas", label: "👕 Roupas Pesca" },
      { id: "pesca-iscas", label: "🪝 Iscas" },
      { id: "livros", label: "📚 Livros" },
      { id: "cozinha", label: "🍳 Cozinha" },
    ],
    products: SHOPEE_PRODUCTS,
  },
  mercado: {
    id: "mercado" as WorldId,
    name: "Mercado Livre",
    tagline: "Meus Achadinhos",
    cardGrad: "linear-gradient(135deg, #FFE600 0%, #FFF176 50%, #FFD600 100%)",
    screenBg: "#F8F8F8",
    headerGrad: "linear-gradient(90deg, #FFE600 0%, #FFF59D 100%)",
    accent: "#3483FA",
    accentDark: "#1259C3",
    btnBg: "#3483FA",
    btnText: "#FFFFFF",
    text: "#333333",
    textMuted: "#666666",
    chipBg: "#E8F1FF",
    chipText: "#1A4FA0",
    chipActiveBg: "#3483FA",
    chipActiveText: "#FFFFFF",
    badgeBg: "#3483FA",
    badgeText: "#FFFFFF",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(52,131,250,0.12)",
    font: "'DM Sans', sans-serif",
    radius: "10px",
    cardRadius: "10px",
    emojis: ["📦", "🚚", "⭐", "✅", "🏷️"],
    filters: [
      { id: "todos", label: "Todos" },
      { id: "pesca-acessorios", label: "🎣 Acessórios" },
      { id: "pesca-roupas", label: "👕 Roupas" },
      { id: "pesca-iscas", label: "🪝 Iscas" },
      { id: "livros", label: "📚 Livros" },
      { id: "cozinha", label: "🍳 Cozinha" },
    ],
    products: ML_PRODUCTS,
  },
  tiktok: {
    id: "tiktok" as WorldId,
    name: "TikTok",
    tagline: "Meus Achadinhos",
    cardGrad: "linear-gradient(135deg, #000000 0%, #1A0015 40%, #000D1A 100%)",
    screenBg: "#000000",
    headerGrad: "linear-gradient(90deg, #000000 0%, #0D0D0D 100%)",
    accent: "#25F4EE",
    accentDark: "#FE2C55",
    btnBg: "#FE2C55",
    btnText: "#FFFFFF",
    text: "#FFFFFF",
    textMuted: "#AAAAAA",
    chipBg: "#1A1A1A",
    chipText: "#AAAAAA",
    chipActiveBg: "#FE2C55",
    chipActiveText: "#FFFFFF",
    badgeBg: "#25F4EE",
    badgeText: "#000000",
    cardBg: "#111111",
    cardBorder: "rgba(37,244,238,0.2)",
    font: "'Barlow Condensed', sans-serif",
    radius: "4px",
    cardRadius: "6px",
    emojis: ["▶️", "🎵", "⚡", "🔥", "💫"],
    filters: [
      { id: "todos", label: "TODOS" },
      { id: "pesca", label: "🎣 PESCA" },
      { id: "lifestyle", label: "🌟 LIFESTYLE" },
    ],
    products: TIKTOK_VIDEOS,
  },
} as const;

// ─── CSS Keyframes ─────────────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotateX(2deg) rotateY(-2deg); }
    33% { transform: translateY(-10px) rotateX(-2deg) rotateY(3deg); }
    66% { transform: translateY(-5px) rotateX(3deg) rotateY(-1deg); }
  }
  @keyframes float-delay-1 {
    0%, 100% { transform: translateY(0px) rotateX(-1deg) rotateY(2deg); }
    33% { transform: translateY(-8px) rotateX(3deg) rotateY(-3deg); }
    66% { transform: translateY(-14px) rotateX(-2deg) rotateY(2deg); }
  }
  @keyframes float-delay-2 {
    0%, 100% { transform: translateY(0px) rotateX(2deg) rotateY(1deg); }
    33% { transform: translateY(-12px) rotateX(-1deg) rotateY(-2deg); }
    66% { transform: translateY(-6px) rotateX(2deg) rotateY(3deg); }
  }
  @keyframes pulse-badge {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.07); }
  }
  @keyframes glitch {
    0%, 90%, 100% { clip-path: none; transform: none; }
    91% { clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); transform: translate(-3px, 0); }
    93% { clip-path: polygon(0 50%, 100% 50%, 100% 70%, 0 70%); transform: translate(3px, 0); }
    95% { clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); transform: translate(-2px, 0); }
    97% { clip-path: none; transform: translate(1px, 0); }
  }
  @keyframes neon-pulse {
    0%, 100% { text-shadow: 0 0 8px #25F4EE, 0 0 20px #25F4EE; }
    50% { text-shadow: 0 0 4px #25F4EE, 0 0 10px #25F4EE; }
  }
  @keyframes shine-sweep {
    0% { transform: translateX(-200%) rotate(30deg); }
    100% { transform: translateX(200%) rotate(30deg); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes stagger-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes hub-stars {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  @keyframes progress-fill {
    from { width: 0%; }
    to { width: 85%; }
  }
  @keyframes typing-arm {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2.2px); }
  }
  @keyframes screen-glow {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 0.95; }
  }
  @keyframes head-bob {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(1.4px) rotate(-1.2deg); }
  }
  @keyframes ponytail-sway {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(4deg); }
  }

  /* ── Fundo do mar ─────────────────────────────── */
  /* ── Fundo do mar ─────────────────────────────── */
  @keyframes fish-swim-r {
    0%   { transform: translateX(-20vw); }
    100% { transform: translateX(122vw); }
  }
  @keyframes fish-swim-l {
    0%   { transform: translateX(122vw); }
    100% { transform: translateX(-22vw); }
  }
  @keyframes fish-bob {
    0%, 100% { transform: translateY(0) rotate(-2.5deg); }
    50%      { transform: translateY(-7px) rotate(2.5deg); }
  }
  @keyframes fish-tail {
    0%, 100% { transform: rotate(-9deg); }
    50%      { transform: rotate(9deg); }
  }
  @keyframes algae-sway {
    0%, 100% { transform: rotate(-6deg); }
    50%      { transform: rotate(7deg); }
  }
  @keyframes algae-sway-2 {
    0%, 100% { transform: rotate(5deg); }
    50%      { transform: rotate(-7deg); }
  }
  @keyframes bubble-rise {
    0%   { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
    10%  { opacity: 0.75; }
    50%  { transform: translateY(-45vh) translateX(10px) scale(1); }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-92vh) translateX(20px) scale(1.05); opacity: 0; }
  }
  @keyframes godray-drift {
    0%, 100% { opacity: 0.18; transform: translateX(0) skewX(-8deg); }
    50%      { opacity: 0.42; transform: translateX(22px) skewX(-8deg); }
  }
  @keyframes plankton-drift {
    0%   { transform: translate(0, 0); opacity: 0; }
    15%  { opacity: 0.6; }
    85%  { opacity: 0.6; }
    100% { transform: translate(30px, -40px); opacity: 0; }
  }

  .algae-sway   { animation: algae-sway 4.5s ease-in-out infinite; transform-origin: bottom center; }
  .algae-sway-2 { animation: algae-sway-2 5.5s ease-in-out infinite; transform-origin: bottom center; }
  .fish-tail    { animation: fish-tail 0.6s ease-in-out infinite; transform-origin: left center; }

  .typing-arm-l { animation: typing-arm 0.5s ease-in-out infinite; transform-origin: right center; }
  .typing-arm-r { animation: typing-arm 0.5s ease-in-out infinite 0.25s; transform-origin: left center; }
  .pc-glow { animation: screen-glow 2.4s ease-in-out infinite; }
  .girl-head { animation: head-bob 3.2s ease-in-out infinite; transform-origin: center bottom; }
  .girl-ponytail { animation: ponytail-sway 3.2s ease-in-out infinite; transform-origin: top center; }

  @media (prefers-reduced-motion: reduce) {
    /* Mantemos as animações ambientes suaves do fundo do mar (peixes, algas,
       bolhas) rodando de propósito — elas são o conceito da página. Apenas
       encurtamos transições de UI mais bruscas. */
    .reduce-safe {
      transition-duration: 0.01ms !important;
    }
  }

  .hub-card-0 { animation: float 6s ease-in-out infinite; }
  .hub-card-1 { animation: float-delay-1 7s ease-in-out infinite; }
  .hub-card-2 { animation: float-delay-2 5.5s ease-in-out infinite; }
  .hub-card-interacting { animation: none !important; }

  .badge-pulse { animation: pulse-badge 2s ease-in-out infinite; }
  .tiktok-glitch { animation: glitch 4s ease-in-out infinite; }
  .neon-text { animation: neon-pulse 2.5s ease-in-out infinite; }

  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
`;

// ─── TypingGirl (animação: personagem no computador) ───────────────────────────

function TypingGirl() {
  return (
    <svg
      viewBox="0 0 170 120"
      width="140"
      height="99"
      aria-hidden="true"
      style={{ display: "block", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}
    >
      {/* cadeira */}
      <rect x="18" y="62" width="8" height="34" rx="3" fill="#4A4A52" />
      <rect x="8" y="96" width="30" height="5" rx="2.5" fill="#3C3C44" />
      <rect x="14" y="46" width="10" height="22" rx="4" fill="#4A4A52" />

      {/* rabo de cavalo */}
      <g className="girl-ponytail">
        <path d="M38 26 C 28 30, 24 44, 30 54 C 33 58, 38 56, 37 50 C 36 42, 38 34, 42 30 Z" fill="#6E5A7E" />
      </g>

      {/* cabeça + rosto */}
      <g className="girl-head">
        <circle cx="48" cy="28" r="11" fill="#E8B9A0" />
        {/* cabelo */}
        <path d="M37 26 C 36 15, 48 12, 54 16 C 60 20, 60 26, 58 29 C 57 22, 50 18, 44 21 C 40 23, 38 25, 37 26 Z" fill="#7C6690" />
        {/* olho (perfil) */}
        <circle cx="53.5" cy="27" r="1.4" fill="#3A3A44" />
      </g>

      {/* tronco */}
      <path d="M40 38 C 36 44, 34 54, 36 64 L 56 64 C 58 54, 56 44, 52 38 C 48 35, 44 35, 40 38 Z" fill="#8A7FA8" />

      {/* braços digitando */}
      <g className="typing-arm-l">
        <path d="M50 46 C 58 48, 66 52, 74 56 L 72 61 C 64 58, 56 55, 49 53 Z" fill="#E8B9A0" />
      </g>
      <g className="typing-arm-r">
        <path d="M52 50 C 60 53, 68 57, 78 60 L 76 65 C 67 62, 58 58, 51 56 Z" fill="#D9A98F" />
      </g>

      {/* pernas */}
      <path d="M38 64 L 56 64 L 58 74 L 44 74 Z" fill="#5A5468" />
      <rect x="42" y="74" width="7" height="18" rx="3" fill="#5A5468" />
      <rect x="52" y="74" width="7" height="18" rx="3" fill="#5A5468" />
      <rect x="40" y="91" width="12" height="4" rx="2" fill="#3C3C44" />
      <rect x="50" y="91" width="12" height="4" rx="2" fill="#3C3C44" />

      {/* mesa */}
      <rect x="70" y="66" width="92" height="6" rx="3" fill="#55555E" />
      <rect x="80" y="72" width="7" height="26" rx="3" fill="#44444C" />
      <rect x="146" y="72" width="7" height="26" rx="3" fill="#44444C" />

      {/* notebook */}
      <g>
        {/* tela */}
        <rect x="96" y="34" width="44" height="30" rx="3" fill="#2E2E36" stroke="#55555E" strokeWidth="2" />
        <rect className="pc-glow" x="100" y="38" width="36" height="22" rx="2" fill="#9AB8CC" />
        {/* linhas de "código" na tela */}
        <g fill="#5F7A8C">
          <rect x="103" y="42" width="18" height="2.4" rx="1.2" />
          <rect x="103" y="47" width="26" height="2.4" rx="1.2" />
          <rect x="103" y="52" width="14" height="2.4" rx="1.2" />
        </g>
        {/* base / teclado */}
        <path d="M92 64 L 144 64 L 148 68 L 88 68 Z" fill="#4A4A52" />
      </g>

      {/* caneca */}
      <rect x="152" y="58" width="8" height="9" rx="2" fill="#6E6E78" />
    </svg>
  );
}

// ─── World3DCard (Hub cards) ───────────────────────────────────────────────────

interface World3DCardProps {
  worldId: WorldId;
  index: number;
  onClick: () => void;
}

function World3DCard({ worldId, index, onClick }: World3DCardProps) {
  const world = WORLDS[worldId];
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const animRef = useRef<number>(0);
  const currentTilt = useRef({ x: 0, y: 0 });

  const applyTilt = useCallback((nx: number, ny: number) => {
    const target = { x: -ny * 16, y: nx * 16 };
    const animate = () => {
      currentTilt.current.x += (target.x - currentTilt.current.x) * 0.12;
      currentTilt.current.y += (target.y - currentTilt.current.y) * 0.12;
      setTilt({ ...currentTilt.current });
      setShinePos({ x: 50 + nx * 30, y: 50 - ny * 30 });
      animRef.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const resetTilt = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    const animate = () => {
      currentTilt.current.x += (0 - currentTilt.current.x) * 0.08;
      currentTilt.current.y += (0 - currentTilt.current.y) * 0.08;
      setTilt({ ...currentTilt.current });
      if (Math.abs(currentTilt.current.x) > 0.1 || Math.abs(currentTilt.current.y) > 0.1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setTilt({ x: 0, y: 0 });
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    applyTilt(nx, ny);
  }, [applyTilt]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const shadowX = tilt.y * 2;
  const shadowY = tilt.x * -2;
  const shadowBlur = 40 + Math.abs(tilt.x) + Math.abs(tilt.y);

  const isTikTok = worldId === "tiktok";
  const isMercado = worldId === "mercado";
  const emConstrucao = isTikTok || isMercado; // mundos ainda não publicados

  const handleClick = () => {
    if (emConstrucao) return; // Mercado Livre e TikTok ainda em produção
    onClick();
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1200px", cursor: emConstrucao ? "default" : "pointer" }}
      className="w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setInteracting(false); resetTilt(); }}
      onMouseEnter={() => setInteracting(true)}
      onClick={handleClick}
      role="button"
      aria-label={emConstrucao ? `${world.name} — em construção` : `Entrar no mundo ${world.name}`}
      aria-disabled={emConstrucao}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div
        className={`hub-card-${index} ${interacting ? "hub-card-interacting" : ""} relative overflow-hidden`}
        style={{
          transformStyle: "preserve-3d",
          transform: interacting
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : undefined,
          transition: interacting ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          borderRadius: world.radius,
          background: isTikTok
            ? "linear-gradient(135deg, #26262B 0%, #35353C 55%, #2B2B30 100%)"
            : world.cardGrad,
          minHeight: "170px",
          boxShadow: `${shadowX}px ${shadowY + 20}px ${shadowBlur}px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)`,
          willChange: "transform",
        }}
      >
        {/* Back depth layer */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            backgroundImage: isTikTok
              ? "radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)"
              : isMercado
              ? "radial-gradient(ellipse at 30% 70%, rgba(52,131,250,0.12) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)",
            borderRadius: "inherit",
          }}
        />

        {/* Floating emoji decorations / animação em construção */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "inherit" }}>
          {isTikTok ? (
            <div style={{ position: "absolute", right: "6px", bottom: "2px", opacity: 0.9 }}>
              <TypingGirl />
            </div>
          ) : world.emojis.slice(0, 3).map((emoji, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                fontSize: i === 0 ? "34px" : i === 1 ? "24px" : "18px",
                top: i === 0 ? "12%" : i === 1 ? "55%" : "20%",
                left: i === 0 ? "68%" : i === 1 ? "78%" : "82%",
                opacity: i === 0 ? 0.9 : 0.5,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                transform: `translateZ(${20 + i * 10}px) rotate(${[-8, 12, -5][i]}deg)`,
                userSelect: "none",
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Content layer */}
        <div
          className="relative flex flex-col justify-between p-6"
          style={{
            minHeight: "170px",
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div>
            {isTikTok ? (
              <h2
                className="font-black uppercase tracking-wider"
                style={{
                  fontFamily: world.font,
                  fontSize: "clamp(28px, 8vw, 38px)",
                  color: "#9A9AA5",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                }}
              >
                {world.name}
              </h2>
            ) : isMercado ? (
              <h2
                style={{
                  fontFamily: world.font,
                  fontSize: "clamp(26px, 7vw, 36px)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  lineHeight: 1,
                }}
              >
                {world.name}
              </h2>
            ) : (
              <h2
                style={{
                  fontFamily: world.font,
                  fontSize: "clamp(28px, 8vw, 38px)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1,
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {world.name}
              </h2>
            )}
            <p
              style={{
                fontFamily: world.font,
                fontSize: "15px",
                fontWeight: 600,
                marginTop: "6px",
                color: isMercado ? "#444" : isTikTok ? "#84848F" : "rgba(255,255,255,0.85)",
              }}
            >
              {world.tagline}
            </p>
          </div>

          {/* CTA row */}
          <div
            className="flex items-center gap-3 mt-4"
            style={{ justifyContent: isMercado ? "center" : "flex-start" }}
          >
            <span
              style={{
                fontFamily: world.font,
                fontSize: isTikTok ? "13px" : "14px",
                fontWeight: 700,
                letterSpacing: isTikTok ? "0.1em" : "0.02em",
                textTransform: isTikTok ? "uppercase" : "none",
                color: isMercado ? "#7A6A00" : isTikTok ? "#9A9AA5" : "rgba(255,255,255,0.9)",
                background: isMercado ? "rgba(0,0,0,0.08)" : isTikTok ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                padding: "8px 18px",
                borderRadius: isTikTok ? "3px" : "100px",
                border: isMercado ? "1.5px solid rgba(0,0,0,0.18)" : isTikTok ? "1.5px solid rgba(255,255,255,0.18)" : "1.5px solid rgba(255,255,255,0.3)",
                minHeight: "36px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isTikTok ? "🚧 EM CONSTRUÇÃO" : isMercado ? "🛠️ Em produção" : "Explorar →"}
            </span>
          </div>
        </div>

        {/* Shine overlay (follows tilt) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            background: `radial-gradient(ellipse at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
            transition: interacting ? "none" : "background 0.6s ease-out",
            mixBlendMode: "screen",
          }}
        />

        {/* Moving shine on hover */}
        {interacting && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute", top: 0, left: "-60%", width: "40%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                transform: "skewX(-15deg)",
                animation: "shine-sweep 0.8s ease forwards",
              }}
            />
          </div>
        )}

        {/* TikTok: borda sutil (em construção) */}
        {isTikTok && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, borderRadius: world.radius,
              pointerEvents: "none",
              boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.10)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── ProductCard ───────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  world: typeof WORLDS[WorldId];
  index: number;
  isTikTok?: boolean;
}

function ProductCard({ product, world, index, isTikTok }: ProductCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setTilt({ x: -ny * 6, y: nx * 6 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        perspective: "600px",
        fontFamily: world.font,
      }}
    >
      <div
        style={{
          background: world.cardBg,
          borderRadius: world.cardRadius,
          border: `1.5px solid ${world.cardBorder}`,
          overflow: "hidden",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
          boxShadow: `${tilt.y}px ${-tilt.x + 4}px 20px rgba(0,0,0,${isTikTok ? "0.5" : "0.12"})`,
          willChange: "transform",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: isTikTok ? "9/16" : "1/1",
            background: "#e8e8e8",
            overflow: "hidden",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {isTikTok && (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "48px", height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.4)",
              }}>
                <Play size={20} fill="white" color="white" />
              </div>
            </div>
          )}
          {product.badge && (
            <span
              className={world.id === "shopee" ? "badge-pulse" : ""}
              style={{
                position: "absolute", top: "10px", left: "10px",
                background: world.badgeBg,
                color: world.badgeText,
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: world.id === "tiktok" ? "3px" : "100px",
                letterSpacing: world.id === "tiktok" ? "0.05em" : "0",
                textTransform: world.id === "tiktok" ? "uppercase" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: world.id === "shopee" ? 700 : world.id === "tiktok" ? 600 : 500,
              color: world.text,
              lineHeight: 1.3,
              letterSpacing: world.id === "tiktok" ? "0.02em" : "0",
              textTransform: world.id === "tiktok" ? "uppercase" : "none",
              flex: 1,
            }}
          >
            {product.title}
          </p>

          {/* Mercado Livre: frete grátis indicator */}
          {world.id === "mercado" && (
            <p style={{ fontSize: "12px", color: "#00A650", fontWeight: 600 }}>
              ✓ Frete grátis disponível
            </p>
          )}

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              background: world.btnBg,
              color: world.btnText,
              fontSize: "13px",
              fontWeight: 700,
              padding: "10px",
              borderRadius: world.id === "tiktok" ? "3px" : "8px",
              textDecoration: "none",
              minHeight: "42px",
              letterSpacing: world.id === "tiktok" ? "0.08em" : "0",
              textTransform: world.id === "tiktok" ? "uppercase" : "none",
              transition: "opacity 0.15s",
              boxShadow: `0 4px 12px ${world.btnBg}44`,
            }}
            aria-label={`Ver ${product.title}`}
          >
            {world.id === "tiktok" ? <Play size={14} fill="white" /> : <ExternalLink size={13} />}
            {world.id === "tiktok" ? "VER VÍDEO" : "Ver oferta"}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FilterChips ───────────────────────────────────────────────────────────────

interface FilterChipsProps {
  filters: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
  world: typeof WORLDS[WorldId];
}

function FilterChips({ filters, active, onSelect, world }: FilterChipsProps) {
  return (
    <div
      style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 16px 4px", scrollSnapType: "x mandatory" }}
      role="group"
      aria-label="Filtros de categoria"
    >
      {filters.map((f) => {
        const isActive = f.id === active;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            style={{
              flexShrink: 0,
              padding: "9px 16px",
              borderRadius: "100px",
              border: isActive
                ? `1.5px solid ${world.chipActiveBg}`
                : `1.5px solid ${world.id === "tiktok" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              background: isActive ? world.chipActiveBg : world.chipBg,
              color: isActive ? world.chipActiveText : world.chipText,
              fontSize: world.id === "tiktok" ? "12px" : "13px",
              fontWeight: 700,
              fontFamily: world.font,
              letterSpacing: world.id === "tiktok" ? "0.08em" : "0.01em",
              textTransform: world.id === "tiktok" ? "uppercase" : "none",
              cursor: "pointer",
              minHeight: "40px",
              scrollSnapAlign: "start",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ world }: { world: typeof WORLDS[WorldId] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "16px" }}
    >
      <span style={{ fontSize: "56px" }} aria-hidden="true">🔍</span>
      <p style={{ fontFamily: world.font, fontSize: "20px", fontWeight: 700, color: world.text, textAlign: "center" }}>
        Novidades chegando
      </p>
      <p style={{ fontFamily: world.font, fontSize: "15px", color: world.textMuted, textAlign: "center", maxWidth: "260px" }}>
        Esta categoria ainda está sendo preparada. Volte em breve!
      </p>
    </motion.div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer({ world }: { world?: typeof WORLDS[WorldId] }) {
  const bg = world ? world.screenBg : "transparent";
  const text = world ? world.textMuted : "#BEE7FF";
  const font = world ? world.font : "'Plus Jakarta Sans', sans-serif";
  const borderColor = world
    ? (world.id === "tiktok" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")
    : "rgba(190,231,255,0.15)";

  return (
    <footer
      style={{
        background: bg,
        borderTop: `1px solid ${borderColor}`,
        padding: "24px 24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ display: "flex", gap: "20px", marginBottom: "4px" }}>
        <a
          href="https://www.instagram.com/marianabritoig?igsh=aW8xcnhtNXN0ZHlm"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: font, fontSize: "13px", fontWeight: 600,
            color: text, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "6px",
            minHeight: "44px",
            padding: "4px 8px",
          }}
          aria-label="Instagram @marianabritoig"
        >
          <span aria-hidden="true">📸</span> @marianabritoig
        </a>
      </div>
      <p style={{ fontFamily: font, fontSize: "12px", color: text, textAlign: "center", lineHeight: 1.5, maxWidth: "320px" }}>
        Aqui você encontra os produtos que eu amo e recomendo. 🧡
      </p>
    </footer>
  );
}

// URL do site da Shopee já publicado (mundo ativo)
const SHOPEE_SITE_URL = "https://shoppe-zeta-three.vercel.app/";

// ─── Hub Screen ────────────────────────────────────────────────────────────────

// ─── OceanBackground (fundo do mar interativo) ─────────────────────────────────

function Fish({ color, size, id }: { color: string; size: number; id: string }) {
  const gid = `fish-${id}`;
  return (
    <svg viewBox="0 0 78 44" width={size} height={size * (44 / 78)} aria-hidden="true" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,10,30,0.35))" }}>
      <defs>
        {/* volume do corpo: luz em cima, sombra embaixo */}
        <linearGradient id={`${gid}-hl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}-sh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#001b2e" stopOpacity="0" />
          <stop offset="1" stopColor="#001b2e" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${gid}-spec`} cx="0.35" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* corpo reutilizável */}
        <path id={`${gid}-body`} d="M10 22 C 16 7, 44 7, 54 20 C 55 21, 55 23, 54 24 C 44 37, 16 37, 10 22 Z" />
      </defs>

      {/* cauda (animada) */}
      <g className="fish-tail" style={{ transformOrigin: "54px 22px" }}>
        <path d="M54 22 C 62 15, 69 11, 76 8 C 71 16, 71 28, 76 36 C 69 33, 62 29, 54 22 Z" fill={color} />
        <path d="M54 22 C 62 15, 69 11, 76 8 C 71 16, 71 28, 76 36 C 69 33, 62 29, 54 22 Z" fill={`url(#${gid}-sh)`} />
      </g>

      {/* barbatana dorsal */}
      <path d="M28 9 C 33 1, 43 1, 46 8 C 39 8, 33 9, 29 12 Z" fill={color} opacity="0.9" />
      {/* barbatana ventral */}
      <path d="M30 34 C 33 41, 41 42, 44 36 C 38 36, 33 35, 31 33 Z" fill={color} opacity="0.75" />

      {/* corpo com sombreamento 3D */}
      <use href={`#${gid}-body`} fill={color} />
      <use href={`#${gid}-body`} fill={`url(#${gid}-hl)`} />
      <use href={`#${gid}-body`} fill={`url(#${gid}-sh)`} />
      <use href={`#${gid}-body`} fill={`url(#${gid}-spec)`} />

      {/* guelra */}
      <path d="M24 12 C 21 16, 21 28, 24 32" fill="none" stroke="#001b2e" strokeOpacity="0.18" strokeWidth="1.6" strokeLinecap="round" />

      {/* olho */}
      <circle cx="19" cy="20" r="3" fill="#ffffff" />
      <circle cx="19.8" cy="20.2" r="1.7" fill="#0A2540" />
      <circle cx="18.6" cy="19.2" r="0.7" fill="#ffffff" />
    </svg>
  );
}

function Algae({ tall, color, tip, className }: { tall: number; color: string; tip: string; className: string }) {
  const gid = `al-${tall}-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 30 ${tall}`} width={30} height={tall} aria-hidden="true" className={className} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={tip} />
        </linearGradient>
      </defs>
      {/* folha principal (preenchida, com brilho) */}
      <path
        d={`M15 ${tall}
            C 5 ${tall * 0.72}, 24 ${tall * 0.55}, 12 ${tall * 0.34}
            C 5 ${tall * 0.2}, 18 ${tall * 0.08}, 15 0
            C 19 ${tall * 0.1}, 12 ${tall * 0.22}, 19 ${tall * 0.36}
            C 27 ${tall * 0.54}, 22 ${tall * 0.74}, 15 ${tall} Z`}
        fill={`url(#${gid})`}
        opacity="0.92"
      />
      {/* nervura clara pra dar volume */}
      <path
        d={`M15 ${tall} C 8 ${tall * 0.7}, 20 ${tall * 0.5}, 13 ${tall * 0.3} C 8 ${tall * 0.16}, 16 ${tall * 0.06}, 15 0`}
        fill="none" stroke={tip} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

function OceanBackground() {
  const fishes = [
    { top: "16%", dur: 24, delay: 0, dir: "r", color: "#FF9F4D", size: 52, blur: 0, op: 1, bob: 3.4 },
    { top: "30%", dur: 33, delay: 5, dir: "l", color: "#7FE7FF", size: 34, blur: 1.2, op: 0.7, bob: 4.2 },
    { top: "46%", dur: 28, delay: 9, dir: "r", color: "#FFD24D", size: 44, blur: 0, op: 1, bob: 3.8 },
    { top: "60%", dur: 37, delay: 2, dir: "l", color: "#FF7D9C", size: 30, blur: 1.4, op: 0.65, bob: 4.6 },
    { top: "74%", dur: 26, delay: 13, dir: "r", color: "#8FF0C4", size: 40, blur: 0, op: 1, bob: 3.2 },
    { top: "86%", dur: 40, delay: 7, dir: "l", color: "#C9A8FF", size: 26, blur: 1.6, op: 0.6, bob: 5 },
  ];
  const bubbles = [
    { left: "12%", dur: 9, delay: 0, size: 8 },
    { left: "28%", dur: 12, delay: 3, size: 5 },
    { left: "48%", dur: 10, delay: 6, size: 11 },
    { left: "66%", dur: 13, delay: 1, size: 6 },
    { left: "84%", dur: 8, delay: 4, size: 7 },
    { left: "92%", dur: 11, delay: 8, size: 4 },
  ];
  const plankton = [
    { left: "20%", top: "40%", dur: 14, delay: 0 },
    { left: "40%", top: "60%", dur: 18, delay: 4 },
    { left: "58%", top: "30%", dur: 16, delay: 8 },
    { left: "74%", top: "55%", dur: 20, delay: 2 },
    { left: "88%", top: "44%", dur: 15, delay: 6 },
    { left: "10%", top: "70%", dur: 17, delay: 10 },
  ];

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {/* Brilho suave da superfície */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "radial-gradient(120% 100% at 50% 0%, rgba(150,225,255,0.28), transparent 70%)" }} />

      {/* Raios de luz (god rays) que se movem */}
      <div style={{ position: "absolute", top: "-10%", left: "10%", width: "60px", height: "120%", background: "linear-gradient(to bottom, rgba(180,240,255,0.35), transparent 75%)", filter: "blur(6px)", willChange: "transform, opacity", animation: "godray-drift 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "-10%", left: "44%", width: "90px", height: "120%", background: "linear-gradient(to bottom, rgba(160,230,255,0.28), transparent 72%)", filter: "blur(8px)", willChange: "transform, opacity", animation: "godray-drift 11s ease-in-out infinite 2s" }} />
      <div style={{ position: "absolute", top: "-10%", left: "76%", width: "50px", height: "120%", background: "linear-gradient(to bottom, rgba(180,240,255,0.3), transparent 75%)", filter: "blur(6px)", willChange: "transform, opacity", animation: "godray-drift 10s ease-in-out infinite 4s" }} />

      {/* Plâncton flutuando */}
      {plankton.map((p, i) => (
        <div key={`pk-${i}`} style={{ position: "absolute", left: p.left, top: p.top, width: "3px", height: "3px", borderRadius: "50%", background: "rgba(200,245,255,0.8)", boxShadow: "0 0 4px rgba(200,245,255,0.6)", willChange: "transform, opacity", animation: `plankton-drift ${p.dur}s ease-in-out infinite`, animationDelay: `${p.delay}s` }} />
      ))}

      {/* Peixinhos (nado + balanço, com profundidade) */}
      {fishes.map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: f.top, left: 0,
            willChange: "transform",
            animation: `${f.dir === "r" ? "fish-swim-r" : "fish-swim-l"} ${f.dur}s linear infinite`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <div style={{ transform: f.dir === "r" ? "scaleX(-1)" : "none", filter: f.blur ? `blur(${f.blur}px)` : "none", opacity: f.op }}>
            <div style={{ willChange: "transform", animation: `fish-bob ${f.bob}s ease-in-out infinite`, animationDelay: `${f.delay * 0.5}s` }}>
              <Fish color={f.color} size={f.size} id={`${i}`} />
            </div>
          </div>
        </div>
      ))}

      {/* Bolhas subindo */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute", bottom: "-20px", left: b.left,
            width: `${b.size}px`, height: `${b.size}px`, borderRadius: "50%",
            background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(180,235,255,0.2) 70%)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "inset -1px -1px 2px rgba(0,40,70,0.2)",
            willChange: "transform, opacity",
            animation: `bubble-rise ${b.dur}s ease-in infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Leito de areia no fundo */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70px", background: "radial-gradient(120% 90% at 50% 100%, rgba(60,95,120,0.55), transparent 70%)" }} />

      {/* Algas no fundo (mais volumosas) */}
      <div style={{ position: "absolute", bottom: "-8px", left: 0, right: 0, height: "170px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 3vw" }}>
        <Algae tall={130} color="#0F7A52" tip="#3FD69A" className="algae-sway" />
        <Algae tall={95}  color="#128A5C" tip="#4FE0A6" className="algae-sway-2" />
        <Algae tall={160} color="#0C6B48" tip="#39CC90" className="algae-sway" />
        <Algae tall={75}  color="#159A66" tip="#5CE8B0" className="algae-sway-2" />
        <Algae tall={140} color="#0F7A52" tip="#3FD69A" className="algae-sway" />
        <Algae tall={108} color="#128A5C" tip="#4FE0A6" className="algae-sway-2" />
        <Algae tall={150} color="#0C6B48" tip="#39CC90" className="algae-sway" />
      </div>

      {/* Profundidade (escurece o fundo) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 52%, rgba(2,18,40,0.6) 100%)" }} />
    </div>
  );
}

// ─── HubScreen ─────────────────────────────────────────────────────────────────

interface HubScreenProps {
  onEnterWorld: (id: WorldId) => void;
}

function HubScreen({ onEnterWorld }: HubScreenProps) {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "linear-gradient(180deg, #1E6FA8 0%, #12507E 34%, #0A3A63 64%, #052642 100%)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Ocean bg */}
      <OceanBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ padding: "48px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "80px", height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #EE4D2D 0%, #25F4EE 50%, #FFE600 100%)",
            padding: "3px",
            boxShadow: "0 0 30px rgba(37,244,238,0.3)",
          }}
          aria-label="Avatar do perfil"
        >
          <img
            src={avatarImg}
            alt="Foto de perfil"
            width={150}
            height={150}
            style={{
              width: "100%", height: "100%", borderRadius: "50%",
              objectFit: "cover", display: "block", background: "#1A1A2E",
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0 }}>
            Meus Achadinhos
          </h1>
        </div>

        <p
          style={{
            fontSize: "14px", color: "#BEE7FF",
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontWeight: 500, marginTop: "4px",
          }}
        >
          Escolha seu mundo
        </p>
      </motion.div>

      {/* World Cards */}
      <div
        style={{
          flex: 1,
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "480px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
        className="lg:grid-cols-3 lg:max-w-5xl lg:gap-6 lg:grid"
      >
        {(["shopee", "mercado", "tiktok"] as WorldId[]).map((id, i) => (
          <World3DCard
            key={id}
            worldId={id}
            index={i}
            onClick={() => {
              if (id === "shopee") {
                window.location.assign(SHOPEE_SITE_URL);
              } else {
                onEnterWorld(id);
              }
            }}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

// ─── World Screen ──────────────────────────────────────────────────────────────

interface WorldScreenProps {
  worldId: WorldId;
  onBack: () => void;
}

function WorldScreen({ worldId, onBack }: WorldScreenProps) {
  const world = WORLDS[worldId];
  const [activeFilter, setActiveFilter] = useState("todos");
  const isTikTok = worldId === "tiktok";

  const filtered = activeFilter === "todos"
    ? world.products
    : (world.products as Product[]).filter((p) => p.category === activeFilter);

  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: world.screenBg,
        display: "flex",
        flexDirection: "column",
        fontFamily: world.font,
      }}
    >
      {/* Header */}
      <header
        style={{
          background: world.headerGrad,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minHeight: "64px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: isTikTok
            ? "0 1px 0 rgba(37,244,238,0.2), 0 4px 20px rgba(0,0,0,0.5)"
            : "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            border: "none",
            background: isTikTok ? "rgba(37,244,238,0.15)" : worldId === "mercado" ? "rgba(52,131,250,0.12)" : "rgba(255,255,255,0.2)",
            color: isTikTok ? "#25F4EE" : worldId === "mercado" ? "#3483FA" : "#FFFFFF",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "opacity 0.2s",
          }}
          aria-label="Voltar ao hub"
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ flex: 1 }}>
          {isTikTok ? (
            <h1
              className="neon-text"
              style={{
                fontSize: "22px", fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textShadow: "2px 0 #25F4EE, -2px 0 #FE2C55",
                margin: 0,
              }}
            >
              {world.name}
            </h1>
          ) : (
            <h1
              style={{
                fontSize: "20px",
                fontWeight: worldId === "shopee" ? 800 : 700,
                color: worldId === "mercado" ? "#1A1A1A" : "#FFFFFF",
                margin: 0,
              }}
            >
              {world.name}
            </h1>
          )}
          <p style={{
            fontSize: "12px",
            color: isTikTok ? "#25F4EE" : worldId === "mercado" ? "#666" : "rgba(255,255,255,0.75)",
            letterSpacing: isTikTok ? "0.1em" : 0,
            textTransform: isTikTok ? "uppercase" : "none",
            margin: 0,
          }}>
            {world.tagline}
          </p>
        </div>

        {/* World emoji badge */}
        <span aria-hidden="true" style={{ fontSize: "20px" }}>{world.emojis[0]}</span>
      </header>

      {/* Filter Chips */}
      <div style={{ paddingTop: "16px", paddingBottom: "8px", position: "sticky", top: "64px", zIndex: 9, background: world.screenBg, boxShadow: `0 2px 8px ${world.screenBg}` }}>
        <FilterChips
          filters={world.filters as { id: string; label: string }[]}
          active={activeFilter}
          onSelect={handleFilterChange}
          world={world}
        />
      </div>

      {/* Mercado Livre: "Chegando amanhã" hero banner */}
      {worldId === "mercado" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            margin: "16px 16px 4px",
            padding: "14px 18px",
            background: "linear-gradient(90deg, #FFE600 0%, #FFF59D 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: "24px" }} aria-hidden="true">🚚</span>
          <div>
            <p style={{ fontFamily: world.font, fontSize: "14px", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Frete grátis em centenas de produtos</p>
            <p style={{ fontFamily: world.font, fontSize: "12px", color: "#555", margin: 0 }}>Compra garantida pelo Mercado Livre</p>
          </div>
        </motion.div>
      )}

      {/* TikTok: neon section divider */}
      {isTikTok && (
        <div style={{ margin: "12px 16px 0", height: "1px", background: "linear-gradient(90deg, transparent, #25F4EE, #FE2C55, transparent)" }} aria-hidden="true" />
      )}

      {/* Product Grid */}
      <main style={{ flex: 1, padding: "16px", paddingBottom: "24px" }}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState key="empty" world={world} />
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
              className="sm:[grid-template-columns:repeat(3,1fr)] lg:[grid-template-columns:repeat(4,1fr)]"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  world={world}
                  index={i}
                  isTikTok={isTikTok}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer world={world} />
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<"hub" | WorldId>("hub");

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <AnimatePresence mode="wait">
        {screen === "hub" ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <HubScreen onEnterWorld={(id) => setScreen(id)} />
          </motion.div>
        ) : (
          <motion.div
            key={screen}
            initial={{ opacity: 0, scale: 1.04, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <WorldScreen worldId={screen as WorldId} onBack={() => setScreen("hub")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
