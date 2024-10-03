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
  const { isActive, isMusicUsed } = useCountdownState();
  const { musicTitle } = useCountdownMusicState();
  const { getYoutubeMusicURL, toggleMusicUsed } = useCountdownMusicAction();
  const form = useFormContext();

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
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=7uRX00jTSA0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isActive || !form.getValues('youtubeUrl')}
              variant="primary-outline"
            >
              {isActive ? '타이머 실행 중···' : '가져오기'}
            </Button>
          </form>
        </Form>
      </CollapsibleContent>

      {musicTitle && (
        <div
          className={cn(
            'px-3 py-2 rounded-lg bg-primary-50 text-sm',
            isMusicUsed ? 'text-primary' : 'text-primary/50',
          )}
        >
          {musicTitle}
        </div>
      )}
    </Collapsible>
  );
}
