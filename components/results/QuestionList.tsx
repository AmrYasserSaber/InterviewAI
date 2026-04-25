import { LockedQuestion } from "@/components/results/LockedQuestion";
import { QuestionItem } from "@/components/results/QuestionItem";
import { TOTAL_QUESTIONS } from "@/utils/constants";
import type { QuestionDTO } from "@/types";

type Props = {
  questions: QuestionDTO[];
  unlocked: boolean;
};

export function QuestionList({ questions, unlocked }: Props) {
  const byPosition = new Map(questions.map((q) => [q.position, q.content]));
  const positions = Array.from({ length: TOTAL_QUESTIONS }, (_, index) => index + 1);

  if (unlocked) {
    return (
      <ol className="space-y-8">
        {positions.map((position) => (
          <QuestionItem
            key={position}
            position={position}
            variant="hero"
            content={byPosition.get(position) ?? "Question unavailable"}
          />
        ))}
      </ol>
    );
  }

  return (
    <ul className="space-y-6">
      {positions.map((position) => {
        const content = byPosition.get(position);
        if (content) {
          return <QuestionItem key={position} position={position} content={content} />;
        }
        return <LockedQuestion key={position} position={position} />;
      })}
    </ul>
  );
}
