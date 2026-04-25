import { Icon } from "@/components/ui/Icon";

type Props = {
  position: number;
};

function padded(position: number) {
  return position.toString().padStart(2, "0");
}

export function LockedQuestion({ position }: Props) {
  return (
    <li className="relative p-6 bg-surface rounded-lg border border-white/5 overflow-hidden select-none">
      <div className="blur-[4px] opacity-40 pointer-events-none">
        <div className="flex items-start gap-4">
          <div className="bg-surface-variant text-on-surface-variant rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-label-caps text-label-caps">
            {padded(position)}
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong>Focus Area:</strong> Locked Content
            </p>
          </div>
        </div>
      </div>
      <Icon
        name="lock"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary-container/80 drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]"
      />
    </li>
  );
}
