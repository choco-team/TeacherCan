import { useState } from 'react';
import { Input } from '@/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { youtubeSearch } from '@/utils/api/youtubeAPI';
import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../../music-request-student-provider/music-request-student-provider.hooks';
import VideoCard from './video-card/video-card';

const YOUTUBE_SEARCH_ERROR_MESSAGE = {
  EMPTY_INPUT: '검색어를 입력해 주세요.',
  API_ERROR: '검색을 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  q: z.string().nonempty({ message: YOUTUBE_SEARCH_ERROR_MESSAGE.EMPTY_INPUT }),
});

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState<boolean | null>();
  const { roomId, studentName, videos } = useMusicRequestStudentState();
  const { settingVideos } = useMusicRequestStudentAction();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleSearch = async (q: string) => {
    try {
      setIsLoading(true);
      settingVideos(await youtubeSearch(q));
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
    <div className="flex flex-col justify-center h-full pr-4 pl-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => handleSearch(form.getValues('q')))}
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
                      placeholder="유튜브 검색어를 입력해주세요."
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
      <ul>
        {videos &&
          videos.map((video) => (
            <VideoCard
              video={video}
              roomId={roomId}
              studentName={studentName}
            />
          ))}
      </ul>
    </div>
  );
}
