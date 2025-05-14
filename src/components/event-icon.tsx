import Image from 'next/image';
import { getDateEvent } from '@/utils/event';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';

type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export default function EventIcon({
  width = 16,
  height = 16,
  className = 'size-4',
}: Props) {
  const event = getDateEvent();

  if (event) {
    return (
      <Image
        src={event.icon}
        alt={event.name}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return <TeacherCanIcon width={width} height={height} />;
}
