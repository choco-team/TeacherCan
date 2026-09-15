import { Gift } from 'lucide-react';
import { PresentationStudent } from '@/types/presentation-assistant';

// 🐣 기존 병아리 이미지
import chickStage0 from '@/assets/images/presentation-assistant/chick-stage-0.png';
import chickStage1 from '@/assets/images/presentation-assistant/chick-stage-1.png';
import chickStage2 from '@/assets/images/presentation-assistant/chick-stage-2.png';
import chickStage3 from '@/assets/images/presentation-assistant/chick-stage-3.png';

// 🐧 새롭게 추가된 펭귄 이미지 (파일명이 다르면 여기를 수정해주세요!)
import penguinStage1 from '@/assets/images/presentation-assistant/penguin-stage-1.png';
import penguinStage2 from '@/assets/images/presentation-assistant/penguin-stage-2.png';
import penguinStage3 from '@/assets/images/presentation-assistant/penguin-stage-3.png';

interface StudentCardProps {
  student: PresentationStudent;
  theme?: string; // 💡 테마 속성 추가 ('chick' 또는 'penguin')
  onClick: () => void;
  onDecorate?: () => void;
}

// 💡 핵심 로직: 테마별 이미지 매핑 (0단계는 병아리 알로 똑같이 통일!)
const THEME_IMAGES: Record<string, any[]> = {
  chick: [chickStage0, chickStage1, chickStage2, chickStage3],
  penguin: [chickStage0, penguinStage1, penguinStage2, penguinStage3], // 0단계는 재사용
};

export default function StudentCard({
  student,
  theme = 'chick', // 기본값은 병아리
  onClick,
  onDecorate,
}: StudentCardProps) {
  const isActive = student.count > 0;
  const canDecorate = student.count >= 3;

  // 현재 선택된 테마의 이미지 배열 불러오기
  const currentImages = THEME_IMAGES[theme] || THEME_IMAGES.chick;
  const stage = Math.min(student.count, currentImages.length - 1);
  const faceImage = currentImages[stage].src;

  return (
    <button
      onClick={onClick}
      className={`relative flex h-[240px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md active:scale-95 ${
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

      <div className="relative flex h-32 w-32 items-center justify-center">
        <img
          src={faceImage}
          alt={`발표 ${student.count}회 단계 이미지`}
          className="h-32 w-32 object-contain"
          decoding="sync"
          width={128}
          height={128}
        />
        {student.decoration && (
          <span className="absolute -left-1 -top-1 text-2xl drop-shadow-sm">
            {student.decoration}
          </span>
        )}
      </div>

      <span
        className={`text-lg font-bold leading-tight ${
          isActive ? 'text-primary' : 'text-foreground'
        }`}
      >
        {student.fullName}
      </span>

      {student.count > 0 && (
        <span className="text-base font-semibold text-muted-foreground">
          {student.count}회
        </span>
      )}
    </button>
  );
}
