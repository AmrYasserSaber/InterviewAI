import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata = {
  title: "Reset Payment Session — InterviewAI",
};

type SearchParams = Promise<{ requestId?: string }>;

export default async function PaymentResetPage({ searchParams }: { searchParams: SearchParams }) {
  const { requestId } = await searchParams;
  return (
    <main className="flex-grow flex items-center justify-center p-gutter relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="bg-surface rounded-xl shadow-neumorphic p-card-padding max-w-lg w-full z-10 relative border border-white/5 flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-8 rounded-full bg-surface-container flex items-center justify-center shadow-neumorphic-inset-soft relative">
          <Icon name="sync" filled className="text-primary-container text-glow" size={48} />
          <div className="absolute inset-0 rounded-full border border-primary-container/30 animate-pulse" />
        </div>

        <h1 className="font-headline-md text-headline-md text-on-background mb-4">Reset Payment Session</h1>
        <p className="font-body-base text-body-base text-on-surface-variant mb-10 max-w-sm">
          It looks like your payment session was interrupted or cancelled. Would you like to restart the unlock process
          for your interview questions?
        </p>

        <div className="flex flex-col w-full gap-4">
          {requestId ? (
            <Link href={`/results/${requestId}`}>
              <Button variant="neon" block>
                <Icon name="restart_alt" />
                Restart Payment Process
              </Button>
            </Link>
          ) : (
            <Link href="/generate">
              <Button variant="neon" block>
                <Icon name="bolt" />
                Generate Questions
              </Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="ghost" block>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
