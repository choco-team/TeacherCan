import { cn } from '@/styles/utils';
import NoticeOpenButton from './notice/notice-open-button';
import SentenceSuggestion from './sentence-suggestion/sentence-suggestion';

export default function NoticeSuggestionContainer() {
  return (
    <div
      className={cn(
        'flex flex-col gap-y-10 mx-auto px-8 py-6 w-full max-w-screen-sm h-full',
        'max-sm:p-2',
      )}
    >
      <SentenceSuggestion />
      <NoticeOpenButton />
    </div>
  );
}
