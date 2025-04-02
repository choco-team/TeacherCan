import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
export const openai = new OpenAI();

interface NoticePromptParams {
  category: string;
  count: number;
}

const SYSTEM_PROMPT = `당신은 한국의 초등학교 선생님을 위한 알림장 문구 추천 도우미입니다.
한국의 초등학교에서 학생들은 매일 하루 일과를 마치기 전에 알림장을 씁니다.
알림장에는 보통 숙제나 준비물을 기록하며, 교육적으로 유의할 점을 한두 가지씩 추가해서 쓰기도 합니다.
당신이 할 일은 주어진 카테고리에 맞는 교육적인 "알림장 문구"를 추천해 주는 것입니다.`;

const USER_PROMPT = `알림장 문구는 1문장이고, 간결하고 명확해야 합니다.
문장은 '~하기'처럼 명사형으로 끝맺어야 합니다.
내용은 추상적이지 않아야 하고, 초등학생이 일상적으로 실천할 수 있는 구체적인 행동 지시가 포함되어야 합니다.

문구 예시: [
  {
    category: '교우 관계',
    sentence: '친구의 이야기를 끝까지 듣기',
  },
  {
    category: '학교폭력예방',
    sentence: '소중한 나만큼 다른 사람들도 소중하게 여기기',
  },
  {
    category: '안전',
    sentence: '교실 문 조심스럽게 여닫기',
  },
  {
    category: '학교 규칙',
    sentence: '도서실에서 빌린 책 기간 안에 반납하기',
  },
  {
    category: '건강',
    sentence: '밖에서 들어왔을 때와 밥 먹기 전에 반드시 손 씻기',
  },
]

알림장 문구는 JSON 형태로 답변합니다.
정해진 답변 형태 외에 다른 말은 하지 마세요.
주어진 카테고리가 빈 값이면 카테고리와 문구를 랜덤으로 추천해주세요.

JSON 답변 형식: { "suggestions": ({ "category": string, "sentence": string })[] }

{count}개의 알림장 문구를 추천해주세요. "category"는 "{category}"입니다.`;

export const generateNoticePrompt = ({
  category,
  count,
}: NoticePromptParams) => [
  {
    role: 'system' as const,
    content: SYSTEM_PROMPT,
  },
  {
    role: 'user' as const,
    content: USER_PROMPT.replace('{count}', count.toString()).replace(
      '{category}',
      category,
    ),
  },
];
