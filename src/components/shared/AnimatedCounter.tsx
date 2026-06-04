"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Sob prefers-reduced-motion, não animamos a contagem — o valor final é
    // derivado direto no render (displayCount), sem setState no efeito.
    if (!isInView || reduce) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration, reduce]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={isInView || reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: reduce ? 0 : 0.4 }}
    >
      {prefix}
      {(reduce ? target : count).toLocaleString("pt-BR")}
      {suffix}
    </motion.span>
  );
}
