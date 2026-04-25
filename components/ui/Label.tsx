import type { LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = PropsWithChildren<
  LabelHTMLAttributes<HTMLLabelElement> & {
    icon?: string;
    iconNode?: ReactNode;
  }
>;

export function Label({ children, icon, iconNode, className = "", ...rest }: Props) {
  return (
    <label
      className={`font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-2 ${className}`.trim()}
      {...rest}
    >
      {icon ? <Icon name={icon} className="text-[16px]" /> : null}
      {iconNode}
      {children}
    </label>
  );
}
