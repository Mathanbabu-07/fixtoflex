"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { Check } from "lucide-react";

interface VerificationShieldProps {
  mouseX: any;
  mouseY: any;
}

export default function VerificationShield({ mouseX, mouseY }: VerificationShieldProps) {
  // Translate cursor movement into Parallax displacement
  const px = useTransform(mouseX, (v: number) => v * 0.05);
  const py = useTransform(mouseY, (v: number) => v * 0.05);

  return (
    <motion.div
      style={{ x: px, y: py, willChange: "transform" }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        default: { duration: 0.5, delay: 0.6, type: "spring", stiffness: 120 }
      }}
      className="absolute top-[-8%] right-[2%] sm:right-[8%] z-20 cursor-pointer select-none"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          type: "tween",
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 10px 25px rgba(99, 102, 241, 0.2)",
              "0 10px 30px rgba(99, 102, 241, 0.4)",
              "0 10px 25px rgba(99, 102, 241, 0.2)"
            ]
          }}
          transition={{
            type: "tween",
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-11 h-11 sm:w-13 sm:h-13 bg-linear-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center border border-white/20 overflow-hidden"
        >
          {/* Shine Sweep Overlay */}
          <motion.div
            animate={{
              left: ["-100%", "200%"]
            }}
            transition={{
              type: "tween",
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-8 bg-white/20 skew-x-20 pointer-events-none"
          />

          {/* Checkmark icon inside */}
          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3.5]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
