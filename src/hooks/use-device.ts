'use client';

import { useMediaQuery } from 'react-responsive';

function useDevice() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  return {
    isMobile,
    isDesktop: !isMobile,
  };
}

export default useDevice;
