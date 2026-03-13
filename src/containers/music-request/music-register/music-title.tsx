import { Skeleton } from '@/components/skeleton';

type MusicTitleProps = {
  title: string | undefined;
  isLoading: boolean;
  error: Error | null;
};

export default function MusicTitle({
  title,
  isLoading,
  error,
}: MusicTitleProps) {
  if (isLoading) {
    return (
      <Skeleton className="w-full h-[20px] bg-gray-100 dark:bg-gray-800" />
    );
  }

  if (error) {
    return (
      <span className="text-text-subtitle">
        음악 제목을 찾지 못했어요. 다시 시도해주세요.
      </span>
    );
  }

  return <span className="text-text-title">{title}</span>;
}
