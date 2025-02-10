import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { cn } from '@/styles/utils';

type TitleType = {
  title: string;
  isWinner: boolean;
  isMixingCards: boolean;
};

export default function Card({ title, isWinner, isMixingCards }: TitleType) {
  const isAlreadyPicked = isWinner && !isMixingCards;

  return (
    <div
      className={cn(
        'w-full h-24 text-gray-800 border border-gray-200 flex items-center justify-center font-semibold rounded-lg',
        'md:h-24',
        'lg:h-32 lg:rounded-2xl',
        isAlreadyPicked ? 'bg-gray-200 opacity-30' : 'bg-white',
      )}
    >
      {isAlreadyPicked ? (
        <div className="flex flex-col gap-y-1 items-center">
          <TeacherCanIcon width={60} height={60} />
        </div>
      ) : (
        <span className="text-4xl font-semibold">{title}</span>
      )}
    </div>
  );
}
