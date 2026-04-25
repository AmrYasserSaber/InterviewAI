import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Create Account — InterviewAI",
};

type SearchParams = Promise<{ callbackUrl?: string }>;

export default async function SignUpPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) {
    redirect(callbackUrl ?? "/dashboard");
  }
  const signInHref = callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in";

  return (
    <AuthCard title="Create your account" subtitle="Start saving every interview assessment you generate.">
      <GoogleSignInButton callbackUrl={callbackUrl ?? "/dashboard"} />

      <div className="flex items-center gap-3 text-on-surface-variant">
        <div className="h-px flex-1 bg-outline-variant/50" />
        <span className="font-label-caps text-label-caps uppercase">or</span>
        <div className="h-px flex-1 bg-outline-variant/50" />
      </div>

      <SignUpForm />

      <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
        Already have an account?{" "}
        <Link href={signInHref} className="text-primary-fixed-dim hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
