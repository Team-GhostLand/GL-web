import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PARALLAX_BACKGROUNDS } from "@/lib/assets";

export function ParallaxBackground() {
  const [bg] = useState(() => PARALLAX_BACKGROUNDS[Math.floor(Math.random() * PARALLAX_BACKGROUNDS.length)]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const tx = useTransform(sx, [-1, 1], [-20, 20]);
  const ty = useTransform(sy, [-1, 1], [-20, 20]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const style = useMemo(() => ({ x: tx, y: ty }), [tx, ty]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={style}
        className="absolute -inset-8"
      >
        <img src={bg} alt="" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, oklch(0.10 0.04 275 / 0.85) 100%)" }} />
    </div>
  );
}