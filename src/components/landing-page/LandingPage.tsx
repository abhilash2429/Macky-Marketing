import { Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

import imgBg from "@/assets/landing-page/bg.png";
import imgAppScreen from "@/assets/landing-page/macky.png";
import imgMackyLogo from "@/assets/landing-page/macky-logo.png";
import { type Colors, Liquid } from "./LiquidGradient";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { TextAnimate } from "@/components/ui/text-animate"
import { Highlighter } from "@/components/ui/highlighter";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.17, delayChildren: 0.22 } },
};

const promptFeedVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut", delay: 0.6 } },
};

const prompts = [
  { source: "Calendar", text: "Block tomorrow 9–12 for deep work",    tone: "#7B9FFF", logo: "calendar" },
  { source: "GitHub",   text: "Check the pull request from yesterday", tone: "#C8C8D8", logo: "https://cdn.simpleicons.org/github/ffffff" },
  { source: "Slack",    text: "Send the launch thread to #team-dev",   tone: "#B5B3FF", logo: "slack" },
  { source: "Contacts", text: "Add a 1:1 with Rahul at 3 tomorrow",   tone: "#FFB84D", logo: "contacts" },
  { source: "Mail",     text: "What did I miss in Gmail since 9am?",   tone: "#FF7B6B", logo: "https://cdn.simpleicons.org/gmail/EA4335" },
  { source: "Music",    text: "Queue something quiet while I write",   tone: "#4FC77B", logo: "https://cdn.simpleicons.org/spotify/1DB954" },
];

const COLORS: Colors = {
  color1: '#FFFFFF',
  color2: '#1E10C5',
  color3: '#9089E2',
  color4: '#FCFCFE',
  color5: '#F9F9FD',
  color6: '#B2B8E7',
  color7: '#0E2DCB',
  color8: '#0017E9',
  color9: '#4743EF',
  color10: '#7D7BF4',
  color11: '#0B06FC',
  color12: '#C5C1EA',
  color13: '#1403DE',
  color14: '#B6BAF6',
  color15: '#C1BEEB',
  color16: '#290ECB',
  color17: '#3F4CC0',
};

const STACK = [
  { scale: 1,     y: 0,  opacity: 1,   zIndex: 30 },
  { scale: 0.955, y: 11, opacity: 0.6, zIndex: 20 },
  { scale: 0.91,  y: 20, opacity: 0.3, zIndex: 10 },
];
<br />

function WishlistButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="relative inline-block w-32 h-[2em] mx-auto group bg-background border-border border-2 rounded-md">
        <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
          <span className="absolute inset-0 rounded-md bg-[#d9d9d9] filter blur-[6.5px]"></span>
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <Liquid isHovered={isHovered} colors={COLORS} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-md bg-[#010128] filter blur-[7.3px]"></div>
        <div className="relative w-full h-full overflow-hidden rounded-md">
          <span className="absolute inset-0 rounded-md bg-[#d9d9d9]"></span>
          <span className="absolute inset-0 rounded-md bg-black"></span>
          <Liquid isHovered={isHovered} colors={COLORS} />
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={`spark-${i}`}
              className={`absolute inset-0 rounded-md border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter ${
                i <= 2 ? 'blur-[3px]' : i === 3 ? 'blur-[5px]' : 'blur-xs'
              }`}
            ></span>
          ))}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-md filter blur-[15px] bg-[#006]"></span>
        </div>
        <ShinyButton
          className="absolute inset-0 h-full w-full rounded-md bg-transparent px-2 text-[16px]"
          aria-label="Join wishlist"
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="flex items-center justify-center gap-1 group-hover:text-yellow-400">
            <Star className="inline-block group-hover:fill-yellow-400 fill-white w-4 h-4 shrink-0" />{' '}
            Wishlist
          </span>
        </ShinyButton>
      </div>
    </div>
  );
}

