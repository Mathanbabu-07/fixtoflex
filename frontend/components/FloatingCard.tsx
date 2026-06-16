"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function FloatingCard({
  children,
  className = "",
  delay = 0,
  duration = 4,
}: FloatingCardProps) {
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse", // Or "loop" / "mirror" - "reverse" creates a seamless bounce up and down!
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}
