import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...rest }: Props) {
  return (
    <textarea
      className={`neu-recessed rounded-lg w-full p-4 text-on-surface placeholder:text-on-surface-variant/50 font-body-sm text-body-sm resize-none ${className}`.trim()}
      {...rest}
    />
  );
}
