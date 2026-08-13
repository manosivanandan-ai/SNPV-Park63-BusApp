import { motion } from "framer-motion";

const CLOUDS = [
  { top: "6%", size: "2.75rem", duration: 75, delay: -5, opacity: 0.55 },
  { top: "16%", size: "2rem", duration: 95, delay: -40, opacity: 0.4 },
  { top: "10%", size: "1.75rem", duration: 60, delay: -20, opacity: 0.45 },
  { top: "24%", size: "2.5rem", duration: 115, delay: -70, opacity: 0.3 },
];

const ROADSIDE_PROPS = [
  { left: "8%", emoji: "🌳", size: "1.5rem" },
  { left: "34%", emoji: "🚏", size: "1.5rem" },
  { left: "62%", emoji: "🌳", size: "1.75rem" },
  { left: "85%", emoji: "🌤️", size: "1.5rem" },
];

export function BackgroundScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 88% 6%, rgba(255,205,130,0.45), transparent 42%), linear-gradient(180deg, #faf8ff 0%, #f4f9ff 45%, #fdf6f0 100%)",
        }}
      />

      {/* Drifting clouds */}
      {CLOUDS.map((cloud, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-3xl"
          style={{ top: cloud.top, fontSize: cloud.size, opacity: cloud.opacity }}
          initial={{ x: "-15vw" }}
          animate={{ x: "115vw" }}
          transition={{ duration: cloud.duration, delay: cloud.delay, repeat: Infinity, ease: "linear" }}
        >
          ☁️
        </motion.span>
      ))}

      {/* Rolling hills */}
      <svg
        className="absolute bottom-14 left-0 h-40 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C240,180 480,60 720,100 C960,140 1200,60 1440,110 L1440,200 L0,200 Z"
          fill="#ddd3ff"
          opacity="0.45"
        />
        <path
          d="M0,150 C300,90 600,170 900,120 C1140,80 1320,150 1440,140 L1440,200 L0,200 Z"
          fill="#b6f4d6"
          opacity="0.5"
        />
      </svg>

      {/* Roadside props resting on the hills */}
      {ROADSIDE_PROPS.map((prop, i) => (
        <span
          key={i}
          className="absolute bottom-16 select-none opacity-60"
          style={{ left: prop.left, fontSize: prop.size }}
        >
          {prop.emoji}
        </span>
      ))}

      {/* Road */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-lavender-300/25" />
      <div
        className="absolute inset-x-0 bottom-6 h-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.85) 0 24px, transparent 24px 48px)",
        }}
      />

      {/* Bus driving along the road */}
      <motion.span
        className="absolute bottom-1 select-none text-3xl"
        initial={{ x: "-10vw" }}
        animate={{ x: "110vw" }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        🚌
      </motion.span>
    </div>
  );
}
