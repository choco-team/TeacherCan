import { Input } from '@/components/input';
import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

type MusicSelectorProps = {
  videoId: string;
  url?: string;
  onMusicChange: (videoId: string, url?: string) => void;
};

export function MusicSelector({
  videoId: initialVideoId,
  url: initialUrl,
  onMusicChange,
}: MusicSelectorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [musicVideoId, setMusicVideoId] = useState('');
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [musicError, setMusicError] = useState('');

  useEffect(() => {
    if (initialVideoId) {
      setMusicVideoId(initialVideoId);
      if (initialUrl) {
        setYoutubeUrl(initialUrl);
      }
    }
  }, [initialVideoId, initialUrl]);

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    const matchResult = patterns.find((pattern) => {
      const match = url.match(pattern);
      return match && match[1];
    });

    if (matchResult) {
      const match = url.match(matchResult);
      return match ? match[1] : '';
    }

    return '';
  };

  const handleYoutubeUrlChange = async (inputUrl: string) => {
    setYoutubeUrl(inputUrl);
    setMusicError('');

    if (!inputUrl.trim()) {
      setMusicVideoId('');
      onMusicChange('', undefined);
      return;
    }

    const extractedVideoId = extractVideoId(inputUrl);

    if (!extractedVideoId) {
      setMusicError('유튜브 동영상 URL을 다시 확인해주세요.');
      return;
    }

    if (extractedVideoId === musicVideoId) return;

    setIsLoadingMusic(true);
    try {
      setMusicVideoId(extractedVideoId);
      onMusicChange(extractedVideoId, inputUrl);
    } catch (error) {
      console.error('Error getting music title:', error);
      setMusicError('동영상을 찾지 못했어요. 다시 시도해주세요.');
      setMusicVideoId('');
      onMusicChange('', undefined);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">배경음악 설정</h3>
      </div>

      <div className="space-y-3">
        <Input
          type="text"
          value={youtubeUrl}
          onChange={(e) => handleYoutubeUrlChange(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="유튜브 동영상 URL을 입력하세요 (예: https://www.youtube.com/watch?v=...)"
        />

        {isLoadingMusic && (
          <div className="text-blue-600 text-sm">
            음악 정보를 불러오는 중...
          </div>
        )}

        {musicError && <div className="text-red-500 text-sm">{musicError}</div>}

        {/* 현재 설정된 음악 표시 */}
        {musicVideoId && (
          <div className="text-green-600 text-sm">
            ✓ 배경음악이 설정되었습니다 (Video ID: {musicVideoId})
          </div>
        )}
      </div>
    </div>
  );
}
