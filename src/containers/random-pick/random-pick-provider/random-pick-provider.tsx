import { createContext, PropsWithChildren } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { creatId } from '@/utils/createNanoid';
import { PICK_TYPES } from './random-pick-provider.constants';

export type RandomPickType = {
  id: string;
  createdAt: string;
  title: string;
  pickType: PickType;
  pickList: InnerPickListType[];
  options: OptionsType;
};

export type InnerPickListType = {
  id: string;
  value: string;
  isPicked: boolean;
  isUsed: boolean;
};

export type PickType = (typeof PICK_TYPES)[number]['type'];
type OptionsType = {
  isExcludingSelected: boolean;
  isHideResult: boolean;
  isMixingAnimation: boolean;
};

type RandomPickState = {
  randomPickList: RandomPickType[];
};

export const RandomPickStateContext = createContext<RandomPickState | null>(
  null,
);

type RandomPickAction = {
  modifyPickList: (
    pickType: PickType,
    modifiedPickList: InnerPickListType[],
  ) => void;
};

export const RandomPickActionContext = createContext<RandomPickAction | null>(
  null,
);

export default function RandomPickProvider({
  children,
}: PropsWithChildren<{}>) {
  const [randomPickList, setRandomPickList] = useLocalStorage<RandomPickType[]>(
    'random-pick-list',
    [],
  );

  const defaultRandomPickStateValue = {
    randomPickList,
  };

  const defaultRandomPickActionValue = {
    modifyPickList: (
      incomingPickType: PickType,
      modifiedPickList: InnerPickListType[],
    ) => {
      setRandomPickList((prev) => [
        {
          id: creatId(),
          createdAt: new Date().toISOString(),
          title: '새로운 랜덤뽑기',
          pickType: incomingPickType,
          pickList: modifiedPickList,
          options: {
            isExcludingSelected: true,
            isHideResult: true,
            isMixingAnimation: true,
          },
        },
        ...prev,
      ]);
    },
  };

  return (
    <RandomPickStateContext.Provider value={defaultRandomPickStateValue}>
      <RandomPickActionContext.Provider value={defaultRandomPickActionValue}>
        {children}
      </RandomPickActionContext.Provider>
    </RandomPickStateContext.Provider>
  );
}
