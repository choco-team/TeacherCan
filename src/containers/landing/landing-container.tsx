'use client';

import LogoTitle from './logo-title/logo-title';
import MenuList from './menu-list/menu-list';

function LandingContainer() {
  const handleClickTimerButton = () => {
    // TODO: 타이머 버튼 클릭
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-24 p-12 min-h-screen">
      <LogoTitle />
      <MenuList handleClickTimerButton={handleClickTimerButton} />
    </div>
  );
}

export default LandingContainer;
