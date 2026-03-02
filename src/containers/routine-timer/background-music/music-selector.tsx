import { useState, useEffect } from 'react';
import { Music, X } from 'lucide-react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { getMusicTitle } from '@/utils/api/youtubeAPI';

type MusicSelectorProps = {
  videoId?: string;
  videoTitle?: string;
  onMusicChange: (videoId: string, videoTitle?: string) => void;
};

const extractVideoId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  const matched = patterns
    .map((pattern) => url.match(pattern))
    .find((match) => match?.[1]);

  return matched?.[1] ?? '';
};

export function MusicSelector({
  videoId,
  videoTitle,
  onMusicChange,
}: MusicSelectorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (videoId && !youtubeUrl) {
      setYoutubeUrl(`https://www.youtube.com/watch?v=${videoId}`);
    }
  }, [videoId, youtubeUrl]);

  const handleSubmit = async () => {
    setError('');

    if (!youtubeUrl.trim()) {
      onMusicChange('');
      return;
    }

    const extracted = extractVideoId(youtubeUrl);
    if (!extracted) {
      setError('유튜브 동영상 URL을 다시 확인해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const title = await getMusicTitle(extracted);
      onMusicChange(extracted, title);
    } catch {
      setError('동영상 정보를 가져오지 못했어요. URL을 다시 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setYoutubeUrl('');
    setError('');
    onMusicChange('');
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
          <Music className="size-5" />
          배경음악
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-500">
          유튜브 동영상 URL을 입력해주세요.
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setError('');
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary-outline"
            onClick={handleSubmit}
            disabled={!youtubeUrl.trim() || isLoading}
          >
            {isLoading ? '가져오는 중...' : '가져오기'}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {videoId && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary-50">
            <p className="text-sm line-clamp-1">
              {videoTitle || '배경음악이 설정되었습니다'}
            </p>
            <Button
              type="button"
              variant="primary-ghost"
              size="xs"
              onClick={handleRemove}
              className="shrink-0 text-gray-500 hover:text-red-500"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
