import { useEffect, useState } from 'react';
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

const isPurplePixel = (r: number, g: number, b: number, a: number) => {
  if (a < 20) return false;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta < 18) return false;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return hue >= 260 && hue <= 340;
};

const recolorPurpleToWhite = (source: string): Promise<string> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(source);
        return;
      }

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (isPurplePixel(r, g, b, a)) {
          data[i] = 245;
          data[i + 1] = 245;
          data[i + 2] = 245;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => resolve(source);
    image.src = source;
  });

export default function StudentCard({
  student,
  onClick,
  onDecorate,
}: StudentCardProps) {
  const [recoloredStageImages, setRecoloredStageImages] = useState<string[]>([
    STAGE_IMAGE[0].src,
    STAGE_IMAGE[1].src,
    STAGE_IMAGE[2].src,
    STAGE_IMAGE[3].src,
  ]);

  useEffect(() => {
    let active = true;

    const recolorStages = async () => {
      const recolored1 = await recolorPurpleToWhite(STAGE_IMAGE[1].src);
      const recolored2 = await recolorPurpleToWhite(STAGE_IMAGE[2].src);
      const recolored3 = await recolorPurpleToWhite(STAGE_IMAGE[3].src);

      if (!active) return;
      setRecoloredStageImages([
        STAGE_IMAGE[0].src,
        recolored1,
        recolored2,
        recolored3,
      ]);
    };

    recolorStages();
    return () => {
      active = false;
    };
  }, []);

  const isActive = student.count > 0;
  const canDecorate = student.count >= 3;
  const stage = Math.min(student.count, recoloredStageImages.length - 1);
  const faceImage = recoloredStageImages[stage];

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
