import { useEffect, useLayoutEffect, useRef } from 'react';
import { formatFont, formatTime } from './countdown-display.utils';

export const useTimerPIP = (
  hours: number,
  minutes: number,
  seconds: number,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = formatFont(hours);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        formatTime(hours, minutes, seconds),
        canvas.width / 2,
        canvas.height / 2,
      );
    };

    draw();
  }, [hours, minutes, seconds]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const scaleFactor = 4;
    canvas.width = 400 * scaleFactor;
    canvas.height = 200 * scaleFactor;

    canvas.style.width = '400px';
    canvas.style.height = '200px';

    const stream = canvas.captureStream();
    video.srcObject = stream;
    video.muted = true;
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;

    if (!video.paused || !video) {
      return;
    }

    video.play();
  };

  const startPiP = async () => {
    const video = videoRef.current;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().then(() => {});
      return;
    }

    if (document.pictureInPictureEnabled) {
      try {
        await video.requestPictureInPicture();
      } catch (error) {
        console.error('PiP 모드 요청 중 오류 발생:', error);
      }
    } else {
      console.error('브라우저가 PiP 모드를 지원하지 않습니다.');
    }
  };

  return {
    canvasRef,
    videoRef,
    startPiP,
    handlePlay,
  };
};
