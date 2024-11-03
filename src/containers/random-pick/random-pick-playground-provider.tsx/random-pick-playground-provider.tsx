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
  handleCardFlip: (id: string) => void;
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
  const numberOfWinner = useRef(0);
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
  }, [modalState]);

  const defaultRandomPickPlaygroundStateValue = {
    numberOfPick,
    winners,
    temporaryPickList,
    modalState,
    forceRender,
    maxNumberOfPick: isExcludingSelected
      ? pickList[pickType].length - numberOfWinner.current
      : pickList[pickType].length,
  };

  const excludingSelectedPick = useCallback(
    (countNum: number) => {
      let count = countNum;
      const newWinners = [];
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickList[pickType].length);
        const pickedStudent = pickList[pickType][n];
        if (!pickList[pickType][n].isPicked) {
          pickList[pickType][n].isPicked = true;
          newWinners.push({
            pickListId: pickedStudent.id,
            pickListValue: pickedStudent.value,
            isflipped: false,
          });
          count -= 1;
          numberOfWinner.current += 1;
        }
      }
      return newWinners;
    },
    [pickList, pickType, numberOfWinner],
  );

  const includingSelectedPick = useCallback(
    (countNum: number) => {
      let count = countNum;
      const newWinners = [];
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickList[pickType].length);
        if (!newWinners.includes(n)) {
          if (!pickList[pickType][n].isPicked) {
            numberOfWinner.current += 1;
          }
          pickList[pickType][n].isPicked = true;
          newWinners.push({ pickListIndex: n, isflipped: false });
          count -= 1;
        }
      }
      return newWinners;
    },
    [pickList, pickType, numberOfWinner],
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
      numberOfWinner.current = 0;
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
