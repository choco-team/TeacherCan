import { GetMusicRequestRoomResponse } from '@/apis/music-request/musicRequest';
import { Button } from '@/components/button';
import { QueryObserverResult } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type Props = {
  isRefetching: boolean;
  musicRefetch: () => Promise<
    QueryObserverResult<GetMusicRequestRoomResponse, Error>
  >;
};

export function MusicRefresh({ isRefetching, musicRefetch }: Props) {
  const { toast } = useToast();

  const [countdown, setCountdown] = useState(15);
  const [rotation, setRotation] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (countdown > 10) {
      toast({
        title: `조금만 기다려 주세요, ${countdown - 10}초 후에 다시 시도할 수 있어요.`,
        variant: 'error',
      });
      return;
    }

    setCountdown(0);
  };

  useEffect(() => {
    if (countdown === 0) {
      setRotation((prev) => prev - 360); // 회전을 누적
    }
  }, [countdown]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          return 15;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (countdown !== 0 || isRefetching) {
      return;
    }

    musicRefetch();
  }, [musicRefetch, countdown]);

  return (
    <Button
      variant="primary"
      size="sm"
      className="fixed cursor-pointer bottom-[120px] w-10 h-10 right-4 bg-primary-500 z-10 rounded-3xl flex gap-1 font-normal hover:bg-primary-500 disabled:bg-gray-400 disabled:opacity-100 disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      <div className="relative flex justify-center items-center">
        <span className="absolute text-[10px] font-bold">{countdown}</span>
        <motion.div
          animate={{
            rotate: rotation,
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        >
          <RotateCcw size={28} strokeWidth={1.5} className="text-white" />
        </motion.div>
      </div>
    </Button>
  );
}
