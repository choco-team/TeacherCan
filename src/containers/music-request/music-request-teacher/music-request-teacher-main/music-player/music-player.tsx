import { Button } from '@/components/button';
import { useState } from 'react';

export default function MusicPlayer() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex border-b border-gray-300">
        <Button
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === 'tab1'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('tab1')}
        >
          영상 X
        </Button>
        <Button
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === 'tab2'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('tab2')}
        >
          영상 O
        </Button>
      </div>

      <div className="p-4">
        {activeTab === 'tab1' && <div>영상 없이 음악 플레이어만 만들기</div>}
        {activeTab === 'tab2' && <div>유투브 영상 그대로 보여주기</div>}
      </div>
    </div>
  );
}
