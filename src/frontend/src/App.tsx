import { Toaster } from "@/components/ui/sonner";
import {
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  X as XClose,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiX } from "react-icons/si";
import AdminPanel from "./AdminPanel";
import type { NFTItem } from "./backend.d";
import { useActor } from "./hooks/useActor";

const ZORA_URL = "https://zora.co/newboy01";
const TWITTER_URL = "https://twitter.com/YusufAbdul1111";
const SITE_URL = "https://electronic-jade-kgc-draft.caffeine.xyz";

type GalleryNFT = {
  id: bigint;
  title: string;
  imageUrl: string;
  glow: string;
  description: string;
};

const STATIC_NFTS = [
  {
    id: 0n,
    title: "Newest",
    imageUrl: "/assets/newest-019d4118-27af-75ab-ae1f-fe424a4344ec.jpg",
    description:
      "The latest emergence from the digital frontier. A raw signal caught in its earliest form, before the world caught on.",
  },
  {
    id: 1n,
    title: "Newboy Explorer",
    imageUrl:
      "/assets/file_00000000d0107243ab8342da361cdc18-019d4118-474e-75e0-8d48-e5d7116f7555.png",
    description:
      "An explorer by nature — mapping territory that doesn't yet have a name. This piece captures the wandering spirit of web3's earliest movers.",
  },
  {
    id: 2n,
    title: "Antique Coin",
    imageUrl:
      "/assets/antique_coin_with_carved_portrait-019d4118-48d7-77c8-a09b-aa9e8a1de863.png",
    description:
      "Old world meets new frontier. A carved portrait frozen in digital amber — value stored on-chain, forever.",
  },
  {
    id: 3n,
    title: "Inner Light",
    imageUrl: "/assets/newboy_new-019d4118-4c79-749e-9933-9440649ab9f3.png",
    description:
      "The light you carry when no one else sees it yet. This piece represents the quiet confidence of knowing you're onto something.",
  },
  {
    id: 4n,
    title: "Gold Coin",
    imageUrl:
      "/assets/newboy_coin_with_embossed_portrait-019d4118-4cff-726d-8c36-0dfbf8d8a536.png",
    description:
      "Minted in the early days. An embossed portrait of the Newboy identity — the face of the frontier, cast in gold on-chain.",
  },
  {
    id: 5n,
    title: "Ironwood x NEWBOY",
    imageUrl:
      "/assets/chatgpt_image_mar_4_2026_04_06_21_am-019d4118-52c8-754f-8ad6-328eb5821851.png",
    description:
      "A collab born from raw creative energy. Ironwood meets Newboy at the intersection of craft and code.",
  },
];

const EARLY_HOLDERS = [
  { handle: "@cryptowalker.eth", badge: "First Believer", initials: "CW" },
  { handle: "0x1a2b...3c4d", badge: "First Believer", initials: "0X" },
  { handle: "@newboy_genesis", badge: "Genesis Holder", initials: "NG" },
  { handle: "0x9f8e...7d6c", badge: "First Believer", initials: "0X" },
  { handle: "@web3native.eth", badge: "First Believer", initials: "W3" },
];

