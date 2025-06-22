'use client';

import { useParams } from 'next/navigation';
import PlayGround from './playground/playground';
import RandomPickList from './random-pick-list/random-pick-list';
import RandomPickPlaygroundProvider from './random-pick-playground-provider.tsx/random-pick-playground-provider';

export default function RandomPickContainer() {
  const { id } = useParams<{ id?: string }>();
  const isPlaying = !!id;

  return (
    <RandomPickPlaygroundProvider id={id}>
      {isPlaying ? <PlayGround /> : <RandomPickList />}
    </RandomPickPlaygroundProvider>
  );
}
