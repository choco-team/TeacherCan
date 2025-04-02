'use server';

import type { NoticeSuggestionRequest } from '@/containers/notice-suggestion/notice-suggestion.types';
import { createRateLimiter } from './redis';
import { openai, generateNoticePrompt } from './openai';

// Rate limiting 설정
const rateLimiter = createRateLimiter({
  maxRequests: 10,
});

const prefix = 'notice-suggestion';
const isDev = process.env.NEXT_ENV === 'development';

export async function generateNoticeSuggestion({
  category,
  count = 5,
}: NoticeSuggestionRequest) {
  // Rate limiting 체크
  if (!isDev && (await rateLimiter.isRateLimited(prefix))) {
    throw new Error('RATE_LIMIT');
  }

  try {
    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: generateNoticePrompt({ category, count }),
      temperature: 0.7,
    });

    // 요청 횟수 증가
    if (!isDev) await rateLimiter.increment(prefix);

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new Error('OpenAI Error', error);
  }
}
