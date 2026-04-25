import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  filled?: boolean;
  size?: number | string;
};

export function Icon({ name, filled, size, className = "", style, ...rest }: Props) {
  const resolvedStyle = {
    ...style,
    ...(size ? { fontSize: typeof size === "number" ? `${size}px` : size } : {}),
  };
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined ${filled ? "filled" : ""} ${className}`.trim()}
      style={resolvedStyle}
      {...rest}
    >
      {name}
    </span>
  );
}
