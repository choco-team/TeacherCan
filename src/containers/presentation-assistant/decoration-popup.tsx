import { X } from 'lucide-react';

const DECORATIONS = [
  { id: 'star', emoji: '⭐', label: '별' },
  { id: 'heart', emoji: '❤️', label: '하트' },
  { id: 'fireworks', emoji: '🎉', label: '폭죽' },
  { id: 'crown', emoji: '👑', label: '왕관' },
  { id: 'rainbow', emoji: '🌈', label: '무지개' },
  { id: 'fire', emoji: '🔥', label: '불꽃' },
];

interface DecorationPopupProps {
  studentName: string;
  onSelect: (decoration: string) => void;
  onClose: () => void;
}

export default function DecorationPopup({
  studentName,
  onSelect,
  onClose,
}: DecorationPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-xs rounded-2xl border border-border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">축하해요!</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          <strong>{studentName}</strong> 학생에게 보상 아이템을 선택해 주세요!
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DECORATIONS.map((decoration) => (
            <button
              key={decoration.id}
              onClick={() => onSelect(decoration.emoji)}
              className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95"
            >
              <span className="text-3xl">{decoration.emoji}</span>
              <span className="text-xs text-muted-foreground">
                {decoration.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
