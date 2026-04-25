import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "My Dashboard", href: "/dashboard" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="flex justify-between items-center h-20 px-6 md:px-12 w-full max-w-[1300px] mx-auto">
        <Link
          href="/"
          className="text-2xl font-display-lg font-bold text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,245,255,0.5)] tracking-tight"
        >
          InterviewAI
        </Link>

        <div className="hidden md:flex space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-all duration-300 active:scale-95 font-body-base text-body-base"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <SignOutButton email={user.email} name={user.name} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="btn-ghost font-label-caps text-label-caps uppercase tracking-wider transition-all duration-300 active:scale-95"
              >
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button variant="neumorphic" size="sm">
                  Create Account
                </Button>
              </Link>
            </>
          )}
          <Link href="/generate">
            <Button variant="neon" size="md">
              Generate Questions
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
