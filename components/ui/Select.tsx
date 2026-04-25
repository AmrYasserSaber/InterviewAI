import type { PropsWithChildren, SelectHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = PropsWithChildren<SelectHTMLAttributes<HTMLSelectElement>>;

export function Select({ children, className = "", ...rest }: Props) {
  return (
    <div className="relative">
      <select
        className={`neu-recessed rounded-lg w-full p-4 pr-12 text-on-surface font-body-base text-body-base appearance-none cursor-pointer ${className}`.trim()}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="arrow_drop_down"
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
      />
    </div>
  );
}
