'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  if (!selectedItem) return null;

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
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
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
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              당첨!
            </motion.h2>

            <motion.div
              className="text-xl font-semibold text-blue-600 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedItem.name}
              {selectedItem.weight > 1 && (
                <span className="text-sm text-gray-500 ml-2">
                  (×{selectedItem.weight})
                </span>
              )}
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              확인
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
