import { PresentationStudent } from '@/types/presentation-assistant';

interface StatsBarProps {
  students: PresentationStudent[];
}

export default function StatsBar({ students }: StatsBarProps) {
  const total = students.length;
  const presented = students.filter((student) => student.count > 0).length;
  const notPresented = total - presented;

  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <span className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground">
        전체 <strong>{total}명</strong>
      </span>
      <span className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground">
        발표 완료 <strong>{presented}명</strong>
      </span>
      <span className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground">
        미발표 <strong>{notPresented}명</strong>
      </span>
    </div>
  );
}
