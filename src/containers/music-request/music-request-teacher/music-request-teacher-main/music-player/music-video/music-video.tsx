import YouTube from 'react-youtube';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import {
  MusicHandler,
  MusicOptionKeys,
  MusicOptions,
} from '../music-player.hooks';

const mediaTypeButtonVariants = cva(
  'px-4 h-8 rounded-3xl text-white font-normal',
  {
    variants: {
      selected: {
        true: 'bg-gray-400 dark:bg-gray-700',
        false: 'bg-gray-200 dark:bg-gray-800',
      },
    },
  },
);

type Props = {
  currentMusic: YoutubeVideo;
  musicOptions: MusicOptions;
  musicHandler: MusicHandler;
  updateMusicOption: <K extends MusicOptionKeys>(
    option: K,
    value: MusicOptions[K],
  ) => void;
};

export function MusicVideo({
  currentMusic,
  musicOptions,
  musicHandler,
  updateMusicOption,
}: Props) {
  if (!currentMusic) {
    return (
      <div className="h-full min-h-[200px] max-h-[500px] text-center text-sm text-gray-500 flex items-center justify-center">
        <div>
          <span>신청된 음악이 없어요.</span>
          <br />
          <span>방 정보에서 QR코드를 통해 학생을 초대해보세요.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="bg-gray-200 dark:bg-gray-800 w-fit h-8 my-0 mx-auto rounded-3xl">
        <button
          type="button"
          className={mediaTypeButtonVariants({
            selected: musicOptions.mediaType === 'video',
          })}
          onClick={() => updateMusicOption('mediaType', 'video')}
        >
          영상
        </button>
        <button
          type="button"
          className={mediaTypeButtonVariants({
            selected: musicOptions.mediaType === 'image',
          })}
          onClick={() => updateMusicOption('mediaType', 'image')}
        >
          이미지
        </button>
      </div>
      <div className="aspect-video relative max-w-[1230px] w-full">
        <YouTube
          className="aspect-video"
          iframeClassName="w-full h-full"
          onReady={musicHandler.handleMusicReady}
          onPlay={musicHandler.handleMusicPlay}
          onEnd={musicHandler.handleMusicEnd}
          onPause={musicHandler.handleMusicPause}
          videoId={currentMusic.musicId}
          opts={{
            playerVars: {
              autoplay: 1,
              loop: 0,
              controls: 0,
            },
          }}
        />

        {musicOptions.mediaType === 'image' ? (
          <Image
            className="absolute top-0 bottom-0 left-0 right-0 object-cover"
            src={`https://i.ytimg.com/vi/${currentMusic.musicId}/hqdefault.jpg`}
            alt={currentMusic.title}
            fill
          />
        ) : null}
      </div>
    </div>
  );
}
