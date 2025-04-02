import { NOTICE_SUGGESTION_CATEGORIES } from './notice-suggestion.constants';

export type NoticeSuggestionCategory =
  | ''
  | (typeof NOTICE_SUGGESTION_CATEGORIES)[number]['value'];

export interface NoticeSuggestionRequest {
  category: string;
  count?: number;
}

export interface NoticeSuggestion {
  category: string;
  sentence: string;
}

export interface NoticeSuggestionResponse {
  suggestions: NoticeSuggestion[];
}
