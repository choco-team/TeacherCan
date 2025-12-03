import RandomTeamContainer from '@/containers/random-team/random-team-container';
import Link from 'next/link';

export const metadata = {
  title: '랜덤 모둠 뽑기',
};

export default function RandomTeam() {
  return (
    <div>
      <RandomTeamContainer />
      <Link href="/random-team/settings/1">설정으로 이동</Link>
    </div>
  );
}
