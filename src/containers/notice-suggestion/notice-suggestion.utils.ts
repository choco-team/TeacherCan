import { NOTICE_SUGGESTION_ERROR_CODES } from './notice-suggestion.constants';
import type {
  NoticeSuggestion,
  NoticeSuggestionResponse,
} from './notice-suggestion.types';

export const getRandomBadgeColor = (label: string) => {
  // 문자열을 숫자로 변환 (일관된 해시값 생성)
  const hash = label.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + (acc * 32 - acc);
  }, 0);

  // 색상 생성 (hue: 0-360)
  const hue = Math.abs((hash + 200) % 360);

  return `hsl(${hue}, 35%, 55%)`;
};

export const parseOpenAIResponse = (data: string): NoticeSuggestion[] => {
  const firstBraceIndex = data.indexOf('{');
  const lastBraceIndex = data.lastIndexOf('}');

  if (firstBraceIndex === -1 || lastBraceIndex === -1) {
    throw new Error(NOTICE_SUGGESTION_ERROR_CODES.INVALID_FORMAT);
  }

  const jsonStr = data.slice(firstBraceIndex, lastBraceIndex + 1);
  const parsedData = JSON.parse(jsonStr);

  const { suggestions }: NoticeSuggestionResponse = parsedData;

  if (!Array.isArray(suggestions)) {
    throw new Error(NOTICE_SUGGESTION_ERROR_CODES.INVALID_FORMAT);
  }

  return suggestions;
};
