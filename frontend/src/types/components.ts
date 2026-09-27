import type { CSSProperties } from "react";

/** react-spring `animated.*` accepts plain CSS plus animated values; keep it loose. */
export type AnimatedStyle = CSSProperties | Record<string, unknown>;

export interface StyleableProps {
  className?: string;
  style?: CSSProperties;
}
