import { useEffect } from 'react';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import Card from '../playground-card/playground-card';

export default function MixedCard() {
  const { temporaryPickList } = useRandomPickPlaygroundState();
  const { mixTemporaryPickList } = useRandomPickPlaygroundAction();

  useEffect(() => {
    const mixPickListInterval = mixTemporaryPickList();
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
