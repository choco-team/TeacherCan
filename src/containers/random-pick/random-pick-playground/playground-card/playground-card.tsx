import { InnerPickListType } from '../../random-pick-provider/random-pick-provider';

type CardProps = {
  card?: InnerPickListType;
  title?: string;
};

export default function Card({ card, title }: CardProps) {
  return (
    <>
      {card && card.isPicked && (
        <div className="h-10 bg-primary text-white flex items-center justify-center rounded-lg">
          당첨
        </div>
      )}
      {card && !card.isPicked && (
        <div className="h-10 bg-primary text-white flex items-center justify-center rounded-lg">
          {card.value}
        </div>
      )}
      {title && (
        <div className="h-10 bg-primary text-white flex items-center justify-center rounded-lg">
          {title}
        </div>
      )}
    </>
  );
}
