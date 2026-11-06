"use client";

import { LayoutGroup } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LayoutGroup id="thrive">{children}</LayoutGroup>;
}
