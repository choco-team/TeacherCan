import History from './history/history';
import LunchMenu from './lunch-menu/lunchmenu';
import Schedule from './schedules/schedules';
import Welcome from './welcome/welcome';
import { AllergyProvider } from './lunch-menu/allergy/allergyContext';

function LandingContainer() {
  return (
    <AllergyProvider>
      <div className="flex flex-col gap-16 max-w-[900px] w-full mx-auto items-start pt-4 pb-16 lg:mt-8">
        <Welcome />
        <History />
        <Schedule />
        <LunchMenu />
      </div>
    </AllergyProvider>
  );
}

export default LandingContainer;
