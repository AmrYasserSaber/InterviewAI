import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "neon" | "neumorphic" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    block?: boolean;
  }
>;

const base =
  "inline-flex items-center justify-center gap-2 font-label-caps text-label-caps uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-95 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  neon: "btn-neon",
  neumorphic:
    "bg-surface-variant text-on-surface border border-white/5 shadow-[8px_8px_16px_rgba(0,0,0,0.5),-2px_-2px_8px_rgba(255,255,255,0.05)] hover:bg-surface-bright",
  ghost: "btn-ghost bg-transparent border border-transparent hover:text-primary-fixed-dim",
  danger:
    "bg-transparent text-error border border-error/40 hover:bg-error/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

export function Button({
  children,
  variant = "neon",
  size = "md",
  block,
  className = "",
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${block ? "w-full" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
