import { motion, AnimatePresence } from 'framer-motion';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { WinnersType } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider';

type Winner = {
  winner: WinnersType;
  isOpen: boolean;
  handleOpenOne: (id: string) => void;
};

export default function ResultCard({ winner, isOpen, handleOpenOne }: Winner) {
  return (
    <div
      onClick={() => handleOpenOne(winner.id)}
      className="perspective-1000 w-60 aspect-[4/3]"
    >
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="back"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
            className="bg-gray-100 absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-card-foreground rounded-2xl text-[3.5rem] text-center font-bold"
          >
            {winner.value}
          </motion.div>
        ) : (
          <motion.button
            key="front"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
            className="bg-primary-200 absolute w-full h-full backface-hidden flex items-center justify-center p-6 text-card-foreground rounded-2xl"
          >
            <TeacherCanIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