function PromptLogo({ logo }: { logo: string }) {
  if (logo === "calendar") {
    return (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#fff" d="M4 3h16a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path fill="#4285F4" d="M4 3h16a2 2 0 0 1 2 2v4H2V5a2 2 0 0 1 2-2Z" />
        <path fill="#34A853" d="M2 9h5v13H4a2 2 0 0 1-2-2V9Z" />
        <path fill="#FBBC04" d="M17 9h5v11a2 2 0 0 1-2 2h-3V9Z" />
        <path fill="#EA4335" d="M7 9h10v13H7V9Z" opacity="0.12" />
        <path fill="#1A73E8" d="M9.7 18.4v-1.2h2.1v-5.1l-2 .8v-1.3l3.4-1.4v7h1.9v1.2H9.7Z" />
      </svg>
    );
  }

  if (logo === "slack") {
    return (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#36C5F0" d="M8.8 2a2.1 2.1 0 0 0 0 4.2h2.1V4.1A2.1 2.1 0 0 0 8.8 2Zm0 5.6H3.1a2.1 2.1 0 0 0 0 4.2h5.7a2.1 2.1 0 0 0 0-4.2Z" />
        <path fill="#2EB67D" d="M22 8.8a2.1 2.1 0 0 0-4.2 0v2.1h2.1A2.1 2.1 0 0 0 22 8.8Zm-5.6 0V3.1a2.1 2.1 0 0 0-4.2 0v5.7a2.1 2.1 0 0 0 4.2 0Z" />
        <path fill="#ECB22E" d="M15.2 22a2.1 2.1 0 0 0 0-4.2h-2.1v2.1a2.1 2.1 0 0 0 2.1 2.1Zm0-5.6h5.7a2.1 2.1 0 0 0 0-4.2h-5.7a2.1 2.1 0 0 0 0 4.2Z" />
        <path fill="#E01E5A" d="M2 15.2a2.1 2.1 0 0 0 4.2 0v-2.1H4.1A2.1 2.1 0 0 0 2 15.2Zm5.6 0v5.7a2.1 2.1 0 0 0 4.2 0v-5.7a2.1 2.1 0 0 0-4.2 0Z" />
      </svg>
    );
  }

  if (logo === "contacts") {
    return (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="18" height="22" x="4" y="1" fill="#4285F4" rx="3" />
        <path fill="#34A853" d="M2 6.5A1.5 1.5 0 0 1 3.5 5H5v4H3.5A1.5 1.5 0 0 1 2 7.5v-1Zm0 7A1.5 1.5 0 0 1 3.5 12H5v4H3.5A1.5 1.5 0 0 1 2 14.5v-1Z" />
        <circle cx="13" cy="9" r="3" fill="#fff" />
        <path fill="#fff" d="M7.5 18.5c.7-2.4 2.6-3.8 5.5-3.8s4.8 1.4 5.5 3.8c.1.4-.2.8-.6.8H8.1c-.4 0-.7-.4-.6-.8Z" />
      </svg>
    );
  }

  return <img src={logo} alt="" className="h-[18px] w-[18px]" aria-hidden />;
}

function PromptCard({ prompt }: { prompt: (typeof prompts)[number] }) {
  return (
    <div className="relative flex h-[68px] w-full items-center rounded-[18px] border border-white/[0.09] bg-[#0C0C1E]/[0.88] px-4 shadow-[0_8px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl">
      <div className="absolute inset-x-8 top-0 h-px bg-white/[0.12]" />
      <div className="mr-3.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.07]">
        <PromptLogo logo={prompt.logo} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="mb-[2px] text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: prompt.tone, fontFamily: "Inter, sans-serif" }}
        >
          {prompt.source}
        </div>
        <p
          className="truncate text-[15px] font-semibold leading-[20px] text-white/90"
          style={{ fontFamily: "SF Pro Rounded, sans-serif" }}
        >
          {prompt.text}
        </p>
      </div>
      <span className="ml-3 shrink-0 text-[13px] text-white/[0.22]">↵</span>
    </div>
  );
}

