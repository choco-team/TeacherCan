import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/input';
import { youtubeSearch } from '@/utils/api/youtubeAPI';
import VideoCard from './video-card/video-card';
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';

type Props = {
  isOpenMusicSearch: boolean;
  toggleMusicSearchOpen: (open: boolean) => void;
};

const YOUTUBE_SEARCH_ERROR_MESSAGE = {
  EMPTY_INPUT: '검색어를 입력해 주세요.',
  API_ERROR: '검색을 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  q: z.string().nonempty({ message: YOUTUBE_SEARCH_ERROR_MESSAGE.EMPTY_INPUT }),
});

export default function MusicSearchModal({
  isOpenMusicSearch,
  toggleMusicSearchOpen,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean | null>();
  const { videos } = useCountdownMusicState();
  const { controlVideos } = useCountdownMusicAction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
    reValidateMode: 'onSubmit',
  });

  const onOpenChange = (open: boolean) => {
    toggleMusicSearchOpen(open);
  };

  const handleSearch = async (q: string) => {
    try {
      setIsLoading(true);
      controlVideos(await youtubeSearch(q));
    } catch (error) {
      form.setError('q', {
        message: YOUTUBE_SEARCH_ERROR_MESSAGE.API_ERROR,
      });
      throw Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenMusicSearch} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%] h-[80%] flex flex-col items-center overflow-auto transition-none">
        <div className="flex flex-row w-full">
          <DialogTitle className="self-start mr-4">배경음악</DialogTitle>
          <DialogDescription>
            원하는 배경음악을 검색해 보세요.
          </DialogDescription>
        </div>
        <div className="flex flex-col h-full w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                handleSearch(form.getValues('q')),
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="q"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="검색어를 입력해주세요."
                        />
                      </FormControl>
                      <Button type="submit" variant="primary-outline">
                        {isLoading ? '로딩중...' : '검색'}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <ul className="grid grid-cols-3 gap-4 mt-4">
            {videos && videos.map((video) => <VideoCard video={video} />)}
          </ul>
        </div>

        <DialogFooter>
          {/* <Button
              size="lg"
              className="p-10 rounded-2xl text-3xl hover:scale-105 active:scale-95"
              // onClick={}
            >
              모두 뒤집기
            </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
