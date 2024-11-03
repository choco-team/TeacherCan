import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { useRandomPickPlaygroundAction } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';
import { WinnersType } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider';

type Winner = {
  winner: WinnersType;
};
export default function ResultCard({ winner }: Winner) {
  const { handleCardFlip } = useRandomPickPlaygroundAction();
  const {
    options: { isHideResult },
  } = useRandomPickState();

  return isHideResult ? (
    <div
      className={`relative w-30 h-12 cursor-pointer transform transition-transform duration-500 perspective-1000 ${winner.isflipped ? 'rotate-y-180' : ''}`}
      onClick={() => handleCardFlip(winner.pickListId)}
    >
      <div className="absolute inset-0 w-full h-full bg-primary text-white flex items-center justify-center backface-hidden rounded-lg ">
        <TeacherCanLogo width="50" />
      </div>
      <div className="absolute inset-0 w-full h-full bg-primary text-white flex items-center justify-center backface-hidden rounded-lg transform rotate-y-180">
        {winner.pickListValue}
      </div>
    </div>
  ) : (
    <div className="w-30 h-12 bg-primary text-white flex items-center justify-center rounded-lg">
      {winner.pickListValue}
    </div>
  );
}
