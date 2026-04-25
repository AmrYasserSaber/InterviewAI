import { Select } from "@/components/ui/Select";
import type { DifficultyMode } from "@/types";

type Props = {
  value: DifficultyMode;
  onChange: (value: DifficultyMode) => void;
  id?: string;
};

const OPTIONS: Array<{ value: DifficultyMode; label: string }> = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
  { value: "EXPERT", label: "Expert" },
  { value: "FAANG", label: "FAANG-level" },
];

export function DifficultySelector({ value, onChange, id }: Props) {
  return (
    <Select id={id} value={value} onChange={(event) => onChange(event.target.value as DifficultyMode)}>
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-surface-container text-on-surface">
          {option.label}
        </option>
      ))}
    </Select>
  );
}
