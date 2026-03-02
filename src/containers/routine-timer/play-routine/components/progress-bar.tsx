type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-10 overflow-hidden">
      <div
        className="bg-primary-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
