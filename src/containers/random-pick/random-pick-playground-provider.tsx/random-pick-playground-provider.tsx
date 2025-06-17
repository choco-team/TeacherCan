/* eslint-disable no-continue */
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { OptionsType, RandomPickType } from '../random-pick-type';

export type WinnersType = {
  id: string;
  value: string;
};

type RandomPickPlaygroundState = {
  randomPick: RandomPickType;
  winners: WinnersType[];
};
export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  runPick: (newNumberOfPick: number) => WinnersType[];
  resetPick: () => void;
  updateOption: (option: Partial<OptionsType>) => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  id,
  randomPickList,
  setRandomPickList,
  children,
}: PropsWithChildren<{
  id: string;
  randomPickList: RandomPickType[];
  setRandomPickList: (
    value: RandomPickType[] | ((val: RandomPickType[]) => RandomPickType[]),
  ) => void;
}>) {
  const randomPick = randomPickList.find((item) => item.id === id) ?? {
    id: ' ',
    createdAt: '',
    title: '새로운 랜덤뽑기',
    pickType: 'numbers',
    pickList: [],
    options: {
      isExcludingSelected: false,
      isHideResult: false,
      isMixingAnimation: false,
    },
  };
  const {
    pickList,
    options: { isExcludingSelected },
  } = randomPick;

  const [winners, setWinners] = useState<WinnersType[]>([]);
  const [tempWinners, setTempWinners] = useState<WinnersType[]>([]);

  const defaultRandomPickPlaygroundStateValue = {
    randomPick,
    winners,
  };

  const updateOption = (option: Partial<OptionsType>) => {
    setRandomPickList((prev) => {
      const newRandomPickList = [...prev];
      newRandomPickList[randomPickList.findIndex((item) => item.id === id)] = {
        ...randomPick,
        options: {
          ...randomPick.options,
          ...option,
        },
      };

      return newRandomPickList;
    });
  };

  const updateWinner = (countNum: number) => {
    let count = countNum;
    const newWinners: WinnersType[] = [];

    while (count !== 0) {
      const n = Math.floor(Math.random() * pickList.length);
      const pickedStudent = pickList[n];

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
      }

      setTempWinners((prev) => [...prev, ...newWinners]);
      return newWinners;
    },
    resetPick: () => {
      setWinners([]);
      setTempWinners([]);
    },
    updateOption,
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
