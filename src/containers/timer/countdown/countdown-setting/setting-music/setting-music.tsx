import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MusicIcon } from 'lucide-react';
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
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../../countdown-provider/countdown-provider.hooks';

export default function SettingMusic() {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const { isActive, isMusicUsed } = useCountdownState();
  const {
    music: { videoId, title },
  } = useCountdownMusicState();
  const { getYoutubeMusicURL, toggleMusicUsed } = useCountdownMusicAction();
  const form = useFormContext();

  console.log(previewIframeRef.current?.src);

  const togglePreviewPlay = (isToPlay: boolean) => {
    const postMessage = isToPlay ? 'playVideo' : 'stopVideo';
    previewIframeRef.current.contentWindow.postMessage(
      `{"event":"command","func":"${postMessage}"}`,
      '*',
    );

    setIsPlayingPreview(isToPlay);
  };

  useEffect(() => {
    if (isActive && isPlayingPreview) setIsPlayingPreview(false);
  }, []);

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

      <iframe
        ref={previewIframeRef}
        title="preview"
        className="hidden"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        src={
          videoId
            ? `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1`
            : undefined
        }
      />

      {title && (
        <div className="flex items-center justify-between gap-x-1 px-2 py-1.5 rounded-lg bg-muted">
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
            variant="primary-ghost"
            size="xs"
            disabled={isActive}
            onClick={() => togglePreviewPlay(!isPlayingPreview)}
          >
            {isPlayingPreview ? '정지' : '미리듣기'}
          </Button>
        </div>
      )}
    </Collapsible>
  );
}
