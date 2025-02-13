import { Button } from '@/components/button';
import { deleteMusic } from '@/utils/api/firebaseAPI';
import { getMusicExtraData } from '@/utils/api/youtubeAPI';
import { ChevronsDown, ChevronsUp, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../../../music-request-teacher-provider/music-request-teacher-provider.hooks';

interface MusicCardProps {
  video: any;
  roomId: string;
}

type ExtraData = {
  publishedAt: string;
  channelTitle: string;
  thumbnails: string;
  channelThumbnails: string;
  description: string;
};

export default function MusicCard({ video, roomId }: MusicCardProps) {
  const [extraData, setExtraData] = useState<ExtraData>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const { videos } = useMusicRequestTeacherState();
  const { settingCurrentMusicIdx } = useMusicRequestTeacherAction();

  const handleDeleteMusic = async (videoId: string) => {
    try {
      deleteMusic(roomId, videoId);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const handleExtraData = async (videoId: string) => {
    try {
      if (isOpen) {
        setIsOpen(false);
        setIsVideo(false);
      } else {
        if (extraData) {
          setExtraData(extraData);
        } else {
          setExtraData(await getMusicExtraData(videoId));
        }
        setIsOpen(true);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const handlePlayButton = () => {
    settingCurrentMusicIdx(
      videos.findIndex((item) => item.videoId === video.videoId),
    );
  };

  return (
    <div className="flex flex-col m-4 p-2 rounded-lg	 bg-primary-200">
      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <p className="font-semibold">{video.title}</p>
          {isOpen && extraData && (
            <div className="bg-white rounded pr-2 pl-2 pb-2 mb-2 mt-2">
              <div className="flex flex-row p-1">
                <Image
                  className="w-7 rounded-full mr-2"
                  src={extraData.channelThumbnails}
                  alt=""
                  width={28}
                  height={28}
                />
                <div className="flex flex-col">
                  <p className="text-s">
                    {extraData.channelTitle} &middot; {extraData.publishedAt}
                  </p>
                </div>
              </div>
              <div className="flex flex-row">
                <div className=" w-3/5 mr-2">
                  {!isVideo && (
                    <Image
                      onClick={() => setIsVideo(true)}
                      className="w-full rounded-lg cursor-pointer"
                      src={extraData.thumbnails}
                      alt=""
                      width={28}
                      height={28}
                    />
                  )}
                  {isVideo && (
                    <iframe
                      className="w-full rounded-lg"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.videoId}
                    />
                  )}
                </div>
                <div className="w-2/5 h-48 text-xs overflow-x-auto overflow-x-hidden">
                  {extraData.description}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-row justify-between ">
            <p className="text-xs text-gray-600 pr-2">
              신청: {video.proposer} / 재생횟수 : {video.playCount}
            </p>
            <Button size="xs" onClick={() => handlePlayButton()}>
              재생하기
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-between ">
          <button
            type="button"
            onClick={() => handleDeleteMusic(video.videoId)}
          >
            <X />
          </button>
          <button type="button" onClick={() => handleExtraData(video.videoId)}>
            {!isOpen && <ChevronsDown />}
            {isOpen && <ChevronsUp />}
          </button>
        </div>
      </div>
    </div>
  );
}
