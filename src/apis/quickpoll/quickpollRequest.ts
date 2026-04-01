import {
  Poll,
  Vote,
  CreatePollRequest,
  CastVoteRequest,
} from '@/types/quickpoll';

// ─── 로컬 스토리지 저장소 (개발 모드) ───
const STORAGE_KEY_POLLS = 'quickpoll-polls-v1';
const STORAGE_KEY_VOTES = 'quickpoll-votes-v1';

function getLocalPolls(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY_POLLS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalPolls(polls: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_POLLS, JSON.stringify(polls));
  } catch {
    console.error('Failed to save polls to localStorage');
  }
}

function getLocalVotes(): Record<string, any[]> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY_VOTES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalVotes(votes: Record<string, any[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(votes));
  } catch {
    console.error('Failed to save votes to localStorage');
  }
}

// ─── 폴 생성 ───
export async function createPoll(data: CreatePollRequest): Promise<Poll> {
  const pollId = crypto.randomUUID();
  const secretToken = crypto.randomUUID();

  const poll = {
    id: pollId,
    title: data.title,
    description: data.description || null,
    status: 'draft' as const,
    max_votes_per_person: data.maxVotesPerPerson,
    secret_token: secretToken,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const options = data.options.map((opt, idx) => ({
    id: `opt-${pollId}-${idx}`,
    poll_id: pollId,
    title: opt.title,
    description: opt.description || null,
    image_url: opt.imageUrl || null,
  }));

  const polls = getLocalPolls();
  polls[pollId] = { ...poll, options };
  saveLocalPolls(polls);

  return formatPoll(poll, options);
}

// ─── 폴 조회 (by ID) ───
export async function getPoll(pollId: string): Promise<Poll> {
  const polls = getLocalPolls();
  if (polls[pollId]) {
    const pollData = polls[pollId];
    return formatPoll(pollData, pollData.options || []);
  }
  throw new Error('Poll not found');
}

// ─── 폴 목록 조회 ───
export async function listPolls(status?: string): Promise<Poll[]> {
  const polls = getLocalPolls();
  let result = Object.values(polls) as any[];

  if (status) {
    result = result.filter((p) => p.status === status);
  }

  return result.map((p: any) => formatPoll(p, p.options || []));
}

// ─── 폴 상태 변경 (활성화/종료) ───
export async function updatePollStatus(
  pollId: string,
  status: 'active' | 'closed',
  secretToken: string,
): Promise<Poll> {
  const polls = getLocalPolls();
  if (!polls[pollId]) throw new Error('Poll not found');

  if (polls[pollId].secret_token !== secretToken) {
    throw new Error('Invalid secret token');
  }

  polls[pollId].status = status;
  polls[pollId].updated_at = new Date().toISOString();
  saveLocalPolls(polls);

  return formatPoll(polls[pollId], polls[pollId].options || []);
}

// ─── 투표 등록 ───
export async function castVote(data: CastVoteRequest): Promise<Vote> {
  const polls = getLocalPolls();
  if (!polls[data.pollId]) throw new Error('Poll not found');
  if (polls[data.pollId].status !== 'active')
    throw new Error('Poll is not active');

  const votes = getLocalVotes();
  const voteId = crypto.randomUUID();
  const participantId = crypto.randomUUID();

  const newVote = {
    id: voteId,
    poll_id: data.pollId,
    participant_id: participantId,
    participant_name: data.participantName,
    selected_option_ids: data.selectedOptionIds,
    voted_at: new Date().toISOString(),
  };

  if (!votes[data.pollId]) votes[data.pollId] = [];
  votes[data.pollId].push(newVote);
  saveLocalVotes(votes);

  return formatVote(newVote);
}

// ─── 폴의 투표 조회 ───
export async function getPollVotes(pollId: string): Promise<Vote[]> {
  const votes = getLocalVotes();
  return (votes[pollId] || []).slice().reverse().map(formatVote);
}

// ─── 폴 투표 초기화 (다시하기) ───
export async function resetPollVotes(pollId: string, secretToken: string): Promise<void> {
  const polls = getLocalPolls();
  if (!polls[pollId]) throw new Error('Poll not found');
  if (polls[pollId].secret_token !== secretToken) {
    throw new Error('Invalid secret token');
  }

  const votes = getLocalVotes();
  if (votes[pollId]) {
    votes[pollId] = [];
    saveLocalVotes(votes);
  }
}


// ─── 폴 결과 조회 (투표 수 포함) ───
export async function getPollResults(pollId: string) {
  const polls = getLocalPolls();
  const votes = getLocalVotes();

  const pollData = polls[pollId];
  if (!pollData) return { options: [], totalVotes: 0 };

  const pollVotes = votes[pollId] || [];
  const voteCounts: Record<string, number> = {};

  pollData.options?.forEach((opt: any) => {
    voteCounts[opt.id] = 0;
  });

  pollVotes.forEach((vote: any) => {
    vote.selected_option_ids.forEach((optionId: string) => {
      voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
    });
  });

  return {
    options:
      pollData.options?.map((opt: any) => ({
        ...opt,
        voteCount: voteCounts[opt.id] || 0,
      })) || [],
    totalVotes: pollVotes.length,
  };
}

// ─── 유틸함수 ───
function formatPoll(poll: any, options: any[]): Poll {
  return {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    status: poll.status,
    maxVotesPerPerson: poll.max_votes_per_person,
    options: options.map((opt) => ({
      id: opt.id,
      title: opt.title,
      description: opt.description,
      imageUrl: opt.image_url,
      voteCount: 0,
    })),
    createdAt: poll.created_at,
    updatedAt: poll.updated_at,
    secretToken: poll.secret_token,
  };
}

function formatVote(vote: any): Vote {
  return {
    id: vote.id,
    pollId: vote.poll_id,
    participantId: vote.participant_id,
    participantName: vote.participant_name,
    selectedOptionIds: vote.selected_option_ids,
    votedAt: vote.voted_at,
  };
}
