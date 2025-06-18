/* eslint-disable no-continue */
import { createContext, PropsWithChildren, useState } from 'react';
import { creatId } from '@/utils/createNanoid';
import {
  InnerPickListType,
  OptionsType,
  PickType,
  RandomPickType,
} from '../random-pick-type';

type RandomPickPlaygroundState = {
  randomPickList: RandomPickType[];
  randomPick: RandomPickType;
  newWinners: { id: string; value: string }[];
};
export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  runPick: (newNumberOfPick: number) => void;
  resetPick: () => void;
  updateOption: (option: Partial<OptionsType>) => void;
  createRandomPick: (
    pickType: PickType,
    newPickList: InnerPickListType[],
  ) => void;
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
  const [newWinners, setNewWinners] = useState<{ id: string; value: string }[]>(
    [],
  );

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

  const createRandomPick = (
    pickType: PickType,
    newPickList: InnerPickListType[],
  ) => {
    setRandomPickList((prev) => [
      ...prev,
      {
        id: creatId(),
        createdAt: new Date().toISOString(),
        title: '새로운 랜덤뽑기',
        pickType,
        pickList: newPickList,
        options: {
          isExcludingSelected: true,
          isHideResult: true,
          isMixingAnimation: true,
        },
      },
    ]);
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
    const newPickedList: { id: string; value: string }[] = [];
    const existingPickedId = pickList
      .filter((item) => item.isPicked)
      .map((v) => v.id);

    while (count !== 0) {
      const n = Math.floor(Math.random() * pickList.length);
      const pickedStudent = pickList[n];

      const isIncluded = [
        ...newPickedList.map((v) => v.id),
        ...(isExcludingSelected ? existingPickedId : []),
      ].includes(pickedStudent.id);

      if (isIncluded) {
        continue;
      }

      count -= 1;

      newPickedList.push({
        id: pickedStudent.id,
        value: pickedStudent.value,
      });
    }

    setNewWinners(newPickedList);
    setRandomPickList((prev) => {
      const newRandomPickList = [...prev];
      newRandomPickList[randomPickList.findIndex((item) => item.id === id)] = {
        ...randomPick,
        pickList: randomPick.pickList.map((item) => ({
          ...item,
          isPicked: [
            ...existingPickedId,
            ...newPickedList.map((v) => v.id),
          ].includes(item.id),
        })),
      };

      return newRandomPickList;
    });
  };

  const resetWinner = () => {
    setRandomPickList((prev) => {
      const newRandomPickList = [...prev];
      newRandomPickList[randomPickList.findIndex((item) => item.id === id)] = {
        ...randomPick,
        pickList: randomPick.pickList.map((item) => ({
          ...item,
          isPicked: false,
        })),
      };

      return newRandomPickList;
    });
  };

  return (
    <RandomPickPlaygroundStateContext.Provider
      value={{
        randomPickList,
        randomPick,
        newWinners,
      }}
    >
      <RandomPickPlaygroundActionContext.Provider
        value={{
          runPick: (newNumberOfPick: number) => {
            updateWinner(newNumberOfPick);
          },
          resetPick: () => {
            resetWinner();
          },
          updateOption,
          createRandomPick,
        }}
      >
        {children}
      </RandomPickPlaygroundActionContext.Provider>
    </RandomPickPlaygroundStateContext.Provider>
  );
}
