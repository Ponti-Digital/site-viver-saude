"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  // Mantido por compatibilidade de API. A animação é só de opacidade (translações
  // x/y causavam CLS), então a direção não altera o efeito visual.
  direction?: "up" | "left" | "right";
}

export function ScrollAnimationWrapper({
  children,
  className,
  delay = 0,
}: ScrollAnimationWrapperProps) {
  const { ref, isInView } = useScrollAnimation();
  const reduce = useReducedMotion();

  // Animação apenas por opacidade. Sob prefers-reduced-motion exibimos o
  // conteúdo já visível, sem fade.
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0 }}
      animate={isInView || reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
