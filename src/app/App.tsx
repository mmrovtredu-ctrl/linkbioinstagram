import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Code2,
  FolderGit2,
  GraduationCap,
  ArrowUpRight,
  Terminal,
  Rocket,
  Cpu,
  Instagram,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   EDITE AQUI  —  seus dados e links
   ═══════════════════════════════════════════════════════════════════════ */

const PROFILE = {
  name: "Eduardo",
  handle: "@eduardo_devjr",
  // frases que aparecem sendo "digitadas" no topo (troque à vontade)
  roles: ["Criador de Sites", "Desenvolvedor Web", "Do zero à renda online"],
};

interface LinkItem {
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Code2;
  cmd: string; // "comando" estilo terminal exibido no card
}

const LINKS: LinkItem[] = [
  {
    title: "Meu Portfólio",
    subtitle: "Projetos e sites que eu criei",
    href: "https://potifolio1-orcin.vercel.app/",
    icon: FolderGit2,
    cmd: "open ./portfolio",
  },
  {
    title: "Curso Renda com Sites",
    subtitle: "Aprenda a criar sites e faturar",
    href: "https://renda-com-sites.vercel.app/",
    icon: GraduationCap,
    cmd: "run curso.rendacomsites",
  },
  {
    title: "Instagram",
    subtitle: "Bastidores e conteúdo no @eduardo_devjr",
    href: "https://www.instagram.com/eduardo_devjr/",
    icon: Instagram,
    cmd: "follow @eduardo_devjr",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   Fundo animado — "chuva de código" (matrix) em <canvas>
   ═══════════════════════════════════════════════════════════════════════ */

function MatrixRain() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glyphs =
      "01</>{}[]();=+-*&|!$#@%λΣΦ大コ日ンアイウカサ0123456789abcdef=>".split("");

    let fontSize = 15;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = window.innerWidth < 520 ? 13 : 15;
      cols = Math.ceil(window.innerWidth / fontSize);
      drops = new Array(cols)
        .fill(0)
        .map(() => Math.random() * (window.innerHeight / fontSize));
      // fundo base
      ctx.fillStyle = "#02060c";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function draw(t: number) {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return;
      last = t;
      if (!canvas || !ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // rastro que some devagar
      ctx.fillStyle = "rgba(2,6,12,0.10)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const lead = Math.random() > 0.977;
        ctx.fillStyle = lead ? "#eafff5" : "#25c979";
        if (lead) {
          ctx.shadowColor = "#16b866";
          ctx.shadowBlur = 10;
        }
        ctx.fillText(ch, x, y);
        ctx.shadowBlur = 0;
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) {
      raf = requestAnimationFrame(draw);
    } else {
      // versão estática discreta quando o usuário pede menos movimento
      ctx.fillStyle = "rgba(37,201,121,0.10)";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < Math.ceil(window.innerHeight / fontSize); j += 3) {
          if (Math.random() > 0.6) continue;
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * fontSize, j * fontSize);
        }
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, display: "block" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Efeito "digitando" para as frases do perfil
   ═══════════════════════════════════════════════════════════════════════ */

function useTypewriter(words: string[], typeMs = 85, deleteMs = 40, pauseMs = 1500) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = words[idx % words.length];
    let to: ReturnType<typeof setTimeout>;

    if (!deleting && text === full) {
      to = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx((v) => v + 1);
    } else {
      to = setTimeout(
        () => {
          setText(full.substring(0, deleting ? text.length - 1 : text.length + 1));
        },
        deleting ? deleteMs : typeMs,
      );
    }
    return () => clearTimeout(to);
  }, [text, deleting, idx, words, typeMs, deleteMs, pauseMs]);

  return text;
}

/* ═══════════════════════════════════════════════════════════════════════
   App
   ═══════════════════════════════════════════════════════════════════════ */

