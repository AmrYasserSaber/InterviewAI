type Props = {
  position: number;
  content: string;
  focusArea?: string;
  variant?: "unlocked" | "hero";
};

function padded(position: number) {
  return position.toString().padStart(2, "0");
}

export function QuestionItem({ position, content, focusArea, variant = "unlocked" }: Props) {
  if (variant === "hero") {
    return (
      <li className="flex items-start gap-6 group">
        <div className="font-headline-md text-headline-md text-surface-tint/40 group-hover:text-surface-tint transition-colors duration-300 select-none w-10 shrink-0 text-right">
          {padded(position)}
        </div>
        <div className="flex-grow pt-1">
          <p className="font-body-base text-body-base text-on-surface leading-relaxed">{content}</p>
          {focusArea ? (
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Focus Area:</strong> {focusArea}
            </p>
          ) : null}
        </div>
      </li>
    );
  }

  return (
    <li className="p-6 bg-surface rounded-lg shadow-neumorphic-inset-soft border border-white/5">
      <div className="flex items-start gap-4">
        <div className="bg-primary-container/20 text-primary-container rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-label-caps text-label-caps">
          {padded(position)}
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{content}</h3>
          {focusArea ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong>Focus Area:</strong> {focusArea}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}
