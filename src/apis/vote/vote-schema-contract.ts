export const VOTE_TABLES = {
  ROOMS: 'vote_rooms',
  ROUNDS: 'vote_rounds',
  OPTIONS: 'vote_options',
  PARTICIPANTS: 'vote_participants',
  BALLOTS: 'vote_ballots',
} as const;

export type VoteRoomStatus = 'draft' | 'live' | 'ended';
export type VoteRoundStatus = 'ready' | 'live' | 'ended';

export type VoteRoomRow = {
  id: string;
  title: string;
  status: VoteRoomStatus;
  currentRoundId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VoteRoundRow = {
  id: string;
  roomId: string;
  roundNumber: number;
  question: string;
  maxSelections: number;
  status: VoteRoundStatus;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
};

export type VoteOptionRow = {
  id: string;
  roundId: string;
  label: string;
  displayOrder: number;
  createdAt: string;
};

export type VoteParticipantRow = {
  id: string;
  roomId: string;
  token: string;
  name: string;
  joinedAt: string;
};

export type VoteBallotRow = {
  id: string;
  roomId: string;
  roundId: string;
  optionId: string;
  participantId: string;
  createdAt: string;
};

/**
 * Supabase schema contract:
 * - vote_participants(roomId, token) UNIQUE
 * - vote_options(roundId, displayOrder) UNIQUE
 * - vote_ballots(roundId, participantId, optionId) UNIQUE
 * - vote_ballots insert는 "round당 participant 1회 제출" 정책을 지키도록
 *   서버(RLS / trigger / RPC)에서 추가 검증이 필요합니다.
 */
export const VOTE_SCHEMA_CONTRACT = {
  tableNames: VOTE_TABLES,
  constraints: {
    uniqueParticipantByRoom: ['roomId', 'token'],
    uniqueOptionOrderByRound: ['roundId', 'displayOrder'],
    uniqueBallotByOption: ['roundId', 'participantId', 'optionId'],
  },
} as const;
