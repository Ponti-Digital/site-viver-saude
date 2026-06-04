"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import React from "react";

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  }),
};

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerChildrenProps) {
  const { ref, isInView } = useScrollAnimation();
  const reduce = useReducedMotion();

  const childVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      animate={isInView ? "visible" : "hidden"}
      custom={reduce ? 0 : staggerDelay}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
