import Countdown from '../../containers/timer/timer-container';

export const metadata = {
  title: 'Timer',
};
export default function Timer() {
  return (
    <div>
      <Countdown />
    </div>
  );
}
