import LinkRoomContainer from '@/containers/link/link-room/link-room-container';

export const metadata = {
  title: '링크모음',
};

function LinkRoom({
  params,
}: {
  params: {
    linkCode: string;
  };
}) {
  return <LinkRoomContainer params={params} />;
}

export default LinkRoom;
