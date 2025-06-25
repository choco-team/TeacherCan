'use client';

export default function LinkRoomContainer({
  params,
}: {
  params: {
    linkCode: string;
  };
}) {
  return `LinkRoomContainer, ${params.linkCode}`;
}
