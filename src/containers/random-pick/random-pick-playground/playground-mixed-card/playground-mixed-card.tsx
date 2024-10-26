import { useEffect } from 'react';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import Card from '../playground-card/playground-card';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';

export default function MixedCard() {
  const { pickList, pickType } = useRandomPickState();
  const { temporaryPickList } = useRandomPickPlaygroundState();
  const { mixTemporaryPickList } = useRandomPickPlaygroundAction();

  useEffect(() => {
    const newTemporaryPickList = pickList[pickType].map((e) => e.value);
    console.log('asd');
    const mixPickListInterval = setInterval(() => {
      mixTemporaryPickList(newTemporaryPickList);
    }, 100);
    return () => clearInterval(mixPickListInterval);
  }, [mixTemporaryPickList]);

  return (
    <>
      {temporaryPickList.map((value) => (
        <Card key={value} title={value} />
      ))}
    </>
  );
}
