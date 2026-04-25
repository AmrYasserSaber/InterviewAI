"use client";

import Link from "next/link";
import { PayPalButton } from "@/components/results/PayPalButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = {
  requestId: string;
  onPaymentStarted: () => void;
  isPolling: boolean;
  isAuthenticated: boolean;
};

export function UnlockCTA({ requestId, onPaymentStarted, isPolling, isAuthenticated }: Props) {
  const callbackUrl = encodeURIComponent(`/results/${requestId}`);

  return (
    <div className="relative z-30 mt-[-60px] flex flex-col items-center bg-surface-container-highest rounded-xl border border-primary-container/30 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      <Icon
        name="key"
        className="text-primary-container text-5xl mb-4 drop-shadow-[0_0_12px_rgba(0,245,255,0.6)]"
        size={48}
      />
      <h2 className="font-headline-md text-headline-md text-on-surface mb-2 text-center">
        Unlock the full interview question set.
      </h2>
      <p className="font-body-base text-body-base text-on-surface-variant mb-8 text-center max-w-md">
        Get access to all 10 specialized questions and focus areas tailored to your role.
      </p>

      {isAuthenticated ? (
        <>
          <div className="w-full max-w-sm">
            <PayPalButton requestId={requestId} onPaymentStarted={onPaymentStarted} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-2 rounded-full border border-white/5 font-body-sm text-body-sm">
            <Icon name="verified_user" className="text-sm" />
            Pay with PayPal — secure server-side unlock
          </div>
          {isPolling ? (
            <p className="mt-6 text-sm text-primary-fixed-dim">Verifying payment and unlocking questions…</p>
          ) : null}
        </>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <Link href={`/sign-in?callbackUrl=${callbackUrl}`} className="w-full">
            <Button variant="neon" block>
              <Icon name="login" />
              Sign in to unlock
            </Button>
          </Link>
          <Link href={`/sign-up?callbackUrl=${callbackUrl}`} className="w-full">
            <Button variant="neumorphic" block>
              <Icon name="person_add" />
              Create a free account
            </Button>
          </Link>
          <p className="text-center text-body-sm text-on-surface-variant mt-2">
            An account keeps your history and lets you pay securely via PayPal.
          </p>
        </div>
      )}
    </div>
  );
}
