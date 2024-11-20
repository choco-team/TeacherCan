import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { cn } from '@/styles/utils';

type TitleType = {
  title: string;
  isWinner: boolean;
  isOpenModal: boolean;
};

export default function Card({ title, isWinner, isOpenModal }: TitleType) {
  const shouldRenderPickUI = isWinner && !isOpenModal;

  const backgroundColor = shouldRenderPickUI ? 'bg-primary-300' : 'bg-white';

  return (
    <div
      className={cn(
        'w-full text-primary border border-primary flex items-center justify-center rounded-md text-[36px] aspect-[5/3]',
        backgroundColor,
      )}
    >
      {shouldRenderPickUI ? (
        <div className="flex flex-col gap-2 items-center">
          <TeacherCanLogo width="60" height="60" />
          <span className="text-sm text-primary-600">당첨</span>
        </div>
      ) : (
        <span>{title}</span>
      )}
    </div>
  );
}
