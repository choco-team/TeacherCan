import { getScreenSize } from '@/utils/getScreenSize';

export const resizeBrowserSizeByScreen = (scale: number) => () => {
  const { width, height } = getScreenSize();

  window.resizeTo(width * scale, height * scale);
};
