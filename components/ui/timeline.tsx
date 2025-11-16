"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ---------------- Timeline Context ----------------
interface TimelineContextType {
  textRef: React.RefObject<HTMLDivElement | null>;
  leftPos: number;
  rightPos: number;
  textHeight: number;
  handleWidth: number;
  handleLeftStart: (x: number) => void;
  handleRightStart: (x: number) => void;
}

const TimelineContext = createContext<TimelineContextType | null>(null);

const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context)
    throw new Error("Timeline components must be used within a Timeline");
  return context;
};

// ---------------- Timeline Component ----------------
interface TimelineProps {
  children: React.ReactNode;
  rotation?: number;
  initialLeft?: number;
  minWidth?: number;
  className?: string;
  containerClassName?: string;
  handleClassName?: string;
  handleIndicatorClassName?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  children,
  rotation = -2.76,
  initialLeft = 0,
  minWidth = 56,
  className,
  containerClassName,
  handleClassName,
  handleIndicatorClassName,
}) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightMotion = useMotionValue(0);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const [leftPos, setLeftPos] = useState(initialLeft);
  const [rightPos, setRightPos] = useState(0);
  const handleWidth = 28;

  // Update rightPos when motion value changes
  useEffect(() => rightMotion.onChange((v) => setRightPos(v)), [rightMotion]);

  // Measure text dimensions
  useEffect(() => {
    const measureText = () => {
      if (!textRef.current) return;
      const measuredWidth = textRef.current.offsetWidth;
      const measuredHeight = textRef.current.offsetHeight;
      setTextWidth(measuredWidth);
      setTextHeight(measuredHeight);
      const fullRight = measuredWidth + handleWidth * 2;
      setRightPos(fullRight);
      rightMotion.set(fullRight);
    };
    measureText();
    window.addEventListener("resize", measureText);
    return () => window.removeEventListener("resize", measureText);
  }, [children, rightMotion]);

  // Animate right handle based on inView
  useEffect(() => {
    if (!textWidth) return;
    const fullRight = textWidth + handleWidth * 2;
    if (isInView) {
      animate(rightMotion, fullRight, {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      });
    } else {
      animate(rightMotion, leftPos + minWidth, { duration: 0.6, ease: "easeInOut" });
    }
  }, [isInView, textWidth, leftPos, minWidth, rightMotion]);

  // Handle left drag
  const handleLeftStart = useCallback(
    (clientX: number) => {
      rightMotion.stop();
      const startLeft = leftPos;
      const startX = clientX;

      const handleMove = (x: number) => {
        let newLeft = startLeft + (x - startX);
        newLeft = Math.max(0, Math.min(newLeft, rightPos - minWidth));
        setLeftPos(newLeft);
      };

      const mouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const end = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchmove", touchMove);
        document.removeEventListener("touchend", end);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", touchMove);
      document.addEventListener("touchend", end);

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [leftPos, rightPos, minWidth, rightMotion]
  );

  // Handle right drag
  const handleRightStart = useCallback(
    (clientX: number) => {
      rightMotion.stop();
      const startRight = rightPos;
      const startX = clientX;
      const maxRight = textWidth + handleWidth * 2;

      const handleMove = (x: number) => {
        let newRight = startRight + (x - startX);
        newRight = Math.max(leftPos + minWidth, Math.min(newRight, maxRight));
        setRightPos(newRight);
        rightMotion.set(newRight);
      };

      const mouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const end = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchmove", touchMove);
        document.removeEventListener("touchend", end);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", touchMove);
      document.addEventListener("touchend", end);

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [leftPos, rightPos, minWidth, textWidth, rightMotion]
  );

  const width = Math.max(0, rightPos - leftPos);

  return (
    <TimelineContext.Provider
      value={{
        textRef,
        leftPos,
        rightPos,
        textHeight,
        handleWidth,
        handleLeftStart,
        handleRightStart,
      }}
    >
      <div ref={containerRef} className={cn("inline-block", className)}>
        <div
          className="relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            width: `${textWidth + handleWidth * 2}px`,
            height: `${textHeight}px`,
          }}
        >
          <div
            className={cn(
              "absolute top-0 rounded-2xl border border-black bg-background overflow-hidden",
              containerClassName
            )}
            style={{
              left: `${leftPos}px`,
              width: `${width}px`,
              height: `${textHeight}px`,
            }}
          >
            {/* Left handle */}
            <motion.div
              className={cn(
                "absolute left-0 top-0 w-7 border border-black rounded-full bg-background flex items-center justify-center cursor-ew-resize z-20 select-none",
                handleClassName
              )}
              onMouseDown={(e) => handleLeftStart(e.clientX)}
              onTouchStart={(e) => handleLeftStart(e.touches[0].clientX)}
              style={{ height: `${textHeight}px` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={cn(
                  "w-2 h-8 rounded-full bg-black pointer-events-none",
                  handleIndicatorClassName
                )}
              />
            </motion.div>

            {/* Right handle */}
            <motion.div
              className={cn(
                "absolute right-0 top-0 w-7 border border-black rounded-full bg-background flex items-center justify-center cursor-ew-resize z-20 select-none",
                handleClassName
              )}
              onMouseDown={(e) => handleRightStart(e.clientX)}
              onTouchStart={(e) => handleRightStart(e.touches[0].clientX)}
              style={{ height: `${textHeight}px` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={cn(
                  "w-2 h-8 rounded-full bg-black pointer-events-none",
                  handleIndicatorClassName
                )}
              />
            </motion.div>

            {children}
          </div>
        </div>
      </div>
    </TimelineContext.Provider>
  );
};

// ---------------- TimelineText Component ----------------
interface TimelineTextProps {
  children: React.ReactNode;
  className?: string;
}

const TimelineText: React.FC<TimelineTextProps> = ({ children, className }) => {
  const { textRef } = useTimelineContext();
  return (
    <div
      ref={textRef}
      className={cn(
        "absolute left-7 flex items-center text-foreground font-bold text-4xl py-2 whitespace-nowrap pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
};

// ---------------- Exports ----------------
export { Timeline, TimelineText };
