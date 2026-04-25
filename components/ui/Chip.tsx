import type { HTMLAttributes, PropsWithChildren } from "react";

type Variant = "default" | "accent" | "muted" | "success" | "danger";

const variants: Record<Variant, string> = {
  default: "bg-surface-variant text-on-surface-variant border border-white/5",
  accent: "bg-surface-variant text-primary-container border border-primary-container/30",
  muted: "bg-surface-container-high text-on-surface-variant border border-outline-variant",
  success: "bg-primary-container/10 text-primary-container border border-primary-container/30",
  danger: "bg-error-container/30 text-error border border-error/40",
};

type Props = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: Variant;
  }
>;

export function Chip({ children, variant = "default", className = "", ...rest }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase ${variants[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
