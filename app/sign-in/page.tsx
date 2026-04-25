import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In — InterviewAI",
};

type SearchParams = Promise<{ callbackUrl?: string }>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) {
    redirect(callbackUrl ?? "/dashboard");
  }
  const signUpHref = callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up";

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to save and revisit your interview sessions.">
      <GoogleSignInButton callbackUrl={callbackUrl ?? "/dashboard"} />

      <div className="flex items-center gap-3 text-on-surface-variant">
        <div className="h-px flex-1 bg-outline-variant/50" />
        <span className="font-label-caps text-label-caps uppercase">or</span>
        <div className="h-px flex-1 bg-outline-variant/50" />
      </div>

      <SignInForm />

      <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
        Don&apos;t have an account?{" "}
        <Link href={signUpHref} className="text-primary-fixed-dim hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
