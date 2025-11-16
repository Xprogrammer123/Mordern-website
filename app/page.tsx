"use client";

import React from "react";
import { motion } from "framer-motion";
import { Timeline, TimelineText } from "@/components/ui/timeline";
import {
  ImageItem,
  PhoneCarousel,
} from "@/components/ui/phone-carousel";

const exampleImages: ImageItem[] = [
  {
    src: "/globe.svg",
    alt: "Behance app on iPhone",
  },
   {
    src: "/globe.svg",
    alt: "Behance app on iPhone",
  },
   {
    src: "/globe.svg",
    alt: "Behance app on iPhone",
  },
   
  
];

export default function TimelineDemo() {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden bg-neutral-950 text-center pt-20 pb-10">
     

      {/* ✨ Animated Text Section */}
      <motion.h2
        className="z-10 mb-4 font-sans font-extrabold tracking-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.span
          className="block text-transparent bg-clip-text bg-black text-3xl md:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
         <span className="block bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-8xl">
          MAKE WEBSITES
        </span>
        </motion.span>

        <motion.span
          className="block text-transparent bg-clip-text bg-black text-4xl md:text-6xl lg:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-5xl">
          10X MODERN
        </span>
        </motion.span>

        <motion.span
          className="block text-2xl md:text-3xl lg:text-4xl text-gray-300 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          with
        </motion.span>
      </motion.h2>

      {/* 🔥 ScrollX UI Timeline Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mb-16"
      >
       <Timeline rotation={-2.76}>
        <TimelineText className="text-xl md:text-5xl lg:text-6xl font-bold block bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white">
         Saka.tsx
        </TimelineText>
      </Timeline>
      </motion.div>

  
      <motion.div
        className="w-full flex justify-center items-center"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1.2 }}
      >
        <div className="w-[90%] md:w-[70%] lg:w-[60%]">
          <PhoneCarousel images={exampleImages} />
        </div>
      </motion.div>
    </div>
  );
}