function PromptDeckFeed() {
  const [deck, setDeck] = useState<Array<{ key: number; promptIdx: number; pos: number }>>(() =>
    [0, 1, 2].map(i => ({ key: i, promptIdx: i, pos: i }))
  );
  const counter = useRef(3);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDeck(prev => {
        const k = counter.current++;
        return [
          ...prev.filter(c => c.pos > 0).map(c => ({ ...c, pos: c.pos - 1 })),
          { key: k, promptIdx: k % prompts.length, pos: 2 },
        ];
      });
    }, 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      className="mt-10 relative h-[104px] w-full max-w-[560px] px-6 mx-auto"
      variants={promptFeedVariants}
    >
      <AnimatePresence>
        {deck.map(({ key, promptIdx, pos }) => (
          <motion.div
            key={key}
            className="absolute inset-x-6"
            style={{ zIndex: STACK[pos].zIndex }}
            initial={{ scale: STACK[2].scale, y: STACK[2].y + 28, opacity: 0 }}
            animate={{ scale: STACK[pos].scale, y: STACK[pos].y, opacity: STACK[pos].opacity }}
            exit={{ scale: 0.98, y: -64, opacity: 0, zIndex: 40 }}
            transition={{ type: "spring", stiffness: 220, damping: 34 }}
          >
            <PromptCard prompt={prompts[promptIdx]} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function LandingPage() {
  const [subtitleReady, setSubtitleReady] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showCtaHighlight, setShowCtaHighlight] = useState(false);

  useEffect(() => {
    if (!subtitleReady) return;

    let cancelled = false;
    let frameId = 0;

    const scheduleHighlights = () => {
      if (cancelled) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(() => {
          if (!cancelled) setShowHighlights(true);
        });
      });
    };

    document.fonts?.ready.then(scheduleHighlights, scheduleHighlights) ?? scheduleHighlights();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [subtitleReady]);

  useEffect(() => {
    if (!showHighlights) return;

    const timeoutId = window.setTimeout(() => {
      setShowCtaHighlight(true);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [showHighlights]);

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen">
      
      {/* Background image */}
      <img
        src={imgBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden
      />

      <div className="group relative z-20 w-full">
        <nav
          className="absolute inset-x-16 top-7 z-20 flex items-center justify-between text-[#0A0A0A] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 sm:inset-x-28 lg:inset-x-44"
          style={{ fontFamily: "SF Pro Rounded" }}
          aria-label="Primary"
        >
          <motion.div
            className="flex items-center gap-1.5 text-[17px] font-semibold tracking-[-0.01em]"
            whileHover={{ y: -2, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <img src={imgMackyLogo} alt="" className="h-[1.7em] w-[1.7em] object-contain" aria-hidden />
            
            macky
          </motion.div>
          <motion.a
            className="text-[15px] font-semibold tracking-[-0.01em]"
            href="#privacy"
            whileHover={{ y: -2, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Highlighter action="underline" color="#0A0A0A" enabled={showHighlights}>privacy</Highlighter>
          </motion.a>
        </nav>
        <motion.div
          className="relative w-full max-w-[384px] mx-auto mb-8 rounded-xl overflow-hidden"
          style={{ height: 134 }}
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ opacity: { duration: 0.8, ease: "easeOut" }, scale: { duration: 0.8, ease: "easeOut" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
        >
          <img
            src={imgAppScreen}
            alt="Macky app interface"
            className="absolute w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            style={{ top: "-63.34%", height: "191.04%" }}
          />
        </motion.div>
      </div>

      <div style={{ paddingTop: "10vh" }}>
        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center min-h-screen -translate-y-12"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center -translate-y-8">
            {/* Badge */}
            <motion.div className="mt-6 flex justify-center" variants={revealVariants}>
              <RainbowButton>Meet Macky</RainbowButton>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="mt-5 text-center text-[#0a0a0a] leading-[1.08] px-4"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(48px, 6vw, 86px)",
              }}
            >
              <TextAnimate animation="blurInUp" by="character" duration={1.25} once>
                Your AI Companion.
              </TextAnimate>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-center text-[#0a0a0a] px-6 max-w-[620px]"
              variants={revealVariants}
              onAnimationComplete={() => setSubtitleReady(true)}
              style={{
                fontFamily: "SF Pro Rounded",
                fontWeight: 500,
                fontSize: "19px",
                lineHeight: "25px",
              }}
            >
              Macky is an AI companion that lives <Highlighter action="underline" color="#CC5500" enabled={showHighlights}>inside your Mac</Highlighter>.
              Talk to it like you would a person - it listens, responds, and gets things done.
              It can see your screen, run agents in the background, and handle tasks while you work.
              <Highlighter action="highlight" color="#87CEFA" enabled={showHighlights}>Just say the Word</Highlighter>.
            </motion.p>

            {/* Wishlist button */}
            <motion.div className="mt-7 flex justify-center" variants={revealVariants}>
              <WishlistButton />
            </motion.div>
          </div>

          {/* Prompt Deck Feed */}
          <PromptDeckFeed />
          <motion.div
            className="mt-7 flex items-center justify-center gap-2 text-[15px] font-medium text-[#0A0A0A] cursor-pointer"
            variants={revealVariants}
            style={{ fontFamily: "SF Pro Rounded" }}
          >
            <Highlighter action="underline" color="#024a62" enabled={showCtaHighlight}>See how it works</Highlighter>
            <span className="text-[18px]">→</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}