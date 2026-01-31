export interface RouletteItem {
  id: string;
  name: string;
  weight: number; // 가중치 (*5, *10 등)
  color: string;
  angle: number; // 룰렛에서의 각도
  startAngle: number; // 섹션 시작 각도
  endAngle: number; // 섹션 끝 각도
}

export interface RouletteState {
  isSpinning: boolean;
  currentAngle: number;
  spinSpeed: number;
  items: RouletteItem[];
  selectedItem: RouletteItem | null;
}

export interface RouletteConfig {
  radius: number;
}
