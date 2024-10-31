export default function Card({ title }) {
  return (
    <div className="h-10 bg-primary text-white flex items-center justify-center rounded-lg">
      {title}
    </div>
  );
}
