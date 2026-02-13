import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { cn } from '@/styles/utils';
import { Plus } from 'lucide-react';
import Card from '../card/card';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { MAX_RANDOM_PICK_STUDENTS } from '../../random-pick-constants';

type Props = {
  isMixingCards: boolean;
};

const INTERVAL_TIME = {
  INITIAL: 50,
  MAX: 5000,
};

export default function CardList({ isMixingCards }: Props) {
  const cardMixRef = useRef<NodeJS.Timeout | null>(null);

  const { randomPick } = useRandomPickPlaygroundState();
  const { addStudent, removeStudent } = useRandomPickPlaygroundAction();
  const winners = randomPick.pickList.filter((item) => item.isPicked);
  const winnerIds = winners.map(({ id }) => id);

  const [students, setStudents] = useState(randomPick.pickList);
  const [intervalTime, setIntervalTime] = useState(INTERVAL_TIME.INITIAL);
  const [isAdding, setIsAdding] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    if (isMixingCards) {
      cardMixRef.current = setInterval(() => {
        setStudents((prev) => [...prev].sort(() => Math.random() - 0.5));
        setIntervalTime((prev) => Math.min(prev * 20, INTERVAL_TIME.MAX));
      }, intervalTime);
    } else {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    }
    return () => {
      clearInterval(cardMixRef.current);
      setIntervalTime(INTERVAL_TIME.INITIAL);
    };
  }, [isMixingCards, intervalTime]);

  useEffect(() => {
    setStudents(randomPick.pickList);
  }, [randomPick.pickList]);

  const resetAddState = () => {
    setIsAdding(false);
    setNewStudentName('');
    setAddError('');
  };

  const startAddMode = () => {
    if (isMixingCards) {
      return;
    }
    setIsAdding(true);
    setAddError('');
  };

  const handleAddSubmit = () => {
    const trimmedName = newStudentName.trim();
    if (!trimmedName) {
      setAddError('이름을 입력해주세요.');
      return;
    }
    if (randomPick.pickList.some((item) => item.value === trimmedName)) {
      setAddError('중복된 이름이 있습니다.');
      return;
    }
    if (randomPick.pickList.length >= MAX_RANDOM_PICK_STUDENTS) {
      setAddError('최대 인원은 30명입니다.');
      return;
    }

    addStudent(trimmedName);
    resetAddState();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSubmit();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      resetAddState();
    }
  };

  const isAddDisabled =
    isMixingCards || randomPick.pickList.length >= MAX_RANDOM_PICK_STUDENTS;

  return (
    <div
      className={cn(
        'flex-grow grid gap-2 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 content-start',
        'mb-36 lg:mb-24',
      )}
    >
      {(isMixingCards ? students : randomPick.pickList).map(({ id, value }) => {
        const isWinner = winnerIds.includes(id);
        return (
          <Card
            key={id}
            title={value}
            isWinner={isWinner}
            isMixingCards={isMixingCards}
            isExcludingSelected={randomPick.options.isExcludingSelected}
            isRemovable={!isMixingCards && !isWinner}
            onRemove={() => removeStudent(id)}
          />
        );
      })}
      {isAddDisabled ? null : (
        <div
          className={cn(
            'w-full h-24 text-text-title border flex items-center justify-center font-semibold rounded-2xl relative',
            'md:h-24',
            'lg:h-32 lg:rounded-3xl',
            'border-dashed border-gray-200/80 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60',
            isAddDisabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isAdding ? (
            <div className="flex flex-col gap-y-2 w-full px-3">
              <Input
                autoFocus
                value={newStudentName}
                onChange={(event) => {
                  setNewStudentName(event.target.value);
                  if (addError) setAddError('');
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="학생 이름 입력"
              />
              <div className="flex items-center gap-x-2">
                <Button
                  type="button"
                  size="xs"
                  variant="primary"
                  onClick={handleAddSubmit}
                >
                  추가
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant="gray-outline"
                  onClick={resetAddState}
                >
                  취소
                </Button>
                {addError ? (
                  <span className="text-xs text-red-500 ml-1">{addError}</span>
                ) : null}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startAddMode}
              className="flex items-center gap-x-2 text-sm text-gray-600 dark:text-gray-300"
              disabled={isAddDisabled}
            >
              <Plus className="h-4 w-4" />
              학생 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}
