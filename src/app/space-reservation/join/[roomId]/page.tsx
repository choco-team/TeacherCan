import SpaceReservationJoinContainer from '@/containers/space-reservation/space-reservation-join-container';

export const metadata = {
  title: '공간 참여',
};

export default function SpaceReservationJoinPage({
  params,
  searchParams,
}: {
  params: { roomId: string };
  searchParams: { invite?: string; seed?: string };
}) {
  return (
    <SpaceReservationJoinContainer
      params={params}
      searchParams={searchParams}
    />
  );
}
