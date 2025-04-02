export const getRandomBadgeColor = (label: string) => {
  // 문자열을 숫자로 변환 (일관된 해시값 생성)
  const hash = label.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + (acc * 32 - acc);
  }, 0);

  // 색상 생성 (hue: 0-360)
  const hue = Math.abs((hash + 200) % 360);

  return `hsl(${hue}, 35%, 55%)`;
};