export default function App() {
  const typed = useTypewriter(PROFILE.roles);

  useEffect(() => {
    document.title = `${PROFILE.name} • Links`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `Links de ${PROFILE.name} — portfólio, curso e projetos.`);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100%",
        width: "100%",
        background: "#02060c",
        color: "#e8fff4",
        fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      <StyleTag />
      <MatrixRain />

      {/* brilho ambiente */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(37,201,121,0.18), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(55,230,255,0.10), transparent 70%)",
        }}
      />
      {/* vinheta pra dar contraste ao conteúdo */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(2,6,12,0.75) 100%)",
        }}
      />

      <main
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 480,
          margin: "0 auto",
          padding: "clamp(28px, 8vw, 56px) 20px 44px",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* barrinha "terminal" */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            color: "#7fae97",
            border: "1px solid rgba(37,201,121,0.25)",
            background: "rgba(6,16,12,0.6)",
            backdropFilter: "blur(6px)",
            padding: "6px 12px",
            borderRadius: 999,
            marginBottom: 26,
          }}
        >
          <span style={{ display: "inline-flex", gap: 5 }}>
            <i style={dot("#ff5f57")} />
            <i style={dot("#febc2e")} />
            <i style={dot("#28c840")} />
          </span>
          <Terminal size={13} color="#25c979" />
          <span>~/{PROFILE.name.toLowerCase()} — links</span>
        </motion.div>

        {/* avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
          style={{ position: "relative", width: 116, height: 116, marginBottom: 18 }}
        >
          <div className="lb-ring" style={ringStyle} />
          <div
            style={{
              position: "absolute",
              inset: 5,
              borderRadius: "50%",
              background: "linear-gradient(160deg,#0a1a13,#04100a)",
              border: "1px solid rgba(37,201,121,0.4)",
              display: "grid",
              placeItems: "center",
              boxShadow: "inset 0 0 26px rgba(37,201,121,0.25)",
            }}
          >
            <Code2 size={46} color="#37e6ff" strokeWidth={2.2} />
          </div>
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.15, 1], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              position: "absolute",
              right: 4,
              bottom: 6,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#25c979",
              border: "3px solid #02060c",
              boxShadow: "0 0 12px #25c979",
            }}
          />
        </motion.div>

        {/* nome + handle */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "clamp(1.6rem, 7vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: 0,
            textAlign: "center",
            background: "linear-gradient(180deg,#ffffff,#8ff0c4)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {PROFILE.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          style={{
            margin: "4px 0 0",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 13,
            color: "#37e6ff",
          }}
        >
          {PROFILE.handle}
        </motion.p>

        {/* frase digitando */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
          style={{
            margin: "14px 0 30px",
            minHeight: 22,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 14,
            color: "#bfe9d4",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#25c979" }}>&gt;_ </span>
          {typed}
          <span className="lb-caret">▍</span>
        </motion.p>

        {/* links principais */}
        <div style={{ width: "100%", display: "grid", gap: 14 }}>
          {LINKS.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.14, type: "spring", stiffness: 130, damping: 16 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="lb-card"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 16px",
                borderRadius: 16,
                textDecoration: "none",
                color: "#e8fff4",
                background:
                  "linear-gradient(150deg, rgba(11,26,19,0.92), rgba(4,14,10,0.92))",
                border: "1px solid rgba(37,201,121,0.28)",
                overflow: "hidden",
                boxShadow: "0 12px 30px -18px rgba(0,0,0,0.9)",
              }}
            >
              <span aria-hidden className="lb-shine" />
              <span
                style={{
                  flex: "0 0 auto",
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(37,201,121,0.12)",
                  border: "1px solid rgba(37,201,121,0.35)",
                  boxShadow: "inset 0 0 18px rgba(37,201,121,0.18)",
                }}
              >
                <link.icon size={24} color="#25c979" strokeWidth={2.2} />
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                  {link.title}
                </span>
                <span style={{ display: "block", fontSize: 13, color: "#8fc7ac", marginTop: 2 }}>
                  {link.subtitle}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 7,
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    color: "#37e6ff",
                    background: "rgba(55,230,255,0.08)",
                    border: "1px solid rgba(55,230,255,0.2)",
                    borderRadius: 6,
                    padding: "2px 7px",
                  }}
                >
                  $ {link.cmd}
                </span>
              </span>

              <motion.span
                aria-hidden
                initial={false}
                whileHover={{ rotate: 0 }}
                style={{
                  flex: "0 0 auto",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(37,201,121,0.3)",
                }}
              >
                <ArrowUpRight size={18} color="#25c979" />
              </motion.span>
            </motion.a>
          ))}
        </div>

        {/* rodapé stats fake tech + assinatura */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: 30,
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            color: "#6f9a83",
          }}
        >
          <span style={statChip}>
            <Rocket size={13} color="#25c979" /> deploy&nbsp;<b style={{ color: "#cfeede" }}>ready</b>
          </span>
          <span style={statChip}>
            <Cpu size={13} color="#37e6ff" /> 100%&nbsp;<b style={{ color: "#cfeede" }}>online</b>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          style={{
            marginTop: "auto",
            paddingTop: 28,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            color: "#3f5c4d",
            textAlign: "center",
          }}
        >
          {"// feito com código & cafeína"} <span style={{ color: "#25c979" }}>{"</>"}</span>
        </motion.p>
      </main>
    </div>
  );
}

/* ═══════════════════════════════ helpers de estilo ═══════════════════════ */

function dot(color: string) {
  return {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  } as const;
}

const ringStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background:
    "conic-gradient(from 0deg, #25c979, #37e6ff, #1b8fff, #25c979)",
  filter: "blur(1px)",
} as const;

const statChip = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 10px",
  borderRadius: 999,
  border: "1px solid rgba(37,201,121,0.2)",
  background: "rgba(6,16,12,0.5)",
} as const;

/* keyframes / animações CSS injetadas */
function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      html, body, #root { background: #02060c; }
      * { -webkit-tap-highlight-color: transparent; }
      .lb-ring { animation: lb-spin 5s linear infinite; }
      @keyframes lb-spin { to { transform: rotate(360deg); } }
      .lb-caret { animation: lb-blink 1s steps(1) infinite; color:#25c979; margin-left:1px; }
      @keyframes lb-blink { 50% { opacity: 0; } }
      .lb-card .lb-shine {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.10) 50%, transparent 65%);
        transform: translateX(-120%);
      }
      .lb-card:hover { border-color: rgba(37,201,121,0.65) !important;
        box-shadow: 0 18px 40px -18px rgba(37,201,121,0.35), 0 0 0 1px rgba(37,201,121,0.25) !important; }
      .lb-card:hover .lb-shine { animation: lb-shine 0.9s ease; }
      @keyframes lb-shine { to { transform: translateX(120%); } }
      @media (prefers-reduced-motion: reduce) {
        .lb-ring { animation: none; }
        .lb-caret { animation: none; }
      }
    `}</style>
  );
}
