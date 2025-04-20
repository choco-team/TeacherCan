'use client';

import { Heading1 } from '@/components/heading';
import { useSearchParams } from 'next/navigation';
import useDevice from '@/hooks/use-device';
import FeedbackForm from './feedback-form/feedback-form';
import FeedbackResult from './feedback-result/feedback-result';

export default function FeedbackContainer() {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get('id');

  const { isMobile } = useDevice();

  return (
    <div className="flex-grow flex flex-col gap-y-10 w-full max-w-screen-sm mx-auto">
      <Heading1>
        {isMobile
          ? '티처캔은\n선생님의 소중한 피드백을\n기다리고 있어요.'
          : '티처캔은 선생님의 소중한 피드백을 기다리고 있어요.'}
      </Heading1>
      <FeedbackForm />
      {feedbackId ? <FeedbackResult /> : null}
    </div>
  );
}
