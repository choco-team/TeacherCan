import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleFlip = () => {
    if (winner.isflipped) {
      return;
    }

    handleCardFlip(winner.pickListId);
  };

  if (isHideResult) {
    return (
      <div onClick={handleFlip} className="perspective-1000 w-full h-[60px]">
        <AnimatePresence initial={false}>
          {winner.isflipped ? (
            <motion.div
              key="back"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -180 }}
              transition={{ duration: 0.6 }}
              className="bg-primary absolute w-full h-12 backface-hidden flex items-center justify-center text-white rounded-lg"
            >
              {winner.pickListValue}
            </motion.div>
          ) : (
            <motion.div
              key="front"
              initial={{ rotateY: -180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="bg-primary absolute w-full h-12 backface-hidden flex items-center justify-center text-white rounded-lg"
            >
              <TeacherCanLogo width="50" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-30 h-12 bg-primary text-white flex items-center justify-center rounded-lg">
      {winner.pickListValue}
    </div>
  );
}
