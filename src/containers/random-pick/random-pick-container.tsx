'use client';

import { useState } from 'react';
import RandomPickSetting from './random-pick-setting/random-pick-setting';
import RandomPickProvider from './random-pick-provider/random-pick-provider';
import PlayGround from './playground/playground';
import RandomPickPlaygroundProvider from './random-pick-playground-provider.tsx/random-pick-playground-provider';

export default function RandomPickContainer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const startPlay = () => {
    setIsPlaying(true);
  };

  const makeNewPlay = () => {
    setIsPlaying(false);
  };

  return (
    <RandomPickProvider>
      <RandomPickPlaygroundProvider>
        {isPlaying ? (
          <PlayGround makeNewPlay={makeNewPlay} />
        ) : (
          <RandomPickSetting startPlay={startPlay} />
        )}
      </RandomPickPlaygroundProvider>
    </RandomPickProvider>
  );
}
