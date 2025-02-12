import History from './history/history';
import Schedule from './schedules/schedules';
import Welcome from './welcome/welcome';

function LandingContainer() {
  return (
    <div className="flex flex-col gap-16 max-w-[900px] mx-auto items-start mt-4 lg:mt-8">
      <Welcome />
      <History />
      <Schedule />
    </div>
  );
}

export default LandingContainer;
