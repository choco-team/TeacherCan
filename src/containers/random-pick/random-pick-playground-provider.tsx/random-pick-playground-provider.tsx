import { createContext, PropsWithChildren, useRef, useState } from 'react';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';

type RandomPickPlaygroundState = {
  isModalOpen: boolean;
  numberOfPick: number;
  isResultModal: boolean;
  winners: number[];
};

export const RandomPickPlaygroundStateContext =
  createContext<RandomPickPlaygroundState | null>(null);

type RandomPickPlaygroundAction = {
  openModal: () => void;
  closeModal: () => void;
  executePick: (newNumberOfPick?: number) => void;
  resetPick: () => void;
};

export const RandomPickPlaygroundActionContext =
  createContext<RandomPickPlaygroundAction | null>(null);

export default function RandomPickPlaygroundProvider({
  children,
}: PropsWithChildren<{}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfPick, setNumberOfPick] = useState(1);
  const [isResultModal, setIsResultModal] = useState(false);
  const [winners, setWinners] = useState([]);
  const numberOfWinner = useRef(0);

  const { pickType, pickList } = useRandomPickState();

  const defaultRandomPickPlaygroundStateValue = {
    isModalOpen,
    numberOfPick,
    isResultModal,
    winners,
  };

  const defaultRandomPickPlaygroundActionValue = {
    openModal: () => {
      setIsModalOpen(true);
    },
    closeModal: () => {
      setIsModalOpen(false);
      setIsResultModal(false);
    },
    executePick: (newNumberOfPick?: number) => {
      let count = numberOfPick;
      if (newNumberOfPick) {
        setNumberOfPick(newNumberOfPick);
        count = newNumberOfPick;
      }
      const pickListLength = pickList[pickType].length;
      const newWinners = [];

      if (numberOfWinner.current === pickListLength) {
        // alert('전부 뽑았음!');
        console.log('전부 뽑았음!');
        return;
      }
      if (
        pickListLength - numberOfWinner.current <
        (newNumberOfPick || numberOfPick)
      ) {
        // alert(`${pickListLength - numberOfWinner.current}명 남았습니다.`);
        console.log(`${pickListLength - numberOfWinner.current}명 남았습니다.`);
        return;
      }
      while (count !== 0) {
        const n = Math.floor(Math.random() * pickListLength);
        if (!pickList[pickType][n].isPicked) {
          pickList[pickType][n].isPicked = true;
          newWinners.push(n);
          count -= 1;
          numberOfWinner.current += 1;
        }
      }
      setIsResultModal(true);
      setWinners(newWinners);
    },
    resetPick: () => {
      // pickList.names.map((name)=>{name.isPicked = false})
      // pickList.numbers.map((number)=>{number.isPicked = false})
      // numberOfWinner.current = 0;
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
