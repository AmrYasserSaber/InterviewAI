import { Select } from "@/components/ui/Select";
import type { ExperienceLevel } from "@/types";

type Props = {
  value: ExperienceLevel;
  onChange: (value: ExperienceLevel) => void;
  id?: string;
};

const OPTIONS: Array<{ value: ExperienceLevel; label: string }> = [
  { value: "JUNIOR", label: "Junior (0-2 years)" },
  { value: "MID", label: "Mid-Level (3-5 years)" },
  { value: "SENIOR", label: "Senior (5+ years)" },
  { value: "LEAD", label: "Lead" },
  { value: "PRINCIPAL", label: "Principal" },
];

export function ExperienceLevelSelect({ value, onChange, id }: Props) {
  return (
    <Select id={id} value={value} onChange={(event) => onChange(event.target.value as ExperienceLevel)}>
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-surface-container text-on-surface">
          {option.label}
        </option>
      ))}
    </Select>
  );
}
