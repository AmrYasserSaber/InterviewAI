import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: Props) {
  return (
    <input
      className={`neu-recessed rounded-lg w-full px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 font-body-base text-body-base ${className}`.trim()}
      {...rest}
    />
  );
}
