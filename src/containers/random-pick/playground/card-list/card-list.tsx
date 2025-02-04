import { useEffect, useRef, useState } from 'react';
import { useRandomPickState } from '../../random-pick-provider/random-pick-provider.hooks';
import Card from '../card/card';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  isMixingCards: boolean;
};

const INTERVAL_TIME = {
  INITIAL: 50,
  MAX: 5000,
};

export default function CardList({ isMixingCards }: Props) {
  const cardMixRef = useRef<NodeJS.Timeout | null>(null);

  const { pickList, pickType } = useRandomPickState();
  const { winners } = useRandomPickPlaygroundState();
  const winnerIds = winners.map((winner) => winner.id);

  const [students, setStudents] = useState(pickList[pickType]);
  const [intervalTime, setIntervalTime] = useState(INTERVAL_TIME.INITIAL);

  useEffect(() => {
    if (isMixingCards) {
      cardMixRef.current = setInterval(() => {
        setStudents((prev) => [...prev].sort(() => Math.random() - 0.5));
        setIntervalTime((prev) => Math.min(prev * 20, INTERVAL_TIME.MAX));
      }, intervalTime);
    } else {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    }
    return () => {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    };
  }, [isMixingCards, intervalTime]);

  useEffect(() => {
    setStudents(pickList[pickType]);
  }, [pickList[pickType]]);

  return (
    <div className="flex-grow grid gap-2 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 content-start">
      {(isMixingCards ? students : pickList[pickType]).map(({ id, value }) => (
        <Card
          key={id}
          title={value}
          isWinner={winnerIds.includes(id)}
          isMixingCards={isMixingCards}
        />
      ))}
    </div>
  );
}
