'use client';

import { useParams } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import PlayGround from './playground/playground';
import RandomPickList from './random-pick-list/random-pick-list';
import RandomPickPlaygroundProvider from './random-pick-playground-provider.tsx/random-pick-playground-provider';
import { RandomPickType } from './random-pick-type';

export default function RandomPickContainer() {
  const { id } = useParams<{ id?: string }>();
  const isPlaying = !!id;
  const [randomPickList, setRandomPickList] = useLocalStorage<RandomPickType[]>(
    'random-pick-list',
    [],
  );

  return isPlaying ? (
    <RandomPickPlaygroundProvider
      id={id}
      randomPickList={randomPickList ?? []}
      setRandomPickList={setRandomPickList}
    >
      <PlayGround />
    </RandomPickPlaygroundProvider>
  ) : (
    <RandomPickList
      randomPickList={randomPickList ?? []}
      setRandomPickList={setRandomPickList}
    />
  );
}
