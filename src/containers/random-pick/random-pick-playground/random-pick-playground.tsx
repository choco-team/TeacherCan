import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { useRandomPickState } from '../random-pick-provider/random-pick-provider.hooks';
import Card from './playground-card/playground-card';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import PlaygroundModal from './playgrund-modal/playground-modal';
import MixedCard from './playground-mixed-card/playground-mixed-card';

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function PlayGround() {
  const { pickList, pickType } = useRandomPickState();
  const { forceRender, isModalOpen, isResultModal } =
    useRandomPickPlaygroundState();

  const { openModal } = useRandomPickPlaygroundAction();

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
        <Button onClick={openModal}>뽑기</Button>
      </div>
      <div key={forceRender} className="grid grid-cols-7 gap-4 p-4">
        {
          // 첫화면
          !isModalOpen &&
            pickList[pickType].map((card) =>
              card.isPicked ? (
                <Card key={card.value} title="당첨" />
              ) : (
                <Card key={card.value} title={card.value} />
              ),
            )
        }
        {
          // 당첨개수 설정 모달 일 때
          isModalOpen && !isResultModal && <MixedCard />
        }
        {
          // 결과 모달 일 때
          isModalOpen &&
            isResultModal &&
            pickList[pickType].map((card) => (
              <Card key={card.value} title={card.value} />
            ))
        }
      </div>
    </div>
  );
}
