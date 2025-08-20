export const formatTime = (time: number | string): string => {
  const timeString = time.toString();
  const [minutes, seconds] = timeString.includes(':')
    ? timeString.split(':')
    : ['0', '00'];
  return `${minutes}:${seconds.padStart(2, '0')}`;
};
