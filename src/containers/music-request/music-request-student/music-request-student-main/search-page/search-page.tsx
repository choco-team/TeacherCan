'use client';

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
import { useMusicRequestStudentState } from '../../music-request-student-provider/music-request-student-provider.hooks';

const YOUTUBE_SEARCH_ERROR_MESSAGE = {
  EMPTY_INPUT: '검색어를 입력해 주세요.',
  API_ERROR: '검색을 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  q: z.string().nonempty({ message: YOUTUBE_SEARCH_ERROR_MESSAGE.EMPTY_INPUT }),
});

type Video = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: string;
  channelTitle: string;
};

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SearchPage() {
  const [videos, setVidoes] = useState<Video[]>();
  const [isLoading, setIsLoading] = useState<boolean | null>();
  const { roomId } = useMusicRequestStudentState();

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
      const response = await fetch(`${originURL}/api/youtube/search?q=${q}`);
      const json = await response.json();
      setVidoes(json);
    } catch (error) {
      form.setError('q', {
        message: YOUTUBE_SEARCH_ERROR_MESSAGE.API_ERROR,
      });
      throw Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const requestMusic = async (data) => {
    try {
      await fetch(`${originURL}/api/firebase/music-request/musics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw Error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full pt-8">
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
          videos.map((video) => {
            return (
              <li key={video.videoId}>
                <div className="flex flex-row m-8 ">
                  <iframe
                    width="200"
                    height="150"
                    src={`https://www.youtube.com/embed/${video.videoId}?si=unMcQ-lsDcxcqWph`}
                    title={video.videoId}
                  />
                  <div className="flex flex-col">
                    <p>{video.title}</p>
                    <p>{video.channelTitle}</p>
                    <p>{video.description}</p>
                    <p>{video.publishedAt}</p>
                  </div>
                  <Button
                    variant="primary-outline"
                    onClick={() => {
                      requestMusic({ ...video, roomId });
                    }}
                  >
                    신청하기
                  </Button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
