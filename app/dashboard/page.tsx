import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Saved Assessments — InterviewAI",
};

type AssessmentCard = {
  id: string;
  role: string;
  difficulty: string;
  experience: string;
  generatedAt: string;
  unlocked: boolean;
};

function difficultyColor(difficulty: string) {
  if (difficulty === "HARD" || difficulty === "EXPERT" || difficulty === "FAANG") return "text-error";
  if (difficulty === "EASY") return "text-primary-container";
  return "text-on-surface";
}

async function getAssessmentsForUser(userId: string): Promise<AssessmentCard[]> {
  const requests = await prisma.interviewRequest.findMany({
    where: { status: "COMPLETED", userId },
    include: { payment: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });
  return requests.map((request) => ({
    id: request.id,
    role: `${request.experienceLevel} · ${request.difficultyMode}`,
    difficulty: request.difficultyMode,
    experience: request.experienceLevel,
    generatedAt: new Date(request.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    unlocked: request.payment?.status === "CAPTURED",
  }));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <AuthCard
        title="Sign in to see your dashboard"
        subtitle="Your saved assessments and unlock status live behind your account."
      >
        <Link href="/sign-in?callbackUrl=%2Fdashboard" className="w-full">
          <Button variant="neon" block>
            <Icon name="login" />
            Sign In
          </Button>
        </Link>
        <GoogleSignInButton callbackUrl="/dashboard" />
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
          New here?{" "}
          <Link
            href="/sign-up?callbackUrl=%2Fdashboard"
            className="text-primary-fixed-dim hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    );
  }

  const assessments = await getAssessmentsForUser(user.id);

  return (
    <main className="flex-1 p-gutter md:p-margin-desktop min-h-screen relative z-10 flex flex-col max-w-[1300px] mx-auto w-full">
      <header className="mb-12">
        <h1 className="font-display-lg text-display-lg text-primary-container drop-shadow-[0_0_15px_rgba(0,245,255,0.3)] mb-2">
          Saved Assessments
        </h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          Welcome back{user.name ? `, ${user.name}` : ""}. Manage and revisit your AI-generated interview sequences.
        </p>
      </header>

      <section className="mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <Input type="search" placeholder="Search roles, companies..." className="pl-12" />
        </div>
        <Link href="/generate">
          <Button variant="neon">
            <Icon name="add" className="text-sm" />
            New Assessment
          </Button>
        </Link>
      </section>

      {assessments.length === 0 ? (
        <section className="neu-raised rounded-xl p-12 text-center">
          <Icon name="psychology" className="text-primary-container text-5xl mb-4" />
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">No assessments yet</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mb-6">
            Generate your first tailored interview question set to see it here.
          </p>
          <Link href="/generate">
            <Button variant="neon" size="md">
              <Icon name="bolt" />
              Generate Questions
            </Button>
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-24">
          {assessments.map((assessment) => (
            <article
              key={assessment.id}
              className="neu-raised rounded-xl p-card-padding relative group overflow-hidden flex flex-col h-full min-h-[260px]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{assessment.role}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{assessment.id.slice(0, 10)}</p>
                </div>
                {assessment.unlocked ? (
                  <Chip variant="success">
                    <Icon name="lock_open" className="text-[14px]" />
                    Unlocked
                  </Chip>
                ) : (
                  <Chip variant="muted">
                    <Icon name="lock" className="text-[14px]" />
                    Locked
                  </Chip>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant/70 mb-1">Generated</p>
                  <p className="font-body-sm text-body-sm text-on-surface">{assessment.generatedAt}</p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant/70 mb-1">Difficulty</p>
                  <p className={`font-body-sm text-body-sm ${difficultyColor(assessment.difficulty)}`}>
                    {assessment.difficulty}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-card-padding">
                <Link href={`/results/${assessment.id}`} className="w-full">
                  <Button variant="neon" block>
                    <Icon name={assessment.unlocked ? "visibility" : "lock_open"} className="text-sm" />
                    {assessment.unlocked ? "View Results" : "Unlock Assessment"}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
