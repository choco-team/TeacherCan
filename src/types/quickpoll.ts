// Quick Poll 타입 정의

export type PollStatus = 'draft' | 'active' | 'closed';

export interface PollOption {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  voteCount: number;
}

export interface PollOptionDraft {
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  status: PollStatus;
  maxVotesPerPerson: number;
  options: PollOption[];
  createdAt: string;
  updatedAt: string;
  secretToken?: string;
}

export interface Vote {
  id: string;
  pollId: string;
  participantId: string;
  participantName: string;
  selectedOptionIds: string[];
  votedAt: string;
}

export interface CreatePollRequest {
  title: string;
  description?: string;
  maxVotesPerPerson: number;
  options: Omit<PollOption, 'id' | 'voteCount'>[];
}

export interface CastVoteRequest {
  pollId: string;
  participantName: string;
  selectedOptionIds: string[];
}
