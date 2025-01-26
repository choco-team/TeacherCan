export const formatFont = (hours: number) => {
  if (hours > 0) {
    return '240px Arial';
  }

  return '360px Arial';
};

export const formatTime = (hours: number, minutes: number, seconds: number) => {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  }

  return `${formattedMinutes} : ${formattedSeconds}`;
};
