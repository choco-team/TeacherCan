import { useState, useEffect } from 'react';
import { Gift, RotateCcw } from 'lucide-react';
import { PresentationStudent } from '@/types/presentation-assistant';

// 🐣 병아리
import chickStage0 from '@/assets/images/presentation-assistant/chick-stage-0.png';
import chickStage1 from '@/assets/images/presentation-assistant/chick-stage-1.png';
import chickStage2 from '@/assets/images/presentation-assistant/chick-stage-2.png';
import chickStage3 from '@/assets/images/presentation-assistant/chick-stage-3.png';

// 🐧 펭귄
import penguinStage1 from '@/assets/images/presentation-assistant/penguin-stage-1.png';
import penguinStage2 from '@/assets/images/presentation-assistant/penguin-stage-2.png';
import penguinStage3 from '@/assets/images/presentation-assistant/penguin-stage-3.png';

// 🦚 공작새
import peacockStage2 from '@/assets/images/presentation-assistant/peacock-stage-1.png';
import peacockStage3 from '@/assets/images/presentation-assistant/peacock-stage-2.png';
import peacockStage4 from '@/assets/images/presentation-assistant/peacock-stage-3.png';

// 🐍 뱀
import snakeStage1 from '@/assets/images/presentation-assistant/snake-stage-1.png';
import snakeStage2 from '@/assets/images/presentation-assistant/snake-stage-2.png';
import snakeStage3 from '@/assets/images/presentation-assistant/snake-stage-3.png';

// 🐢 거북이
import turtleStage1 from '@/assets/images/presentation-assistant/turtle-stage-1.png';
import turtleStage2 from '@/assets/images/presentation-assistant/turtle-stage-2.png';
import turtleStage3 from '@/assets/images/presentation-assistant/turtle-stage-3.png';

interface StudentCardProps {
  student: PresentationStudent;
  theme?: string;
  onClick: () => void;
  onDecorate?: () => void;
  onUndo?: () => void;
}

const THEME_IMAGES: Record<string, any[]> = {
  chick: [chickStage0, chickStage1, chickStage2, chickStage3],
  penguin: [chickStage0, penguinStage1, penguinStage2, penguinStage3],
  peacock: [chickStage0, peacockStage2, peacockStage3, peacockStage4],
  snake: [chickStage0, snakeStage1, snakeStage2, snakeStage3],
  turtle: [chickStage0, turtleStage1, turtleStage2, turtleStage3],
};

const AVAILABLE_THEMES = ['chick', 'penguin', 'peacock', 'snake', 'turtle'];

export default function StudentCard({
  student,
  theme = 'chick',
  onClick,
  onDecorate,
  onUndo,
}: StudentCardProps) {
  const [randomTheme, setRandomTheme] = useState(() => {
    const nameHash = student.fullName
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVAILABLE_THEMES[nameHash % AVAILABLE_THEMES.length];
  });

  useEffect(() => {
    if (student.count === 0) {
      const randomIndex = Math.floor(Math.random() * AVAILABLE_THEMES.length);
      setRandomTheme(AVAILABLE_THEMES[randomIndex]);
    }
  }, [student.count]);

  const isActive = student.count > 0;
  const canDecorate = student.count >= 3;

  const appliedTheme = theme === 'random' ? randomTheme : theme;
  const currentImages = THEME_IMAGES[appliedTheme] || THEME_IMAGES.chick;
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
      {/* ⏪ 좌측 하단(bottom-1.5, left-1.5)으로 위치 변경: 꾸미기 아이콘과 겹치지 않게 피신! */}
      {isActive && onUndo && (
        <div
          className="absolute bottom-1.5 left-1.5 z-10 rounded-lg bg-red-100 p-1.5 text-red-500 transition-colors hover:bg-red-200"
          onClick={(event) => {
            event.stopPropagation();
            onUndo();
          }}
          title="실수 취소하기 (1점 빼기)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </div>
      )}

      {/* 🎁 우측 상단: 꾸미기 버튼 */}
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
        {/* ✨ 캐릭터 좌측 상단의 꾸미기 이모지 (이제 가려지지 않습니다!) */}
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
