export const getScreenSize = () => {
  if (typeof window === 'undefined') {
    return {
      width: undefined,
      height: undefined,
    };
  }

  const { width, height } = window.screen;

  return {
    width,
    height,
  };
};