// ── Intro / Loading Screen ────────────────────────────────────────────────────
function IntroScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#070A0F" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <img
          src="/assets/generated/newboy-logo-transparent.dim_800x400.png"
          alt="NEWBOY"
          className="w-64 md:w-80 glitch-logo"
        />
        <motion.div
          className="w-32 h-0.5"
          style={{ background: "oklch(0.82 0.18 200)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <motion.p
          className="text-xs tracking-[0.4em] uppercase"
          style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          entering the digital frontier
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ── Particle Canvas ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      cyan: Math.random() > 0.5,
      opacity: Math.random() * 0.35 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan
          ? `oklch(0.82 0.18 200 / ${p.opacity})`
          : `oklch(0.62 0.22 295 / ${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

// ── NFT Modal ─────────────────────────────────────────────────────────────────
function NFTModal({
  nft,
  onClose,
}: {
  nft: GalleryNFT;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      data-ocid="nft.modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
      style={{
        background: "rgba(7, 10, 15, 0.92)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "#0D1426",
          border: "1px solid oklch(0.82 0.18 200 / 0.35)",
          boxShadow:
            "0 0 60px oklch(0.82 0.18 200 / 0.15), 0 30px 80px rgba(0,0,0,0.7)",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="nft.close_button"
          aria-label="Close NFT detail"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            background: "rgba(7,10,15,0.85)",
            border: "1px solid oklch(0.82 0.18 200 / 0.3)",
            color: "oklch(0.82 0.18 200)",
          }}
        >
          <XClose size={14} />
        </button>

        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          <img
            src={nft.imageUrl}
            alt={nft.title}
            className="w-full h-full object-cover"
          />
          {/* Edition badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full font-display font-bold tracking-widest"
            style={{
              background: "rgba(7,10,15,0.85)",
              border: "1px solid oklch(0.82 0.18 200 / 0.6)",
              color: "oklch(0.82 0.18 200)",
              backdropFilter: "blur(4px)",
              fontSize: "0.65rem",
            }}
          >
            1 / 1
          </div>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h3
              className="font-display font-extrabold text-xl tracking-widest uppercase"
              style={{ color: "#F2F7FF" }}
            >
              {nft.title}
            </h3>
            <p
              className="text-sm mt-1 font-display font-semibold tracking-widest"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              @newboy01
            </p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "#A8B3C7" }}>
            {nft.description}
          </p>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-display font-bold tracking-wider"
              style={{
                background: "oklch(0.82 0.22 85 / 0.12)",
                border: "1px solid oklch(0.82 0.22 85 / 0.5)",
                color: "oklch(0.82 0.22 85)",
                fontSize: "0.7rem",
              }}
            >
              Edition 1 / 1
            </div>
          </div>

          <a
            href={ZORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="nft.primary_button"
            className="block text-center py-3 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 btn-gold"
          >
            Buy on Zora ↗
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── NFT Card ──────────────────────────────────────────────────────────────────
function NFTCard({
  nft,
  index,
  onSelect,
}: {
  nft: GalleryNFT;
  index: number;
  onSelect: (nft: GalleryNFT) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [buyHovered, setBuyHovered] = useState(false);
  const views = 80 + ((Number(nft.id) * 37) % 300);
  const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(nft.title)}%20by%20%40newboy01%20%F0%9F%AA%99&url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div
      data-ocid={`collection.item.${index + 1}`}
      className={`${nft.glow} rounded-2xl overflow-hidden flex flex-col relative group cursor-pointer`}
      style={{
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? nft.glow === "card-cyan"
            ? "0 0 30px oklch(0.82 0.18 200 / 0.6), 0 12px 40px rgba(0,0,0,0.5)"
            : "0 0 30px oklch(0.62 0.22 295 / 0.6), 0 12px 40px rgba(0,0,0,0.5)"
          : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: NFT card is a fully interactive clickable surface
      tabIndex={0}
      onClick={() => onSelect(nft)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(nft);
        }
      }}
    >
      {/* Image with hover overlay */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={nft.imageUrl}
          alt={nft.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        />

        {/* 1/1 Edition badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-display font-bold tracking-widest"
          style={{
            background: "rgba(7,10,15,0.75)",
            border: "1px solid oklch(0.82 0.18 200 / 0.5)",
            color: "oklch(0.82 0.18 200)",
            backdropFilter: "blur(4px)",
            fontSize: "0.6rem",
          }}
        >
          1/1
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3"
          style={{
            background:
              "linear-gradient(to top, rgba(7,10,15,0.95) 0%, rgba(7,10,15,0.7) 60%, transparent 100%)",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <a
            href={ZORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`collection.primary_button.${index + 1}`}
            className="block text-center py-2 px-3 rounded-lg text-xs font-display font-bold tracking-widest uppercase"
            style={{
              background: buyHovered
                ? "oklch(0.82 0.18 200 / 0.3)"
                : "oklch(0.82 0.18 200 / 0.15)",
              border: "1px solid oklch(0.82 0.18 200 / 0.6)",
              color: "oklch(0.82 0.18 200)",
              transition: "background 0.2s ease, box-shadow 0.2s ease",
              boxShadow: buyHovered
                ? "0 0 12px oklch(0.82 0.18 200 / 0.4)"
                : "none",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setBuyHovered(true)}
            onMouseLeave={() => setBuyHovered(false)}
          >
            Buy on Zora ↗
          </a>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`collection.secondary_button.${index + 1}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-display font-bold tracking-widest uppercase"
            style={{
              background: "oklch(0.62 0.22 295 / 0.2)",
              border: "1px solid oklch(0.62 0.22 295 / 0.6)",
              color: "oklch(0.75 0.18 295)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SiX size={11} /> Share on X
          </a>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4 flex flex-col gap-1.5">
        <h3
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "#F2F7FF" }}
        >
          {nft.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "#A8B3C7" }}>
            @newboy01
          </p>
          <p
            className="text-xs"
            style={{ color: "oklch(0.82 0.18 200 / 0.6)" }}
          >
            👁 {views} views
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeInSection({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── Social Proof Block ────────────────────────────────────────────────────────
function SocialProofBlock() {
  return (
    <div className="py-6 px-6 md:px-10 max-w-6xl mx-auto">
      <FadeInSection>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-5 px-6 py-5 rounded-2xl"
          style={{
            background: "rgba(13, 20, 38, 0.6)",
            border: "1px solid oklch(0.82 0.18 200 / 0.15)",
          }}
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span
              className="text-xs font-display font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              6 on-chain pieces
            </span>
            <span
              style={{
                color: "oklch(0.82 0.18 200 / 0.3)",
                fontSize: "0.6rem",
              }}
            >
              ◆
            </span>
            <span
              className="text-xs font-display font-semibold tracking-widest uppercase"
              style={{ color: "#A8B3C7" }}
            >
              Zora verified
            </span>
            <span
              style={{
                color: "oklch(0.82 0.18 200 / 0.3)",
                fontSize: "0.6rem",
              }}
            >
              ◆
            </span>
            <span
              className="text-xs font-display font-semibold tracking-widest uppercase"
              style={{ color: "#A8B3C7" }}
            >
              Web3 native
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.link"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(7,10,15,0.7)",
                border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                color: "oklch(0.75 0.18 295)",
              }}
            >
              <SiX size={12} />
              @YusufAbdul1111
            </a>
            <a
              href={ZORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="social.link"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(7,10,15,0.7)",
                border: "1px solid oklch(0.82 0.18 200 / 0.4)",
                color: "oklch(0.82 0.18 200)",
              }}
            >
              <span className="font-black">Z</span>
              newboy01
            </a>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}

// ── Lore Section ──────────────────────────────────────────────────────────────
function LoreSection() {
  const loreBlocks = [
    {
      title: "Who is Newboy?",
      text: "A young explorer navigating the digital frontier. No fixed style. No rulebook. Just raw creative energy on-chain.",
      accentColor: "oklch(0.82 0.18 200)",
      borderColor: "oklch(0.82 0.18 200 / 0.25)",
    },
    {
      title: "What does he represent?",
      text: "The early mover. The person who shows up before the crowd. The builder who creates because they have to, not because it's safe.",
      accentColor: "oklch(0.62 0.22 295)",
      borderColor: "oklch(0.62 0.22 295 / 0.25)",
    },
    {
      title: "Why should you care?",
      text: "Because you're here now. That means something. Early is rare. And rare is valuable.",
      accentColor: "oklch(0.82 0.22 85)",
      borderColor: "oklch(0.82 0.22 85 / 0.25)",
    },
  ];

  return (
    <section
      id="lore"
      className="py-24 px-6 md:px-10"
      style={{ background: "#0A0E1A" }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <p
              className="text-xs font-display font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: "oklch(0.82 0.18 200 / 0.6)" }}
            >
              origin story
            </p>
            <h2
              className="font-display font-extrabold text-3xl md:text-4xl tracking-[0.25em] uppercase mb-4"
              style={{ color: "#F2F7FF" }}
            >
              <span className="text-cyan-glow">THE LORE</span>
            </h2>
            <div
              className="w-16 h-0.5 mx-auto rounded-full"
              style={{ background: "oklch(0.82 0.18 200)" }}
            />
          </div>
        </FadeInSection>

        {/* Pull quote */}
        <FadeInSection delay={0.1}>
          <div className="relative max-w-3xl mx-auto mb-20">
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.18 200), oklch(0.62 0.22 295))",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.18 200), oklch(0.62 0.22 295))",
              }}
            />
            <blockquote
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-center px-10 py-6"
              style={{ color: "#F2F7FF" }}
            >
              &ldquo;Newboy isn&apos;t just a character.{" "}
              <span
                className="text-cyan-glow"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                It&apos;s a phase.
              </span>{" "}
              A mindset. A journey from unseen to undeniable.&rdquo;
            </blockquote>
          </div>
        </FadeInSection>

        {/* Three blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loreBlocks.map((block, i) => (
            <FadeInSection key={block.title} delay={i * 0.12}>
              <div
                className="rounded-2xl p-8 h-full flex flex-col gap-4"
                style={{
                  background: "rgba(13, 20, 38, 0.85)",
                  border: `1px solid ${block.borderColor}`,
                }}
              >
                <div
                  className="w-8 h-0.5 rounded-full"
                  style={{ background: block.accentColor }}
                />
                <h3
                  className="font-display font-bold text-sm tracking-widest uppercase"
                  style={{ color: block.accentColor }}
                >
                  {block.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "#A8B3C7" }}
                >
                  {block.text}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Early Signals Section ─────────────────────────────────────────────────────
function EarlySignalsSection() {
  return (
    <section id="early-signals" className="py-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <p
              className="text-xs font-display font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: "oklch(0.62 0.22 295 / 0.7)" }}
            >
              recognition wall
            </p>
            <h2
              className="font-display font-extrabold text-3xl md:text-4xl tracking-[0.2em] uppercase mb-3"
              style={{ color: "#F2F7FF" }}
            >
              <span className="text-purple-glow">EARLY SIGNALS</span>
            </h2>
            <p
              className="text-sm tracking-widest uppercase"
              style={{ color: "#A8B3C7" }}
            >
              The ones who saw it first.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {EARLY_HOLDERS.map((holder, i) => (
            <FadeInSection key={holder.handle} delay={i * 0.08}>
              <div
                className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300"
                style={{
                  background: "rgba(13, 20, 38, 0.85)",
                  border: "1px solid oklch(0.62 0.22 295 / 0.25)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "oklch(0.62 0.22 295 / 0.7)";
                  el.style.boxShadow = "0 0 20px oklch(0.62 0.22 295 / 0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "oklch(0.62 0.22 295 / 0.25)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xs tracking-widest"
                  style={{
                    background: "oklch(0.62 0.22 295 / 0.15)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                    color: "oklch(0.75 0.18 295)",
                  }}
                >
                  {holder.initials}
                </div>
                {/* Handle */}
                <p
                  className="text-xs font-display font-semibold text-center leading-tight break-all"
                  style={{ color: "#F2F7FF" }}
                >
                  {holder.handle}
                </p>
                {/* Badge */}
                <div
                  className="px-2.5 py-1 rounded-full font-display font-bold tracking-wider"
                  style={{
                    background: "oklch(0.62 0.22 295 / 0.12)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                    color: "oklch(0.75 0.18 295)",
                    fontSize: "0.6rem",
                  }}
                >
                  {holder.badge}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.45}>
          <p
            className="text-center text-xs font-display tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.82 0.18 200 / 0.55)" }}
          >
            Hold a piece.{" "}
            <a
              href={ZORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              Get recognized.
            </a>
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── Roadmap Section ───────────────────────────────────────────────────────────
function RoadmapSection() {
  const phases = [
    {
      number: "01",
      subtitle: "Phase 1",
      title: "BUILD & DROP",
      desc: "Create, mint, and release the first on-chain pieces. Establish the Newboy identity and presence on Zora.",
      status: "COMPLETE",
      statusColor: "oklch(0.75 0.15 145)",
      active: false,
      done: true,
    },
    {
      number: "02",
      subtitle: "Phase 2",
      title: "COMMUNITY + IDENTITY",
      desc: "Build the early holder community. Define what Newboy represents. Grow the early signals network.",
      status: "IN PROGRESS",
      statusColor: "oklch(0.82 0.18 200)",
      active: true,
      done: false,
    },
    {
      number: "03",
      subtitle: "Phase 3",
      title: "EXPANSION",
      desc: "Collabs, deeper world-building, and expansion beyond the first collection into new creative territory.",
      status: "UPCOMING",
      statusColor: "oklch(0.55 0.04 240)",
      active: false,
      done: false,
    },
  ];

  return (
    <section id="roadmap" className="py-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <p
              className="text-xs font-display font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: "oklch(0.82 0.18 200 / 0.6)" }}
            >
              the plan
            </p>
            <h2
              className="font-display font-extrabold text-3xl md:text-4xl tracking-[0.25em] uppercase mb-3"
              style={{ color: "#F2F7FF" }}
            >
              <span className="text-cyan-glow">THE JOURNEY</span>
            </h2>
            <p
              className="text-sm tracking-widest uppercase"
              style={{ color: "#A8B3C7" }}
            >
              Where we&apos;ve been. Where we&apos;re going.
            </p>
          </div>
        </FadeInSection>

        {/* Desktop progress connector */}
        <div className="hidden md:block relative mb-8">
          <div
            className="absolute top-6 left-[16.667%] right-[16.667%] h-px"
            style={{ background: "oklch(0.82 0.18 200 / 0.12)" }}
          />
          <div
            className="absolute top-6 left-[16.667%] h-px"
            style={{
              background:
                "linear-gradient(to right, oklch(0.75 0.15 145), oklch(0.82 0.18 200))",
              width: "33.333%",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((phase, i) => (
            <FadeInSection key={phase.number} delay={i * 0.12}>
              <div
                className="flex flex-col gap-4"
                data-ocid={`roadmap.item.${i + 1}`}
              >
                {/* Dot + mobile connector row */}
                <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-0">
                  <div
                    className="relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-display font-bold text-sm md:mb-4"
                    style={{
                      background: phase.done
                        ? "oklch(0.75 0.15 145 / 0.15)"
                        : phase.active
                          ? "oklch(0.82 0.18 200 / 0.15)"
                          : "rgba(13, 20, 38, 0.8)",
                      border: phase.done
                        ? "2px solid oklch(0.75 0.15 145)"
                        : phase.active
                          ? "2px solid oklch(0.82 0.18 200)"
                          : "2px solid oklch(0.82 0.18 200 / 0.2)",
                      color: phase.statusColor,
                      boxShadow: phase.active
                        ? "0 0 20px oklch(0.82 0.18 200 / 0.4)"
                        : "none",
                    }}
                  >
                    {phase.done ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <span>{phase.number}</span>
                    )}
                  </div>
                  {/* Mobile connector line */}
                  {i < phases.length - 1 && (
                    <div
                      className="md:hidden flex-1 h-px"
                      style={{
                        background: phase.done
                          ? "oklch(0.75 0.15 145)"
                          : "oklch(0.82 0.18 200 / 0.15)",
                      }}
                    />
                  )}
                </div>

                {/* Phase card */}
                <div
                  className="rounded-2xl p-6 flex flex-col gap-3 flex-1"
                  style={{
                    background: "rgba(13, 20, 38, 0.85)",
                    border: phase.active
                      ? "1px solid oklch(0.82 0.18 200 / 0.5)"
                      : phase.done
                        ? "1px solid oklch(0.75 0.15 145 / 0.3)"
                        : "1px solid oklch(0.82 0.18 200 / 0.1)",
                    boxShadow: phase.active
                      ? "0 0 30px oklch(0.82 0.18 200 / 0.12)"
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-display font-semibold tracking-widest uppercase"
                      style={{ color: "#A8B3C7" }}
                    >
                      {phase.subtitle}
                    </span>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-display font-bold"
                      style={{
                        backgroundColor: phase.done
                          ? "oklch(0.75 0.15 145 / 0.1)"
                          : phase.active
                            ? "oklch(0.82 0.18 200 / 0.1)"
                            : "oklch(0.55 0.04 240 / 0.1)",
                        color: phase.statusColor,
                        fontSize: "0.6rem",
                      }}
                    >
                      {phase.active && (
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: phase.statusColor }}
                        />
                      )}
                      {phase.status}
                    </div>
                  </div>
                  <h3
                    className="font-display font-bold text-sm tracking-widest uppercase"
                    style={{ color: phase.statusColor }}
                  >
                    {phase.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#A8B3C7" }}
                  >
                    {phase.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Drop Alert CTA ────────────────────────────────────────────────────────────
function DropAlertSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section ref={ref} className="py-20 px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl mx-auto rounded-2xl p-10 md:p-16 flex flex-col items-center text-center gap-6 relative overflow-hidden"
        style={{
          background: "#0D1426",
          border: "1px solid oklch(0.82 0.18 200 / 0.4)",
          boxShadow:
            "0 0 60px oklch(0.82 0.18 200 / 0.08), 0 0 120px oklch(0.62 0.22 295 / 0.05)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.82 0.18 200 / 0.06) 0%, transparent 70%)",
          }}
        />
        <p
          className="font-display font-extrabold text-4xl md:text-5xl tracking-[0.2em] uppercase relative z-10"
          style={{ color: "oklch(0.82 0.18 200)" }}
        >
          DROP ALERTS
        </p>
        <p
          className="text-base md:text-lg tracking-wide relative z-10"
          style={{ color: "#A8B3C7" }}
        >
          Follow on X to be first when new pieces drop.
        </p>
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="drops.primary_button"
          className="relative z-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-display font-bold text-sm tracking-widest uppercase"
          style={{
            background: btnHovered
              ? "oklch(0.82 0.18 200 / 0.2)"
              : "oklch(0.82 0.18 200 / 0.1)",
            border: "1px solid oklch(0.82 0.18 200)",
            color: "oklch(0.82 0.18 200)",
            transition:
              "background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: btnHovered
              ? "0 0 24px oklch(0.82 0.18 200 / 0.5)"
              : "0 0 8px oklch(0.82 0.18 200 / 0.2)",
            transform: btnHovered ? "scale(1.03)" : "scale(1)",
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          <SiX size={16} />
          Follow @YusufAbdul1111
        </a>
      </motion.div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { actor, isFetching } = useActor();
  const [nftItems, setNftItems] = useState<NFTItem[] | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedNft, setSelectedNft] = useState<GalleryNFT | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const fetchGallery = useCallback(async () => {
    if (!actor) return;
    try {
      const items = await actor.getAllNFTItems();
      setNftItems(items);
    } catch (e) {
      console.error(e);
      setNftItems([]);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) fetchGallery();
  }, [actor, isFetching, fetchGallery]);

  const toggleSound = () => {
    if (soundOn) {
      if (audioRef.current) {
        try {
          audioRef.current.oscillator.stop();
          audioRef.current.ctx.close();
        } catch (_) {
          // ignore
        }
        audioRef.current = null;
      }
      setSoundOn(false);
    } else {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(70, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        audioRef.current = { ctx, oscillator, gain };
        setSoundOn(true);
      } catch (_) {
        // AudioContext not supported or blocked
      }
    }
  };

  const galleryItems: GalleryNFT[] =
    nftItems === null
      ? []
      : nftItems.length === 0
        ? STATIC_NFTS.map((item, i) => ({
            ...item,
            glow: i % 2 === 0 ? "card-cyan" : "card-purple",
          }))
        : nftItems.map((item, i) => ({
            id: item.id,
            title: item.title,
            imageUrl: item.image.getDirectURL(),
            glow: i % 2 === 0 ? "card-cyan" : "card-purple",
            description:
              "An original on-chain piece from the NEWBOY collection. A signal from the digital frontier.",
          }));

  const NAV_LINKS = [
    { label: "HOME", href: "#home" },
    { label: "COLLECTION", href: "#collection" },
    { label: "LORE", href: "#lore" },
    { label: "ROADMAP", href: "#roadmap" },
    { label: "ABOUT", href: "#about" },
  ];

  return (
    <div
      className="min-h-screen font-body"
      style={{
        background: "linear-gradient(180deg, #070A0F 0%, #0B0F1A 100%)",
      }}
    >
      {/* Glitch + global CSS */}
      <style>{`
        @keyframes glitch {
          0%   { transform: translate(0); clip-path: none; filter: none; }
          92%  { transform: translate(0); clip-path: none; filter: none; }
          93%  { transform: translate(-4px, 0); clip-path: inset(10% 0 80% 0); filter: hue-rotate(90deg); }
          94%  { transform: translate(4px, 0);  clip-path: inset(60% 0 10% 0); filter: hue-rotate(-90deg); }
          95%  { transform: translate(-2px, 0); clip-path: none; filter: none; }
          96%  { transform: translate(0); clip-path: inset(40% 0 40% 0); filter: saturate(3); }
          97%  { transform: translate(0); clip-path: none; filter: none; }
          100% { transform: translate(0); clip-path: none; filter: none; }
        }
        .glitch-logo {
          animation: glitch 5s infinite;
        }
      `}</style>

      <Toaster />

      {/* Intro screen */}
      <AnimatePresence>
        {showIntro && <IntroScreen onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNft && (
          <NFTModal nft={selectedNft} onClose={() => setSelectedNft(null)} />
        )}
      </AnimatePresence>

      {/* Admin Panel Overlay */}
      {adminOpen && (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
          onGalleryChange={fetchGallery}
        />
      )}

      {/* ── Sticky Nav ── */}
      <header
        data-ocid="nav.panel"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(7, 10, 15, 0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.82 0.18 200 / 0.1)",
        }}
      >
        <a href="#home" className="flex items-center" data-ocid="nav.link">
          <img
            src="/assets/generated/newboy-logo-transparent.dim_800x400.png"
            alt="NEWBOY"
            className="h-9 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-ocid="nav.link"
              className="text-xs font-display font-semibold tracking-widest transition-colors duration-200"
              style={{ color: "#A8B3C7" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.82 0.18 200)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#A8B3C7";
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={ZORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="nav.primary_button"
            className="text-xs font-display font-bold tracking-widest px-4 py-1.5 rounded-full transition-all duration-200"
            style={{
              color: "oklch(0.82 0.18 200)",
              border: "1px solid oklch(0.82 0.18 200 / 0.5)",
              background: "oklch(0.82 0.18 200 / 0.08)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.82 0.18 200 / 0.2)";
              el.style.boxShadow = "0 0 12px oklch(0.82 0.18 200 / 0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.82 0.18 200 / 0.08)";
              el.style.boxShadow = "none";
            }}
          >
            BUY
          </a>
        </nav>

        {/* Icons + sound toggle */}
        <div className="flex items-center gap-3">
          {/* Ambient sound toggle */}
          <button
            type="button"
            onClick={toggleSound}
            data-ocid="nav.toggle"
            aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}
            className="transition-colors duration-200"
            style={{ color: soundOn ? "oklch(0.82 0.18 200)" : "#A8B3C7" }}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="nav.link"
            className="transition-colors duration-200"
            style={{ color: "#A8B3C7" }}
            aria-label="X (Twitter)"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.82 0.18 200)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#A8B3C7";
            }}
          >
            <SiX size={18} />
          </a>
          <a
            href={ZORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="nav.link"
            className="font-black text-sm transition-colors duration-200"
            style={{ color: "#A8B3C7" }}
            aria-label="Zora"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.62 0.22 295)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#A8B3C7";
            }}
          >
            Z
          </a>
        </div>
      </header>

      {/* ── 1. Hero ── */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-20 overflow-hidden"
      >
        <ParticleCanvas />

        {/* Background radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 50%, oklch(0.82 0.18 200 / 0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 50%, oklch(0.62 0.22 295 / 0.07) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-5 max-w-4xl"
        >
          {/* Glitch logo */}
          <img
            src="/assets/generated/newboy-logo-transparent.dim_800x400.png"
            alt="NEWBOY"
            className="w-52 md:w-72 lg:w-80 glitch-logo"
          />

          {/* Headline */}
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase text-cyan-glow leading-none"
            style={{ color: "oklch(0.82 0.18 200)" }}
          >
            NEWBOY: BUILT DIFFERENT.
          </h1>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg font-display font-light tracking-[0.22em] uppercase"
            style={{ color: "oklch(0.75 0.04 240)" }}
          >
            For the ones who move early.
          </p>

          {/* Phase Tracker Pill */}
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              background: "oklch(0.82 0.18 200 / 0.08)",
              border: "1px solid oklch(0.82 0.18 200 / 0.4)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
              style={{ background: "oklch(0.82 0.18 200)" }}
            />
            <span
              className="text-xs font-display font-bold tracking-[0.25em] uppercase"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              CURRENT PHASE: EARLY SIGNALS
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a
              href={ZORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.primary_button"
              className="btn-gold px-8 py-3.5 rounded-pill font-display font-black text-sm tracking-widest uppercase inline-flex items-center gap-2 justify-center"
            >
              COLLECT <ExternalLink size={14} />
            </a>
            <a
              href={ZORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.secondary_button"
              className="btn-cyan px-8 py-3.5 rounded-pill font-display font-bold text-sm tracking-widest uppercase inline-flex items-center gap-2 justify-center"
            >
              View on Zora <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Collection ── */}
      <section
        id="collection"
        className="py-24 px-6 md:px-10 max-w-6xl mx-auto"
      >
        <FadeInSection>
          <div className="flex flex-col items-center gap-3 mb-16">
            <p
              className="text-xs font-display font-bold tracking-[0.4em] uppercase"
              style={{ color: "oklch(0.82 0.18 200 / 0.6)" }}
            >
              digital artifacts
            </p>
            <h2
              className="font-display font-extrabold text-3xl md:text-4xl tracking-widest uppercase text-center"
              style={{ color: "#F2F7FF" }}
            >
              <span className="text-cyan-glow">THE NEWBOY</span>{" "}
              <span className="text-purple-glow">COLLECTION</span>
            </h2>
            {nftItems !== null && galleryItems.length > 0 && (
              <p
                className="text-xs font-display font-bold tracking-[0.3em] uppercase"
                style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
              >
                {galleryItems.length} PIECES · CLICK TO EXPLORE
              </p>
            )}
          </div>
        </FadeInSection>

        {nftItems === null && (
          <div
            className="flex justify-center py-16"
            data-ocid="collection.loading_state"
          >
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{
                borderColor: "oklch(0.82 0.18 200)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        )}

        {nftItems !== null && galleryItems.length === 0 && (
          <FadeInSection>
            <div
              className="flex flex-col items-center gap-4 py-20 rounded-2xl"
              style={{ border: "1px dashed oklch(0.82 0.18 200 / 0.2)" }}
              data-ocid="collection.empty_state"
            >
              <p
                className="text-sm font-display font-bold tracking-[0.3em] uppercase"
                style={{ color: "oklch(0.82 0.18 200 / 0.5)" }}
              >
                New drops coming soon
              </p>
              <p className="text-xs" style={{ color: "#A8B3C7" }}>
                Follow{" "}
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "oklch(0.82 0.18 200)" }}
                >
                  @YusufAbdul1111
                </a>{" "}
                to be the first to know.
              </p>
            </div>
          </FadeInSection>
        )}

        {nftItems !== null && galleryItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {galleryItems.map((nft, i) => (
              <FadeInSection key={String(nft.id)} delay={i * 0.08}>
                <NFTCard nft={nft} index={i} onSelect={setSelectedNft} />
              </FadeInSection>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. Social Proof ── */}
      <SocialProofBlock />

      {/* ── 4. Lore ── */}
      <LoreSection />

      {/* ── 5. Early Signals ── */}
      <EarlySignalsSection />

      {/* ── 6. Roadmap ── */}
      <RoadmapSection />

      {/* ── 7. About ── */}
      <section id="about" className="py-24 px-6 md:px-10 max-w-5xl mx-auto">
        <FadeInSection>
          <h2
            className="font-display font-extrabold text-3xl md:text-4xl tracking-widest uppercase text-center mb-12"
            style={{ color: "#F2F7FF" }}
          >
            <span className="text-purple-glow">ABOUT</span>{" "}
            <span className="text-cyan-glow">NEWBOY</span>
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div
            className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center"
            style={{
              background: "#0D1426",
              border: "1px solid oklch(0.62 0.22 295 / 0.35)",
              boxShadow:
                "0 0 30px oklch(0.62 0.22 295 / 0.1), 0 0 60px oklch(0.82 0.18 200 / 0.05)",
            }}
            data-ocid="about.panel"
          >
            <div className="flex-1 flex flex-col gap-6">
              <h3
                className="font-display font-bold text-xl tracking-widest uppercase text-cyan-glow"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                THE VISION
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#A8B3C7" }}
              >
                Newboy is just a young boy exploring the digital world and web3
                &mdash; a random NFT maker with no particular pattern. Every
                piece is an experiment, a moment, a signal from the frontier of
                the decentralized web.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#A8B3C7" }}
              >
                No fixed aesthetic. No rulebook. Just pure creative energy
                channeled into on-chain artifacts for whoever resonates.{" "}
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "oklch(0.82 0.18 200)", fontWeight: 600 }}
                >
                  Find me on X: @YusufAbdul1111
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href={ZORA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="about.primary_button"
                  className="btn-cyan px-6 py-2.5 rounded-pill font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 justify-center"
                >
                  <span className="font-black">Z</span> View on Zora
                </a>
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="about.secondary_button"
                  className="btn-purple px-6 py-2.5 rounded-pill font-display font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2 justify-center"
                >
                  <SiX size={14} /> Follow on Twitter
                </a>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/assets/generated/newboy-logo-transparent.dim_800x400.png"
                alt="NEWBOY Logo"
                className="w-48 md:w-64 animate-pulse-glow"
              />
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── 8. Drop Alerts CTA ── */}
      <DropAlertSection />

      {/* ── 9. Footer ── */}
      <footer
        className="py-10 px-6 md:px-10 mt-4"
        style={{
          background: "rgba(7, 10, 15, 0.97)",
          borderTop: "1px solid oklch(0.82 0.18 200 / 0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img
              src="/assets/generated/newboy-logo-transparent.dim_800x400.png"
              alt="NEWBOY"
              className="h-8 w-auto"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p
              className="text-xs font-display font-semibold tracking-widest uppercase text-cyan-glow"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              Built on Web3
            </p>
            <div
              className="flex items-center gap-1.5"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              <CheckCircle2 size={12} />
              <span
                className="text-xs font-display font-semibold tracking-wider"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                Verified Creator · Web3 Native
              </span>
            </div>
            <p className="text-xs" style={{ color: "#A8B3C7" }}>
              &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="footer.link"
              className="transition-colors duration-200"
              style={{ color: "#A8B3C7" }}
              aria-label="Twitter"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.82 0.18 200)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#A8B3C7";
              }}
            >
              <SiX size={18} />
            </a>
            <a
              href={ZORA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="footer.link"
              className="font-black text-sm transition-colors duration-200"
              style={{ color: "#A8B3C7" }}
              aria-label="Zora"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.62 0.22 295)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#A8B3C7";
              }}
            >
              Z
            </a>
            <button
              type="button"
              onClick={() => setAdminOpen(true)}
              data-ocid="admin.open_modal_button"
              className="text-xs transition-colors opacity-40 hover:opacity-100"
              style={{ color: "#A8B3C7" }}
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
