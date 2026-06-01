"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function ScrollAnimationWrapper({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollAnimationWrapperProps) {
  const { ref, isInView } = useScrollAnimation();

  // Animação apenas por opacidade — translações (x/y) causam CLS ao deslocar elementos
  // no layout antes da animação disparar (especialmente em seções acima da fold).
  // will-change: opacity garante que o navegador não recalcule o layout.
  const directionOffset = {
    up: { x: 0, y: 0 },
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: directionOffset[direction].x,
        y: directionOffset[direction].y,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: directionOffset[direction].x,
              y: directionOffset[direction].y,
            }
      }
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
