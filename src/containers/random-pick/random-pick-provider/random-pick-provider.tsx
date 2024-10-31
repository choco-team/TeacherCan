import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  INIT_STUDENT_NAMES,
  INIT_STUDENT_NUMBERS,
  PICK_TYPES,
  PLACE_SELECTED_STUDENT_TYPES,
} from './random-pick-provider.constants';

export type PlaceSelectedStudentType =
  (typeof PLACE_SELECTED_STUDENT_TYPES)[number]['type'];

type InnerPickListType = {
  value: string;
  isPicked: boolean;
  isUsed: boolean;
};

type PickType = (typeof PICK_TYPES)[number]['type'];
type PickListType = Record<PickType, InnerPickListType[]>;
type OptionsType = {
  isHideResult: boolean;
  isExcludingSelected: boolean;
  placeSelectedStudent: PlaceSelectedStudentType;
};

type RandomPickState = {
  pickType: PickType;
  pickList: PickListType;
  options: OptionsType;
};

export const RandomPickStateContext = createContext<RandomPickState | null>(
  null,
);

type RandomPickAction = {
  selectPickType: Dispatch<SetStateAction<PickType>>;
  modifyPickList: (
    pickType: PickType,
    modifiedPickList: InnerPickListType[],
  ) => void;
  changeOption: (
    changedOption: (prev: OptionsType) => Partial<OptionsType>,
  ) => void;
};

export const RandomPickActionContext = createContext<RandomPickAction | null>(
  null,
);

export default function RandomPickProvider({
  children,
}: PropsWithChildren<{}>) {
  const [names, setNames] = useLocalStorage(
    'random-pick-names',
    INIT_STUDENT_NAMES,
  );
  const [numbers, setNumbers] = useLocalStorage(
    'random-pick-numbers',
    INIT_STUDENT_NUMBERS,
  );

  const [options, setOptions] = useState<OptionsType>({
    isHideResult: true,
    isExcludingSelected: true,
    placeSelectedStudent: 'none',
  });
  const [pickType, setPickType] = useState<PickType>('numbers');

  const defaultRandomPickStateValue = {
    pickType,
    pickList: {
      names,
      numbers,
    },
    options,
  };

  const defaultRandomPickActionValue = {
    selectPickType: setPickType,
    modifyPickList: (
      incomingPickType: PickType,
      modifiedPickList: InnerPickListType[],
    ) => {
      if (incomingPickType === 'names') {
        setNames(modifiedPickList);
      }
      if (incomingPickType === 'numbers') {
        setNumbers(modifiedPickList);
      }
    },
    changeOption: (
      changedOption: (prev: OptionsType) => Partial<OptionsType>,
    ) =>
      setOptions((prev) => ({
        ...prev,
        ...changedOption(prev),
      })),
  };

  return (
    <RandomPickStateContext.Provider value={defaultRandomPickStateValue}>
      <RandomPickActionContext.Provider value={defaultRandomPickActionValue}>
        {children}
      </RandomPickActionContext.Provider>
    </RandomPickStateContext.Provider>
  );
}
