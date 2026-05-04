import { Gift } from 'lucide-react';
import { PresentationStudent } from '@/types/presentation-assistant';
import chickStage0 from '@/assets/images/presentation-assistant/chick-stage-0.png';
import chickStage1 from '@/assets/images/presentation-assistant/chick-stage-1.png';
import chickStage2 from '@/assets/images/presentation-assistant/chick-stage-2.png';
import chickStage3 from '@/assets/images/presentation-assistant/chick-stage-3.png';

interface StudentCardProps {
  student: PresentationStudent;
  onClick: () => void;
  onDecorate?: () => void;
}

const STAGE_IMAGE = [chickStage0, chickStage1, chickStage2, chickStage3];

export default function StudentCard({
  student,
  onClick,
  onDecorate,
}: StudentCardProps) {
  const isActive = student.count > 0;
  const canDecorate = student.count >= 3;
  const stage = Math.min(student.count, STAGE_IMAGE.length - 1);
  const faceImage = STAGE_IMAGE[stage].src;

  return (
    <button
      onClick={onClick}
      className={`relative flex h-[180px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md active:scale-95 ${
        isActive
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-card hover:border-muted-foreground/30'
      }`}
    >
      {canDecorate && onDecorate && (
        <div
          className="absolute right-1.5 top-1.5 z-10 rounded-lg bg-primary/10 p-1.5 transition-colors hover:bg-primary/20"
          onClick={(event) => {
            event.stopPropagation();
            onDecorate();
          }}
        >
          <Gift className="h-3.5 w-3.5 text-primary" />
        </div>
      )}

      <div className="relative flex h-24 w-24 items-center justify-center">
        <img
          src={faceImage}
          alt={`발표 ${student.count}회 단계 병아리`}
          className="h-24 w-24 object-contain"
          decoding="sync"
          width={96}
          height={96}
        />
        {student.decoration && (
          <span className="absolute -right-1 -top-1 text-2xl drop-shadow-sm">
            {student.decoration}
          </span>
        )}
      </div>

      <span
        className={`text-base font-bold leading-tight ${
          isActive ? 'text-primary' : 'text-foreground'
        }`}
      >
        {student.fullName}
      </span>

      {student.count > 0 && (
        <span className="text-sm font-semibold text-muted-foreground">
          {student.count}회
        </span>
      )}
    </button>
  );
}
