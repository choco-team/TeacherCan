import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MusicIcon, Volume1Icon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Switch } from '@/components/switch';
import { SheetSubTitle } from '@/components/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible';
import { cn } from '@/styles/utils';
import { Label } from '@/components/label';
import YouTube from 'react-youtube';
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../../countdown-provider/countdown-provider.hooks';

export default function SettingMusic() {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previousVolumeValue, setPreviousVolumeValue] = useState(50);
  const { isActive, isMusicUsed, youtubePlayerRef } = useCountdownState();
  const {
    music: { videoId, title },
  } = useCountdownMusicState();
  const { getYoutubeMusicURL, toggleMusicUsed, controlVolume } =
    useCountdownMusicAction();
  const { previewYoutubePlayerRef, volumeValue } = useCountdownMusicState();
  const form = useFormContext();

  const togglePreviewPlay = (isToPlay: boolean) => {
    if (!previewYoutubePlayerRef.current) {
      return;
    }
    if (isToPlay) {
      previewYoutubePlayerRef.current.playVideo();
    } else {
      previewYoutubePlayerRef.current.pauseVideo();
    }
    setIsPlayingPreview(isToPlay);
  };

  const handeleVolumeChange = (volume: number) => {
    controlVolume(volume);
    if (previewYoutubePlayerRef) {
      previewYoutubePlayerRef.current.setVolume(volume);
    }
    youtubePlayerRef.current.setVolume(volume);
  };

  useEffect(() => {
    if (isActive && isPlayingPreview) setIsPlayingPreview(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <Collapsible open={isMusicUsed} className="space-y-4">
      <Label className="flex items-center justify-between gap-x-2">
        <SheetSubTitle>
          <MusicIcon />
          배경 음악
        </SheetSubTitle>

        <CollapsibleTrigger asChild>
          <Switch
            checked={isMusicUsed}
            data-state={isMusicUsed ? 'checked' : 'unchecked'}
            className="bg-inherit"
            onClick={toggleMusicUsed}
          />
        </CollapsibleTrigger>
      </Label>

      <CollapsibleContent className={cn('space-y-4')}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              getYoutubeMusicURL(form.getValues('youtubeUrl')),
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    유튜브 동영상 URL을 입력해주세요.
                  </FormDescription>
                  <div className="flex items-center gap-x-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=7uRX00jTSA0"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={isActive || !form.getValues('youtubeUrl')}
                      variant="primary-outline"
                    >
                      {isActive ? '타이머 실행 중···' : '가져오기'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CollapsibleContent>

      <YouTube
        className="hidden"
        onReady={(event: YT.PlayerEvent) => {
          previewYoutubePlayerRef.current = event.target;
          event.target.setVolume(volumeValue);
        }}
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 0,
            loop: 1,
          },
        }}
      />

      {title && (
        <div className="flex flex-col items-center justify-between gap-x-1 px-2 py-1.5 rounded-lg bg-muted">
          <div className="flex flex-row w-full items-center">
            <p
              className={cn(
                'text-sm line-clamp-1',
                isMusicUsed
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/50',
              )}
            >
              {title}
            </p>
            <Button
              className="w-12"
              variant="primary-ghost"
              size="xs"
              disabled={isActive}
              onClick={() => togglePreviewPlay(!isPlayingPreview)}
            >
              {isPlayingPreview ? '정지' : '미리듣기'}
            </Button>
          </div>
          <div className="flex flex-row w-full items-center">
            <button
              type="button"
              onClick={() => {
                handeleVolumeChange(previousVolumeValue);
              }}
            >
              {volumeValue === 0 && (
                <VolumeXIcon className="opacity-50 color-primary" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviousVolumeValue(volumeValue);
                handeleVolumeChange(0);
              }}
            >
              {volumeValue > 0 && volumeValue < 50 && <Volume1Icon />}
              {volumeValue >= 50 && <Volume2Icon />}
            </button>
            <Input
              type="range"
              value={volumeValue}
              onChange={(e) => {
                handeleVolumeChange(Number(e.target.value));
              }}
            />
          </div>
        </div>
      )}
    </Collapsible>
  );
}
