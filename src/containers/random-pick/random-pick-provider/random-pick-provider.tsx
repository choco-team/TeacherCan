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
  SORT_SELECTED_STUDENT_TYPES,
} from './random-pick-provider.constants';

type SortSelectedStudentType =
  (typeof SORT_SELECTED_STUDENT_TYPES)[number]['type'];

type InnerPickListType = {
  value: string;
  isPicked: boolean;
};

type PickType = (typeof PICK_TYPES)[number]['type'];
type PickListType = Record<PickType, InnerPickListType[]>;
type OptionsType = {
  isHideResult: boolean;
  isExcludingSelected: boolean;
  sortSelectedStudent: SortSelectedStudentType;
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
  modifyPickList: (pickType: PickType, modifiedPickList: string[]) => void;
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
    sortSelectedStudent: 'none',
  });
  const [pickType, setPickType] = useState<PickType>('numbers');

  const defaultRandomPickStateValue = {
    pickType,
    pickList: {
      names: names.map((name) => ({ value: name, isPicked: false })),
      numbers: numbers.map((number) => ({ value: number, isPicked: false })),
    },
    options,
  };

  const defaultRandomPickActionValue = {
    selectPickType: setPickType,
    modifyPickList: (
      incomingPickType: PickType,
      modifiedPickList: string[],
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
