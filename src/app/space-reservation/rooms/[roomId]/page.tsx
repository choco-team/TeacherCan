import SpaceReservationRoomContainer from '@/containers/space-reservation/space-reservation-room-container';

export const metadata = {
  title: '공간예약 예약표',
};

export default function SpaceReservationRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  return <SpaceReservationRoomContainer params={params} />;
}
