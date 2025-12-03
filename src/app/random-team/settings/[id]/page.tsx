import Settings from '@/containers/random-team/settings/settings';

export const metadata = {
  title: '모둠 설정',
};

export default function SettingsPage({ params }: { params: { id: string } }) {
  return <Settings settingsId={params.id} />;
}
