import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';
import { MODAL_STATE_TYPES } from './random-pick-playground-provider.constans';

type ModalStateType =
  (typeof MODAL_STATE_TYPES)[keyof typeof MODAL_STATE_TYPES];

export type WinnersType = {
  pickListId: string;
  pickListValue: string;
  isflipped: boolean;
};

type RandomPickPlaygroundState = {
  numberOfPick: number;
  winners: WinnersType[];
  temporaryPickList: string[];
  modalState: ModalStateType;
  maxNumberOfPick: number;
  forceRender: number;
};
export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  selectModalState: Dispatch<SetStateAction<ModalStateType>>;
  runPick: (newNumberOfPick?: number) => void;
  resetPick: () => void;
  handleCardFlip: (pickListId: string) => void;
  handleCardUsed: (pickListId: string) => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  children,
}: PropsWithChildren<{}>) {
  const [numberOfPick, setNumberOfPick] = useState(1);
  const [winners, setWinners] = useState<WinnersType[]>([]);
  const [forceRender, setForceRender] = useState(1);
  const [temporaryPickList, setTemporaryPickList] = useState([]);

  const [modalState, setModalState] = useState<ModalStateType>(
    MODAL_STATE_TYPES.noModal,
  );
  const numberOfExcept = useRef(0);
  const cardMixRef = useRef<NodeJS.Timeout | null>(null);

  const {
    pickType,
    pickList,
    options: { isExcludingSelected },
  } = useRandomPickState();

  useEffect(() => {
    setTemporaryPickList(pickList[pickType].map((e) => e.value));
  }, [pickList, pickType]);

  useEffect(() => {
    if (modalState === MODAL_STATE_TYPES.setPickNumberModal) {
      cardMixRef.current = setInterval(() => {
        setTemporaryPickList((prev) =>
          [...prev].sort(() => Math.random() - 0.5),
        );
      }, 100);
    } else {
      clearInterval(cardMixRef.current);
    }
    return () => clearInterval(cardMixRef.current);
  }, [modalState]);

  const defaultRandomPickPlaygroundStateValue = {
    numberOfPick,
    winners,
    temporaryPickList,
    modalState,
    forceRender,
    maxNumberOfPick: isExcludingSelected
      ? pickList[pickType].length - numberOfExcept.current
      : pickList[pickType].length,
  };

  const excludingSelectedPick = useCallback(
    (countNum: number) => {
      let count = countNum;
      const newWinners = [];
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickList[pickType].length);
        const pickedStudent = pickList[pickType][n];
        if (pickedStudent.isUsed && !pickedStudent.isPicked) {
          pickedStudent.isPicked = true;
          newWinners.push({
            pickListId: pickedStudent.id,
            pickListValue: pickedStudent.value,
            isflipped: false,
          });
          count -= 1;
          numberOfExcept.current += 1;
        }
      }
      return newWinners;
    },
    [pickList, pickType, numberOfExcept],
  );

  const includingSelectedPick = useCallback(
    (countNum: number) => {
      let count = countNum;
      const newWinners: WinnersType[] = [];
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickList[pickType].length);

        const pickedStudent = pickList[pickType][n];
        const isIncluded = newWinners.map((v) => v.pickListId);

        if (!isIncluded.includes(pickedStudent.id)) {
          if (!pickList[pickType][n].isPicked) {
            numberOfExcept.current += 1;
          }

          newWinners.push({
            pickListId: pickedStudent.id,
            pickListValue: pickedStudent.value,
            isflipped: false,
          });
          count -= 1;
        }
      }
      return newWinners;
    },
    [pickList, pickType, numberOfExcept],
  );

  const defaultRandomPickPlaygroundActionValue = {
    selectModalState: setModalState,
    runPick: (newNumberOfPick?: number) => {
      // 당첨 개수, 모달 설정
      let countNum = numberOfPick;
      if (newNumberOfPick) {
        setNumberOfPick(newNumberOfPick);
        setModalState(MODAL_STATE_TYPES.resultModal);
        countNum = newNumberOfPick;
      }
      // '뽑힌학생 제외' 옵션에 따라 뽑기 실행
      setWinners(
        isExcludingSelected
          ? excludingSelectedPick(countNum)
          : includingSelectedPick(countNum),
      );
    },
    resetPick: () => {
      pickList.names = pickList.names.map((name) => ({
        ...name,
        isPicked: false,
        isUsed: false,
      }));
      pickList.numbers = pickList.numbers.map((number) => ({
        ...number,
        isPicked: false,
        isUsed: false,
      }));
      numberOfExcept.current = 0;
      // pickList가 state가 아니라서 강제로 리렌더링시킴
      setForceRender((prev) => prev * -1);
    },
    handleCardFlip: (pickListId: string) => {
      setWinners((prevWinners) =>
        prevWinners.map((winner) =>
          winner.pickListId === pickListId
            ? { ...winner, isflipped: !winner.isflipped }
            : winner,
        ),
      );
    },
    handleCardUsed: (pickListId: string) => {
      pickList[pickType] = pickList[pickType].map((pickListElement) => {
        if (pickListElement.id === pickListId) {
          if (!pickListElement.isPicked) {
            numberOfExcept.current += pickListElement.isUsed ? 1 : -1;
          }
          return { ...pickListElement, isUsed: !pickListElement.isUsed };
        }
        return { ...pickListElement };
      });
      setForceRender((prev) => prev * -1);
    },
  };

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
