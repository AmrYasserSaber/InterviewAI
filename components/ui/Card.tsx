import type { HTMLAttributes, PropsWithChildren } from "react";

type Variant = "raised" | "raised-lg" | "recessed" | "flat";

type Props = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    variant?: Variant;
    padded?: boolean;
  }
>;

const variants: Record<Variant, string> = {
  raised: "neu-raised",
  "raised-lg": "neu-raised-lg",
  recessed: "neu-recessed",
  flat: "bg-surface-container border border-white/5",
};

export function Card({ children, variant = "raised-lg", padded = true, className = "", ...rest }: Props) {
  return (
    <div
      className={`${variants[variant]} rounded-xl ${padded ? "p-card-padding" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
