'use client';

import { Heading4 } from '@/components/heading';
import { useSearchParams } from 'next/navigation';
import FeedbackForm from './feedback-form/feedback-form';
import FeedbackResult from './feedback-result/feedback-result';

export default function FeedbackContainer() {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get('id');

  return (
    <div className="max-w-[800px] mx-auto items-start lg:flex-row">
      <Heading4 className="font-semibold mb-4">
        티처캔은 여러분의 소중한 피드백을 기다리고 있어요.
      </Heading4>
      <FeedbackForm />
      {feedbackId ? <FeedbackResult feedbackId={feedbackId} /> : null}
    </div>
  );
}
