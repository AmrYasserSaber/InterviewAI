import type { PropsWithChildren } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthCard({ title, subtitle, children }: Props) {
  return (
    <main className="flex-grow flex items-center justify-center p-gutter md:p-margin-desktop">
      <div className="neu-raised rounded-xl p-card-padding w-full max-w-md flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full opacity-[0.03] blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <header className="flex flex-col items-center text-center gap-2 relative">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-surface-dim border border-white/5 mb-2 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
            <Icon name="psychology" className="text-primary-fixed-dim" filled />
          </div>
          <h1 className="font-display-lg text-[32px] leading-tight text-on-surface">{title}</h1>
          <p className="font-body-base text-body-base text-on-surface-variant">{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}
