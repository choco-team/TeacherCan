import { GetMusicRequestRoomResponse } from '@/apis/music-request/musicRequest';
import { Button } from '@/components/button';
import { QueryObserverResult } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type Props = {
  isRefetching: boolean;
  isAutoRefetch: boolean;
  musicRefetch: () => Promise<
    QueryObserverResult<GetMusicRequestRoomResponse, Error>
  >;
};

export function MusicRefresh({
  isRefetching,
  isAutoRefetch,
  musicRefetch,
}: Props) {
  const { toast } = useToast();

  const initCountdown = isAutoRefetch ? 15 : 5;
  const [countdown, setCountdown] = useState(initCountdown);
  const [rotation, setRotation] = useState(0);

  const enabledFetchRestTime = isAutoRefetch ? countdown - 10 : countdown;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (enabledFetchRestTime > 0) {
      toast({
        title: `조금만 기다려 주세요, ${enabledFetchRestTime}초 후에 다시 시도할 수 있어요.`,
        variant: 'error',
      });
      return;
    }

    if (isRefetching) {
      toast({
        title: '지금 다시 불러오고 있어요.',
        variant: 'error',
      });
      return;
    }

    musicRefetch();
    setCountdown(initCountdown);
    setRotation((prev) => prev - 360);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0 && isAutoRefetch) {
          return initCountdown;
        }

        if (prev <= 0 && !isAutoRefetch) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (!intervalRef.current) {
        return;
      }

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isAutoRefetch]);

  useEffect(() => {
    setCountdown(initCountdown);
  }, [isAutoRefetch]);

  useEffect(() => {
    if (countdown !== 0 || isRefetching || !isAutoRefetch) {
      return;
    }

    musicRefetch();
    setRotation((prev) => prev - 360);
  }, [musicRefetch, isAutoRefetch, countdown]);

  return (
    <Button
      variant="primary"
      size="sm"
      className="fixed cursor-pointer bottom-[120px] w-10 h-10 right-4 bg-primary-500 z-10 rounded-3xl flex gap-1 font-normal hover:bg-primary-500 disabled:bg-gray-400 disabled:opacity-100 disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      <div className="relative flex justify-center items-center">
        {isAutoRefetch ? (
          <span className="absolute text-[10px] font-bold">{countdown}</span>
        ) : null}
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
