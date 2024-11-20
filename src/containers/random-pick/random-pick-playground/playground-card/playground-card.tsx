type TitleType = {
  title: string;
};

export default function Card({ title }: TitleType) {
  return (
    <div className="h-[120px] w-full text-primary border border-primary flex items-center justify-center rounded-lg text-[36px]">
      <span>{title}</span>
    </div>
  );
}
