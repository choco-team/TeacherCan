'use client';

import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

type SingleMemo = {
  text: string;
  timeTag?: string;
};

const STORAGE_KEY = 'clock-memo';

export function ClockMemoSettings() {
  const [memo, setMemo] = useLocalStorage<SingleMemo>(STORAGE_KEY as any, {
    text: '',
    timeTag: '',
  });
  const [draft, setDraft] = useState<SingleMemo>({
    text: (memo as any)?.text ?? '',
    timeTag: (memo as any)?.timeTag ?? '',
  });

  const save = () => {
    const text = (draft.text || '').trim();
    const timeTag = (draft.timeTag || '').trim();
    setMemo({
      text,
      timeTag: timeTag || undefined,
    } as any);
  };

  const clear = () => {
    setMemo({ text: '', timeTag: '' } as any);
    setDraft({ text: '', timeTag: '' });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={draft.timeTag}
        onChange={(e) => setDraft((d) => ({ ...d, timeTag: e.target.value }))}
        placeholder="예: 14:00 수업 시작"
        className="w-36 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-gray-300"
      />
      <input
        value={draft.text}
        onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
        placeholder="학생에게 보여줄 메모"
        className="w-56 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-gray-300"
      />
      <button
        type="button"
        onClick={save}
        className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white hover:bg-gray-800"
      >
        저장
      </button>
      <button
        type="button"
        onClick={clear}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
      >
        지우기
      </button>
    </div>
  );
}

export function ClockMemoDisplay() {
  const [memo] = useLocalStorage<SingleMemo>(STORAGE_KEY as any, {
    text: '',
    timeTag: '',
  });
  const text = (memo as any)?.text?.trim?.() ?? '';
  const timeTag = (memo as any)?.timeTag?.trim?.() ?? '';
  if (!text) return null;

  return (
    <div className="mb-4 rounded-md border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
      {timeTag && <div className="mb-1 text-xs text-gray-500">{timeTag}</div>}
      <div className="text-base font-medium text-gray-800">{text}</div>
    </div>
  );
}
