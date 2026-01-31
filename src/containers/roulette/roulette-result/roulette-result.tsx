'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/button';
import { RouletteItem } from '../roulette-types';

interface RouletteResultProps {
  selectedItem: RouletteItem | null;
  isVisible: boolean;
  onClose: () => void;
}

export function RouletteResult({
  selectedItem,
  isVisible,
  onClose,
}: RouletteResultProps) {
  if (!selectedItem) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              🎉
            </motion.div>

            <motion.h2
              className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              당첨!
            </motion.h2>

            <motion.div
              className="text-6xl font-semibold text-primary-500 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedItem.name}
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                onClose();
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2"
            >
              <Button size="lg">확인</Button>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
