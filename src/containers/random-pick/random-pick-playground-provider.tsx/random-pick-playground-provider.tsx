/* eslint-disable no-continue */
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';
import { InnerPickListType } from '../random-pick-provider/random-pick-provider';

export type WinnersType = {
  id: string;
  value: string;
};

type RandomPickPlaygroundState = {
  students: InnerPickListType[];
  winners: WinnersType[];
  isRunning: boolean;
};
export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  runPick: (newNumberOfPick: number) => WinnersType[];
  resetPick: () => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    pickType,
    pickList,
    options: { isExcludingSelected },
  } = useRandomPickState();

  const [winners, setWinners] = useState<WinnersType[]>([]);
  const [tempWinners, setTempWinners] = useState<WinnersType[]>([]);

  const defaultRandomPickPlaygroundStateValue = {
    students: pickList[pickType],
    winners,
    isRunning: tempWinners.length > 0,
  };

  const updateWinner = (countNum: number) => {
    let count = countNum;
    const newWinners: WinnersType[] = [];

    while (count !== 0) {
      const n = Math.floor(Math.random() * pickList[pickType].length);
      const pickedStudent = pickList[pickType][n];

      const isIncluded = [
        ...newWinners.map((v) => v.id),
        ...(isExcludingSelected ? winners.map((v) => v.id) : []),
      ].includes(pickedStudent.id);

      if (!pickedStudent.isUsed) {
        continue;
      }

      if (isIncluded) {
        continue;
      }

      count -= 1;

      newWinners.push({
        id: pickedStudent.id,
        value: pickedStudent.value,
      });
    }

    return newWinners;
  };

  const defaultRandomPickPlaygroundActionValue = {
    runPick: (newNumberOfPick: number) => {
      const newWinners = updateWinner(newNumberOfPick);

      if (isExcludingSelected) {
        setWinners((prev) => [...prev, ...newWinners]);
        setTempWinners((prev) => [...prev, ...newWinners]);
      }
      return newWinners;
    },
    resetPick: () => {
      setWinners([]);
      setTempWinners([]);
    },
  };

  useEffect(() => {
    if (isExcludingSelected) {
      setWinners(tempWinners);
      return;
    }

    setWinners([]);
  }, [isExcludingSelected]);

  return (
    <RandomPickPlaygroundStateContext.Provider
      value={defaultRandomPickPlaygroundStateValue}
    >
      <RandomPickPlaygroundActionContext.Provider
        value={defaultRandomPickPlaygroundActionValue}
      >
        {children}
      </RandomPickPlaygroundActionContext.Provider>
    </RandomPickPlaygroundStateContext.Provider>
  );
}
