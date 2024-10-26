import {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';

type WinnersType = {
  id: number;
  isflipped: boolean;
};

type RandomPickPlaygroundState = {
  isModalOpen: boolean;
  numberOfPick: number;
  isResultModal: boolean;
  winners: WinnersType[];
  forceRender: number;
};

export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  openModal: () => void;
  closeModal: () => void;
  runPick: (newNumberOfPick?: number) => void;
  resetPick: () => void;
  handleCardFlip: (id: number) => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  children,
}: PropsWithChildren<{}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfPick, setNumberOfPick] = useState(1);
  const [isResultModal, setIsResultModal] = useState(false);
  const [winners, setWinners] = useState<WinnersType[]>([]);
  const [forceRender, setForceRender] = useState(1);
  const numberOfWinner = useRef(0);

  const {
    pickType,
    pickList,
    options: { isExcludingSelected },
  } = useRandomPickState();

  const defaultRandomPickPlaygroundStateValue = {
    isModalOpen,
    numberOfPick,
    isResultModal,
    winners,
    forceRender,
  };

  const excludingSelectedPick = useCallback(
    (countNum: number) => {
      let count = countNum;
      const newWinners = [];
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickList[pickType].length);
        if (!pickList[pickType][n].isPicked) {
          pickList[pickType][n].isPicked = true;
          newWinners.push({ id: n, isflipped: false });
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
          newWinners.push({ id: n, isflipped: false });
          count -= 1;
        }
      }
      return newWinners;
    },
    [pickList, pickType, numberOfWinner],
  );

  const defaultRandomPickPlaygroundActionValue = {
    openModal: () => {
      setIsModalOpen(true);
    },
    closeModal: () => {
      setIsModalOpen(false);
      setIsResultModal(false);
    },
    runPick: (newNumberOfPick?: number) => {
      // 뽑기 가능 한지 검증하기 / 경고문구 표현할 방법 연구해야함
      const pickListLength = pickList[pickType].length;
      if (
        pickListLength - numberOfWinner.current <
        (newNumberOfPick || numberOfPick)
      ) {
        // alert(`${pickListLength - numberOfWinner.current}명 남았습니다.`);
        return;
      }
      // 당첨 개수, 모달 설정
      let countNum = numberOfPick;
      if (newNumberOfPick) {
        setNumberOfPick(newNumberOfPick);
        setIsResultModal(true);
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
      pickList.names = pickList.names.map((name) =>
        name.isPicked ? { ...name, isPicked: false } : { ...name },
      );
      pickList.numbers = pickList.numbers.map((number) =>
        number.isPicked ? { ...number, isPicked: false } : { ...number },
      );
      numberOfWinner.current = 0;
      // pickList가 state가 아니라서 강제로 리렌더링시킴
      setForceRender((prev) => prev * -1);
    },
    handleCardFlip: (id: number) => {
      setWinners((prevWinners) =>
        prevWinners.map((winner) =>
          winner.id === id
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
