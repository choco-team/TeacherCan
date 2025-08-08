'use client';

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import * as planck from 'planck';
import { RouletteConfig, RouletteState, RouletteItem } from '../roulette-types';

interface RoulettePhysicsProps {
  config: RouletteConfig;
  state: RouletteState;
  onStateChange: (state: Partial<RouletteState>) => void;
  onResult: (item: RouletteItem) => void;
}

export const RoulettePhysics = forwardRef<
  { startSpin: () => void; stopSpin: () => void },
  RoulettePhysicsProps
>(({ config, state, onStateChange, onResult }, ref) => {
  // Planck.js 물리 엔진 관련 refs
  const worldRef = useRef<planck.World | null>(null); // 물리 월드
  const wheelBodyRef = useRef<planck.Body | null>(null); // 룰렛 휠 바디

  // 애니메이션 및 시간 관련 refs
  const animationFrameRef = useRef<number | null>(null); // requestAnimationFrame ID
  const lastTimeRef = useRef<number>(0); // 이전 프레임 시간
  const spinStartTimeRef = useRef<number>(0); // 회전 시작 시간

  // 회전 상태 관리 refs
  const isDeceleratingRef = useRef<boolean>(false); // 감속 중인지 여부
  const isSimulatingRef = useRef<boolean>(false); // 시뮬레이션 활성화 여부
  const isDoneRef = useRef<boolean>(false); // 회전 완료 여부

  // 회전 설정을 한 번만 계산하기 위한 refs
  const spinConfigRef = useRef<{
    maxSpeed: number;
    accelerationTime: number;
    constantSpeedTime: number;
    decelerationTime: number;
    totalSpinTime: number;
  } | null>(null);

  // Planck.js 물리 월드 및 룰렛 휠 초기화
  const initializeWorld = useCallback(() => {
    if (worldRef.current) {
      return; // 이미 초기화된 경우 중복 초기화 방지
    }

    // 중력이 없는 2D 물리 월드 생성
    const world = new planck.World({
      gravity: { x: 0, y: 0 },
    });

    // 룰렛 휠 바디 생성 (동적 바디, 회전 가능)
    const wheelBody = world.createBody({
      type: 'dynamic', // 물리 법칙에 따라 움직이는 바디
      position: { x: 0, y: 0 }, // 중심점 위치
      fixedRotation: false, // 회전 고정 해제
    });

    // 원형 휠 모양 생성 및 물리 속성 설정
    const wheelShape = new planck.Circle(config.radius);
    wheelBody.createFixture({
      shape: wheelShape,
      density: 1.0, // 밀도
      friction: 0.1, // 마찰력
      restitution: 0.2, // 탄성
    });

    // 생성된 월드와 바디를 ref에 저장
    worldRef.current = world;
    wheelBodyRef.current = wheelBody;
  }, [config]);

  // 물리 시뮬레이션 메인 루프 (매 프레임마다 실행)
  const simulate = useCallback(
    (timestamp: number) => {
      // 물리 월드와 휠 바디가 초기화되지 않은 경우 종료
      if (!worldRef.current || !wheelBodyRef.current) {
        return;
      }

      // 시간 계산
      lastTimeRef.current = timestamp; // 현재 시간을 이전 시간으로 저장
      const elapsedTime = timestamp - spinStartTimeRef.current; // 회전 시작 후 경과 시간

      // Planck.js 물리 시뮬레이션 스텝 실행 (60fps 기준)
      worldRef.current.step(1 / 60, 6, 2);

      // 현재 룰렛 휠의 상태 가져오기
      const currentAngle = wheelBodyRef.current.getAngle(); // 현재 각도 (라디안)
      const angularVelocity = wheelBodyRef.current.getAngularVelocity(); // 현재 각속도 (라디안/초)

      // 회전 로직 처리 (회전 중이거나 시뮬레이션이 활성화된 경우)
      if (state.isSpinning && spinConfigRef.current) {
        const {
          maxSpeed,
          accelerationTime,
          constantSpeedTime,
          decelerationTime,
          totalSpinTime,
        } = spinConfigRef.current;

        // 가속 단계 (0초 ~ 2초): 0에서 20까지 선형 증가
        if (elapsedTime < accelerationTime) {
          const progress = elapsedTime / accelerationTime; // 0 ~ 1
          const targetSpeed = maxSpeed * progress; // 0 ~ 20
          wheelBodyRef.current.setAngularVelocity(targetSpeed);
        }

        // 일정 속도 유지 단계 (2초 ~ 3초): 20 유지
        else if (elapsedTime < accelerationTime + constantSpeedTime) {
          wheelBodyRef.current.setAngularVelocity(maxSpeed);
        }

        // 감속 단계 (3초 ~ 5초): 20에서 0까지 선형 감소
        else if (elapsedTime < totalSpinTime) {
          const decelProgress =
            (elapsedTime - (accelerationTime + constantSpeedTime)) /
            decelerationTime; // 0 ~ 1
          const targetSpeed = maxSpeed * (1 - decelProgress); // 20 ~ 0
          wheelBodyRef.current.setAngularVelocity(targetSpeed);
        }

        // 회전 완료 (5초 후)
        else {
          wheelBodyRef.current.setAngularVelocity(0);
          isDoneRef.current = true;
          onStateChange({
            isSpinning: false,
            spinSpeed: 0,
          });
        }
      }

      // UI 업데이트를 위한 상태 변경 (각도와 속도)
      onStateChange({
        currentAngle,
        spinSpeed: angularVelocity,
      });

      // 회전 완료 시 결과 계산 및 선택
      if (isSimulatingRef.current && isDoneRef.current) {
        // 시뮬레이션 비활성화
        isSimulatingRef.current = false;

        const selectedItem = state.items.find((item) => {
          // 각 아이템의 섹션 범위 확인 (휠이 회전한 상태)
          // Planck.js는 3시 방향을 0도로 하므로, 12시 방향을 0도로 맞추기 위해 90도 보정
          // 3시 방향(0도)을 12시 방향(0도)으로 변환하기 위해 90도를 더함
          const angleOffset = Math.PI / 2; // 90도 (π/2 라디안)
          const rotatedStartAngle =
            (item.startAngle + currentAngle + angleOffset) % (2 * Math.PI);
          const rotatedEndAngle =
            (item.endAngle + currentAngle + angleOffset) % (2 * Math.PI);

          const startDegrees = (rotatedStartAngle * 180) / Math.PI;
          const endDegrees = (rotatedEndAngle * 180) / Math.PI;
          const pointerPositionDegrees = 0; // 포인터는 항상 0도 (12시 방향)

          // 360도가 0도와 같다는 것을 감안한 선택 로직
          let isSelected = false;

          // 경우 1: 일반적인 범위 (시작 < 끝)
          if (startDegrees <= endDegrees) {
            isSelected =
              startDegrees <= pointerPositionDegrees &&
              pointerPositionDegrees <= endDegrees;
          }
          // 경우 2: 360도를 넘어가는 범위 (시작 > 끝, 예: 350도 ~ 10도)
          else {
            // 포인터(0도)가 범위에 포함되는지 확인
            // 350도 ~ 10도 범위에서 0도는 포함됨
            isSelected =
              startDegrees <= pointerPositionDegrees ||
              pointerPositionDegrees <= endDegrees;
          }

          return isSelected;
        });

        if (selectedItem) {
          // 물리적으로 선택된 아이템을 그대로 최종 결과로 사용
          onResult(selectedItem);
          onStateChange({
            isSpinning: false,
            spinSpeed: 0,
            selectedItem,
          });
        }
      }

      // 다음 프레임 요청 (연속적인 시뮬레이션을 위해)
      animationFrameRef.current = requestAnimationFrame(simulate);
    },
    [state.isSpinning, state.items, onStateChange, onResult],
  );

  // 회전 설정 계산 함수
  const calculateSpinConfig = useCallback(() => {
    // 랜덤한 속도와 시간 설정
    const baseMaxSpeed = 20; // 기본 최대 속도 (rad/s)
    const speedVariation = 0.3; // 속도 변화 범위 (±30%)
    const maxSpeed =
      baseMaxSpeed * (1 + (Math.random() - 0.5) * speedVariation);

    const baseAccelerationTime = 2000; // 기본 가속 시간 (2초)
    const timeVariation = 0.4; // 시간 변화 범위 (±40%)
    const accelerationTime =
      baseAccelerationTime * (1 + (Math.random() - 0.5) * timeVariation);

    const baseConstantSpeedTime = 1000; // 기본 일정 속도 유지 시간 (1초)
    const constantSpeedTime =
      baseConstantSpeedTime * (1 + (Math.random() - 0.5) * timeVariation);

    const baseDecelerationTime = 2000; // 기본 감속 시간 (2초)
    const decelerationTime =
      baseDecelerationTime * (1 + (Math.random() - 0.5) * timeVariation);

    const totalSpinTime =
      accelerationTime + constantSpeedTime + decelerationTime; // 총 회전 시간

    spinConfigRef.current = {
      maxSpeed,
      accelerationTime,
      constantSpeedTime,
      decelerationTime,
      totalSpinTime,
    };
  }, []);

  // 룰렛 회전 시작 함수 (외부에서 호출)
  const startSpin = useCallback(() => {
    // 이미 회전 중이거나 휠 바디가 없는 경우 종료
    if (!wheelBodyRef.current || state.isSpinning) {
      return;
    }

    // 회전 완료 플래그 초기화
    isDoneRef.current = false;

    // 회전 시작 시간 기록 및 감속 플래그 초기화
    spinStartTimeRef.current = performance.now();
    isDeceleratingRef.current = false;

    // 초기 각속도 설정 (시계방향 회전)
    const initialSpeed = 5; // rad/s
    wheelBodyRef.current.setAngularVelocity(initialSpeed);

    // 시뮬레이션 활성화 (회전 로직 시작)
    isSimulatingRef.current = true;

    // 회전 설정 계산
    calculateSpinConfig();

    // UI 상태 업데이트
    onStateChange({
      isSpinning: true,
      spinSpeed: initialSpeed,
    });
  }, [state.isSpinning, onStateChange]);

  // 룰렛 회전 정지 함수 (외부에서 호출)
  const stopSpin = useCallback(() => {
    // 휠 바디가 없는 경우 종료
    if (!wheelBodyRef.current) {
      return;
    }

    // 즉시 감속 시작 (다음 프레임부터 감속 로직 적용)
    isDeceleratingRef.current = true;

    // UI 상태 업데이트
    onStateChange({
      isSpinning: false,
      spinSpeed: 0,
    });
  }, [onStateChange]);

  // 컴포넌트 마운트 시 초기화 및 시뮬레이션 시작
  useEffect(() => {
    // Planck.js 물리 월드 초기화
    initializeWorld();

    // 시뮬레이션 루프 시작
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(simulate);

    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeWorld, simulate]);

  // 외부에서 호출할 수 있는 메서드들을 ref로 노출
  useImperativeHandle(
    ref,
    () => ({
      startSpin, // 룰렛 회전 시작
      stopSpin, // 룰렛 회전 정지
    }),
    [startSpin, stopSpin],
  );

  // 이 컴포넌트는 UI를 렌더링하지 않고 물리 시뮬레이션만 담당
  return null;
});
