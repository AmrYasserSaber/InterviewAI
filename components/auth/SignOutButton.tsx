"use client";

import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";

type Props = {
  email: string | null | undefined;
  name?: string | null | undefined;
};

export function SignOutButton({ email, name }: Props) {
  const label = name ?? email ?? "Account";
  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:inline font-body-sm text-body-sm text-on-surface-variant" title={email ?? undefined}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="btn-ghost inline-flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-wider transition-all duration-300 active:scale-95"
      >
        <Icon name="logout" className="text-sm" />
        Sign Out
      </button>
    </div>
  );
}
