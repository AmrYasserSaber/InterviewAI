import { InterviewForm } from "@/components/form/InterviewForm";

export const metadata = {
  title: "Generate Interview Questions — InterviewAI",
};

export default function GeneratePage() {
  return (
    <main className="flex-grow flex items-center justify-center p-gutter md:p-margin-desktop w-full max-w-[1440px] mx-auto">
      <InterviewForm />
    </main>
  );
}
