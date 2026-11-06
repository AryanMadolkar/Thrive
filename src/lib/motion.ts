import type { Transition } from "motion/react";

/** Apple-like spring — snappy but soft */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

export const feedTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 36,
  mass: 0.8,
};

export const tapScale = { scale: 0.97 };
export const hoverLift = { y: -2 };
