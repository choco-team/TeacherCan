import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';
import Card from './playground-card/playground-card';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import PlaygroundModal from './playgrund-modal/playground-modal';
import { MODAL_STATE_TYPES } from '../random-pick-playground-provider.tsx/random-pick-playground-provider.constans';

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function PlayGround() {
  const {
    pickList,
    pickType,
    options: { isSeparateSelectedStudent },
  } = useRandomPickState();
  const { modalState, temporaryPickList } = useRandomPickPlaygroundState();
  const { selectModalState } = useRandomPickPlaygroundAction();

  return (
    <div className="flex flex-col p-4">
      <PlaygroundModal />
      <div className="flex flex-row">
        <Input
          type="text"
          maxLength={RANDOM_PICK_NAME_MAX_LENGTH}
          placeholder="랜덤뽑기 이름"
          className="max-w-sm h-10 text-4xl rounded-xl text-center font-extrabold"
        />
        <Button
          onClick={() => selectModalState(MODAL_STATE_TYPES.setPickNumberModal)}
        >
          뽑기
        </Button>
      </div>
      {modalState === MODAL_STATE_TYPES.noModal &&
        isSeparateSelectedStudent && (
          <div>
            <div className="grid grid-cols-7 gap-4 p-4">
              {pickList[pickType].map(
                (card) => !card.isPicked && <Card key={card.id} card={card} />,
              )}
            </div>
            <div className="grid grid-cols-7 gap-4 p-4">
              {pickList[pickType].map(
                (card) => card.isPicked && <Card key={card.id} card={card} />,
              )}
            </div>
          </div>
        )}
      <div className="grid grid-cols-7 gap-4 p-4">
        {modalState === MODAL_STATE_TYPES.noModal &&
          !isSeparateSelectedStudent &&
          pickList[pickType].map((card) => <Card key={card.id} card={card} />)}
        {modalState === MODAL_STATE_TYPES.setPickNumberModal &&
          temporaryPickList.map((value) => <Card key={value} title={value} />)}
        {modalState === MODAL_STATE_TYPES.resultModal &&
          pickList[pickType].map((card) => (
            <Card key={card.id} title={card.value} />
          ))}
      </div>
    </div>
  );
}
