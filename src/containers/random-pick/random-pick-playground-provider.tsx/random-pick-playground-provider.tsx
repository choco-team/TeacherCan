/* eslint-disable no-continue */
import { createContext, PropsWithChildren, useState } from 'react';
import { creatId } from '@/utils/createNanoid';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  InnerPickListType,
  OptionsType,
  PickType,
  RandomPickType,
} from '../random-pick-type';
import { MAX_RANDOM_PICK_STUDENTS } from '../random-pick-constants';

type RandomPickPlaygroundState = {
  randomPickList: RandomPickType[] | null;
  randomPick: RandomPickType | null;
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
  updateTitle: (title: string) => void;
  removeRandomPick: (selectedRows: string[]) => void;
  addStudent: (name: string) => void;
  removeStudent: (studentId: string) => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  id,
  children,
}: PropsWithChildren<{
  id: string;
}>) {
  const [randomPickList, setRandomPickList] = useLocalStorage<
    RandomPickType[] | null
  >('random-pick-list', []);

  const [newWinners, setNewWinners] = useState<{ id: string; value: string }[]>(
    [],
  );

  const randomPick = randomPickList?.find((item) => item.id === id) || null;

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
    if (!randomPick) {
      return;
    }

    let count = countNum;
    const newPickedList: { id: string; value: string }[] = [];
    const existingPickedId = randomPick?.pickList
      .filter((item) => item.isPicked)
      .map((v) => v.id);

    while (count !== 0) {
      const n = Math.floor(Math.random() * randomPick.pickList.length);
      const pickedStudent = randomPick?.pickList[n];

      const isIncluded = [
        ...newPickedList.map((v) => v.id),
        ...(randomPick.options.isExcludingSelected ? existingPickedId : []),
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

  const updateTitle = (title: string) => {
    setRandomPickList((prev) => {
      const newRandomPickList = [...prev];
      newRandomPickList[randomPickList.findIndex((item) => item.id === id)] = {
        ...randomPick,
        title,
      };

      return newRandomPickList;
    });
  };

  const removeRandomPick = (selectedRows: string[]) => {
    setRandomPickList((prev) => {
      const newRandomPickList = [...prev].filter(
        (item) => !selectedRows.includes(item.id),
      );

      return newRandomPickList;
    });
  };

  const addStudent = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    setRandomPickList((prev) => {
      if (!prev) {
        return prev;
      }

      const targetIndex = prev.findIndex((item) => item.id === id);
      if (targetIndex === -1) {
        return prev;
      }

      const targetPick = prev[targetIndex];
      const isDuplicate = targetPick.pickList.some(
        (item) => item.value === trimmedName,
      );
      if (
        isDuplicate ||
        targetPick.pickList.length >= MAX_RANDOM_PICK_STUDENTS
      ) {
        return prev;
      }

      const nextPickList: InnerPickListType[] = [
        ...targetPick.pickList,
        {
          id: creatId(),
          value: trimmedName,
          isPicked: false,
          isUsed: true,
        },
      ];

      const nextRandomPickList = [...prev];
      nextRandomPickList[targetIndex] = {
        ...targetPick,
        pickList: nextPickList,
      };

      return nextRandomPickList;
    });
  };

  const removeStudent = (studentId: string) => {
    setRandomPickList((prev) => {
      if (!prev) {
        return prev;
      }

      const targetIndex = prev.findIndex((item) => item.id === id);
      if (targetIndex === -1) {
        return prev;
      }

      const targetPick = prev[targetIndex];
      const targetStudent = targetPick.pickList.find(
        (item) => item.id === studentId,
      );
      if (!targetStudent || targetStudent.isPicked) {
        return prev;
      }

      const nextPickList = targetPick.pickList.filter(
        (item) => item.id !== studentId,
      );

      const nextRandomPickList = [...prev];
      nextRandomPickList[targetIndex] = {
        ...targetPick,
        pickList: nextPickList,
      };

      return nextRandomPickList;
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
          updateTitle,
          removeRandomPick,
          addStudent,
          removeStudent,
        }}
      >
        {children}
      </RandomPickPlaygroundActionContext.Provider>
    </RandomPickPlaygroundStateContext.Provider>
  );
}
