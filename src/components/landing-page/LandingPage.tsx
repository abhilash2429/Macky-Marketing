import { Star } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";

import imgBg from "@/assets/landing-page/bg.png";
import imgAppScreen from "@/assets/landing-page/macky.png";
import { type Colors, Liquid } from "./LiquidGradient";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { TextAnimate } from "@/components/ui/text-animate"
import { Highlighter } from "@/components/ui/highlighter";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const promptGridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
};

const promptPillVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const prompts = [
  { text: '"check the github PR from yesterday"', active: false },
  { text: '"block tomorrow 9–12 for deep work"', active: false },
  { text: '"send the launch thread to #team-dev"', active: false },
  { text: '"add a 1:1 with rahul at 3pm tomorrow"', active: true },
  { text: '"what did i miss in gmail since 9am?"', active: true },
  { text: '"queue something lo-fi on spotify"', active: true },
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
function WishlistButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="relative inline-block w-32 h-[2.7em] mx-auto group bg-background border-border border-2 rounded-lg">
        <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
          <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]"></span>
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Liquid isHovered={isHovered} colors={COLORS} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128] filter blur-[7.3px]"></div>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <span className="absolute inset-0 rounded-lg bg-[#d9d9d9]"></span>
          <span className="absolute inset-0 rounded-lg bg-black"></span>
          <Liquid isHovered={isHovered} colors={COLORS} />
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={`spark-${i}`}
              className={`absolute inset-0 rounded-lg border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter ${
                i <= 2 ? 'blur-[3px]' : i === 3 ? 'blur-[5px]' : 'blur-xs'
              }`}
            ></span>
          ))}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-lg filter blur-[15px] bg-[#006]"></span>
        </div>
        <ShinyButton
          className="absolute inset-0 h-full w-full rounded-lg bg-transparent px-2 text-xl"
          aria-label="Join wishlist"
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="flex items-center justify-center gap-1 group-hover:text-yellow-400">
            <Star className="inline-block group-hover:fill-yellow-400 fill-white w-6 h-6 shrink-0" />{' '}
            Wishlist
          </span>
        </ShinyButton>
      </div>
    </div>
  );
}

function GlassPromptPill({ text, active }: { text: string; active: boolean }) {
  return (
    <motion.div
      className="relative rounded-[41px] h-[78px] flex items-center px-[40px]"
      style={{ minWidth: 320, maxWidth: 420 }}
      variants={promptPillVariants}
      whileHover={{ y: -5, scale: 1.02, filter: "drop-shadow(0px 12px 24px rgba(77,102,204,0.18))" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {/* Glass layers */}
      <div className="absolute inset-0 rounded-[41px] backdrop-blur-[50px]" style={{ background: "rgba(255,255,255,0.16)" }} />
      <div className="absolute inset-0 rounded-[41px] backdrop-blur-[25px]" style={{ background: "rgba(255,255,255,0.12)" }} />
      <div className="absolute inset-0 rounded-[41px]" style={{ background: active ? "rgba(128,178,255,0.15)" : "rgba(255,255,255,0.10)" }} />
      {/* Border and shadow */}
      <motion.div
        className="absolute inset-0 rounded-[41px] pointer-events-none"
        style={{
          boxShadow: "inset 0px 0px 18px 5px rgba(255,255,255,0.18), 0px 6px 28px 0px rgba(77,102,204,0.16)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
        whileHover={{ boxShadow: "inset 0px 0px 22px 6px rgba(255,255,255,0.22), 0px 12px 34px 0px rgba(77,102,204,0.22)" }}
        transition={{ duration: 0.2 }}
      />
      <p
        className="relative text-[#1a1a1a] text-[15px] leading-[22px] font-normal"
        style={{ fontFamily: "'SF Pro', 'SF Pro Text', '-apple-system', 'Helvetica Neue', sans-serif", fontVariationSettings: '"wdth" 100' }}
      >
        {text}
      </p>
    </motion.div>
  );
}

export function LandingPage() {
  const [subtitleReady, setSubtitleReady] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

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

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen">
      
      {/* Background image */}
      <img
        src={imgBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden
      />
      
      {/* App screenshot */}
      <motion.div
        className="relative w-full max-w-[384px] mx-auto mb-8 rounded-xl overflow-hidden"
        style={{ height: 134 }}
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
        transition={{ opacity: { duration: 0.55, ease: "easeOut" }, scale: { duration: 0.55, ease: "easeOut" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      >
        <img
          src={imgAppScreen}
          alt="Macky app interface"
          className="absolute w-full object-cover"
          style={{ top: "-63.34%", height: "191.04%" }}
        />
      </motion.div>
      <div
        style={{
          paddingTop: "10vh",
          
        }}
      >

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center min-h-screen -translate-y-12"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
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
            <TextAnimate animation="blurInUp" by="character" once>
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
          
          {/* Prompt Grid */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 px-6 pb-12 max-w-[760px] mx-auto justify-items-center"
            variants={promptGridVariants}
          >
            {prompts.map((p, i) => (
              <GlassPromptPill key={i} text={p.text} active={p.active} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
