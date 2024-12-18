import { deleteMusic } from '@/utils/api/firebaseAPI';
import { getMusicExtraData } from '@/utils/api/youtubeAPI';
import { ChevronsDown, ChevronsUp, X } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <div className="flex flex-col m-4 p-2 rounded-lg	 bg-primary-200">
      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <p className="font-semibold">{video.title}</p>
          {isOpen && (
            <div className="bg-white rounded pr-2 pl-2 pb-2 mb-2 mt-2">
              <div className="flex flex-row p-1">
                <img
                  className="w-7 rounded-full mr-2"
                  src={extraData.channelThumbnails}
                  alt=""
                />
                <div className="flex flex-col">
                  <p className="text-s">
                    {extraData.channelTitle} &middot; {extraData.publishedAt}
                  </p>
                </div>
              </div>
              <div className="flex flex-row">
                <div className=" w-3/5 mr-2">
                  <img
                    className="w-full rounded-lg"
                    src={extraData.thumbnails}
                    alt=""
                  />
                </div>
                <div className="w-2/5 h-48 text-xs overflow-x-auto overflow-x-hidden">
                  {extraData.description}
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-600	text-right pr-2">
            {video.proposer}
          </p>
        </div>
        <div className="flex flex-col justify-between ">
          <button type="button" onClick={() => handleDeleteMusic(video.id)}>
            <X />
          </button>
          <button type="button" onClick={() => handleExtraData(video.id)}>
            {!isOpen && <ChevronsDown />}
            {isOpen && <ChevronsUp />}
          </button>
        </div>
      </div>
    </div>
  );
}
