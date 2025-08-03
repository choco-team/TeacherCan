'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RouletteConfig, RouletteState, RouletteItem } from '../roulette-types';
import { ROULETTE_COLORS } from '../roulette-constants';

interface RouletteWheelProps {
  config: RouletteConfig;
  state: RouletteState;
}

export function RouletteWheel({ config, state }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevItemsRef = useRef<RouletteItem[]>([]);

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    // 캔버스 크기 설정
    const size = config.radius * 2 + 40; // 여백 포함

    // 고해상도 디스플레이 지원
    const dpr = window.devicePixelRatio || 1;

    // CSS 크기 설정 (먼저)
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // 실제 캔버스 크기 설정
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // 컨텍스트 스케일 설정
    ctx.scale(dpr, dpr);
  }, [config.radius]);

  // 룰렛 그리기
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // 아이템이 변경되었을 때만 다시 그리기
    const itemsChanged =
      JSON.stringify(state.items) !== JSON.stringify(prevItemsRef.current);
    if (!itemsChanged && prevItemsRef.current.length > 0) {
      return;
    }

    prevItemsRef.current = state.items;

    const centerX = config.radius + 20;
    const centerY = config.radius + 20;
    const size = config.radius * 2 + 40;

    // 캔버스 클리어 (정확한 크기로)
    ctx.clearRect(0, 0, size, size);

    // 룰렛 배경 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, config.radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 각 섹션 그리기
    state.items.forEach((item, index) => {
      const { startAngle } = item;
      const { endAngle } = item;
      const color = ROULETTE_COLORS[index % ROULETTE_COLORS.length];

      // 섹션 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, config.radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 텍스트 그리기
      const textAngle = (startAngle + endAngle) / 2;
      const textRadius = config.radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';

      // 텍스트가 너무 길면 줄임
      const displayText =
        item.name.length > 8 ? `${item.name.substring(0, 8)}...` : item.name;
      ctx.fillText(displayText, 0, 0);

      // 가중치 표시
      if (item.weight > 1) {
        ctx.font = '12px Arial';
        ctx.fillText(`×${item.weight}`, 0, 20);
      }

      ctx.restore();
    });

    // 중앙 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [config.radius, state.items]); // currentAngle 제거하여 불필요한 리렌더링 방지

  return (
    <div className="relative w-fit mx-auto">
      <motion.div
        className="relative origin-center"
        animate={{
          rotate: state.currentAngle * (180 / Math.PI),
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <canvas
          ref={canvasRef}
          className="block h-auto transform-gpu will-change-transform"
        />
      </motion.div>

      {/* 고정된 포인터 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-red-500 mt-2.5 z-10" />
    </div>
  );
}
