import DdayList from './dDay-list/dDay-list';
import LogoTitle from './logo-title/logo-title';
import MenuList from './menu-list/menu-list';

function LandingContainer() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-24 p-12 min-h-screen">
      <LogoTitle />
      <MenuList />
      <DdayList />
    </div>
  );
}

export default LandingContainer;
