import { Button } from "@/components/ui/button";

export type Duration = '7d' | '30d' | '90d' | 'all';

interface DurationFilterProps {
  selected: Duration;
  onChange: (duration: Duration) => void;
}

const durations: { value: Duration; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

export const DurationFilter = ({ selected, onChange }: DurationFilterProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {durations.map((duration) => (
        <Button
          key={duration.value}
          variant={selected === duration.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(duration.value)}
          className="transition-all"
        >
          {duration.label}
        </Button>
      ))}
    </div>
  );
};
