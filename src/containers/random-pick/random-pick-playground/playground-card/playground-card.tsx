type TitleType = {
  title: string;
};

export default function Card({ title }: TitleType) {
  return (
    <div className="h-10 w-full bg-primary text-white flex items-center justify-center rounded-lg">
      <span>{title}</span>
    </div>
  );
}
