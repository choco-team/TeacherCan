import NoticeOpenButton from './notice/notice-open-button';
import SentenceSuggestion from './sentence-suggestion/sentence-suggestion';

export default function NoticeSuggestionContainer() {
  return (
    <div className="flex-grow flex flex-col gap-y-10 mx-auto w-full max-w-screen-sm">
      <SentenceSuggestion />
      <NoticeOpenButton />
    </div>
  );
}
