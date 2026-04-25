"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = {
  callbackUrl?: string;
};

export function GoogleSignInButton({ callbackUrl = "/dashboard" }: Props) {
  return (
    <Button
      type="button"
      variant="neumorphic"
      block
      onClick={() => void signIn("google", { callbackUrl })}
    >
      <Icon name="login" />
      Continue with Google
    </Button>
  );
}
