import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { useRandomPickPlaygroundAction } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';

export default function ResultCard({ winner }) {
  const { handleCardFlip } = useRandomPickPlaygroundAction();
  const { pickList, pickType } = useRandomPickState();

  return (
    <div
      className={`relative w-30 h-20 cursor-pointer transform transition-transform duration-500 perspective-1000 ${winner.isflipped ? 'rotate-y-180' : ''}`}
      onClick={() => handleCardFlip(winner.id)}
    >
      <div className="absolute inset-0 w-full h-full bg-primary text-white flex items-center justify-center backface-hidden rounded-lg ">
        <TeacherCanLogo width="50" />
      </div>
      <div className="absolute inset-0 w-full h-full bg-primary text-white flex items-center justify-center backface-hidden rounded-lg transform rotate-y-180">
        {' '}
        {pickList[pickType][winner.id].value}{' '}
      </div>
    </div>
  );
}
