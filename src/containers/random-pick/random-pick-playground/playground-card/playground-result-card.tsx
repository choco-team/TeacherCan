import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';
import { WinnersType } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider';

type Winner = {
  winner: WinnersType;
};
export default function ResultCard({ winner }: Winner) {
  const {
    options: { isHideResult },
  } = useRandomPickState();
  const [isFlip, setIsFlip] = useState(!isHideResult);

  const handleFlip = () => {
    if (isFlip) {
      return;
    }

    setIsFlip(true);
  };

  return (
    <div onClick={handleFlip} className="perspective-1000 w-full h-[60px]">
      <AnimatePresence initial={false}>
        {isFlip ? (
          <motion.div
            key="back"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
            className="bg-primary absolute w-full h-full backface-hidden flex items-center justify-center text-white rounded-lg"
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
            className="bg-primary-300 absolute w-full h-full backface-hidden flex items-center justify-center text-white rounded-lg"
          >
            <TeacherCanLogo width="50" height="50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
