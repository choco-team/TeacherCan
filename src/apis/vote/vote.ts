import { supabaseVote as supabase } from '@/utils/supabase';
import {
  VOTE_TABLES,
  VoteBallotRow,
  VoteOptionRow,
  VoteRoomRow,
  VoteRoundRow,
  VoteRoomStatus,
  VoteRoundStatus,
} from './vote-schema-contract';

export type VoteOptionResult = VoteOptionRow & {
  voteCount: number;
};

export type VoteRoundWithOptions = VoteRoundRow & {
  options: VoteOptionResult[];
  totalVotes: number;
};

export type VoteTeacherSnapshot = {
  room: VoteRoomRow;
  joinedStudentCount: number;
  currentRound: VoteRoundWithOptions | null;
  rounds: VoteRoundWithOptions[];
};

type VoteBallotSelectRow = Pick<VoteBallotRow, 'optionId' | 'roundId'>;

export type CreateVoteRoomParams = {
  title: string;
};

export type CreateVoteRoundParams = {
  roomId: string;
  question: string;
  maxSelections: number;
  options: string[];
};

export type UpdateReadyVoteRoundParams = {
  roomId: string;
  roundId: string;
  question: string;
  maxSelections: number;
  options: string[];
};

export type SubmitVoteBallotParams = {
  roomId: string;
  roundId: string;
  optionIds: string[];
  participantToken: string;
  participantName: string;
};

const MAX_VOTE_OPTIONS = 10;

const buildRoundResults = (
  rounds: VoteRoundRow[],
  options: VoteOptionRow[],
  ballots: VoteBallotSelectRow[],
): VoteRoundWithOptions[] => {
  const ballotCountByOptionId = ballots.reduce<Record<string, number>>(
    (acc, ballot) => {
      acc[ballot.optionId] = (acc[ballot.optionId] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return rounds.map((round) => {
    const optionsInRound = options
      .filter((option) => option.roundId === round.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((option) => ({
        ...option,
        voteCount: ballotCountByOptionId[option.id] ?? 0,
      }));

    const totalVotes = optionsInRound.reduce(
      (sum, option) => sum + option.voteCount,
      0,
    );

    return {
      ...round,
      options: optionsInRound,
      totalVotes,
    };
  });
};

export const createVoteRoom = async ({
  title,
}: CreateVoteRoomParams): Promise<{ roomId: string }> => {
  const { data, error } = await supabase
    .from(VOTE_TABLES.ROOMS)
    .insert({
      title,
      status: 'draft' as VoteRoomStatus,
      currentRoundId: null,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { roomId: data.id };
};

export const getVoteTeacherSnapshot = async ({
  roomId,
}: {
  roomId: string;
}): Promise<VoteTeacherSnapshot> => {
  const [
    { data: room, error: roomError },
    { count: joinedStudentCount, error },
  ] = await Promise.all([
    supabase.from(VOTE_TABLES.ROOMS).select('*').eq('id', roomId).single(),
    supabase
      .from(VOTE_TABLES.PARTICIPANTS)
      .select('id', { count: 'exact', head: true })
      .eq('roomId', roomId),
  ]);

  if (roomError) {
    throw new Error(roomError.message);
  }

  if (error) {
    throw new Error(error.message);
  }

  const { data: rounds, error: roundsError } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .select('*')
    .eq('roomId', roomId)
    .order('roundNumber', { ascending: false })
    .returns<VoteRoundRow[]>();

  if (roundsError) {
    throw new Error(roundsError.message);
  }

  if (!rounds || rounds.length === 0) {
    return {
      room,
      joinedStudentCount: joinedStudentCount ?? 0,
      currentRound: null,
      rounds: [],
    };
  }

  const roundIds = rounds.map((round) => round.id);
  const [
    { data: options, error: optionsError },
    { data: ballots, error: ballotsError },
  ] = await Promise.all([
    supabase
      .from(VOTE_TABLES.OPTIONS)
      .select('*')
      .in('roundId', roundIds)
      .returns<VoteOptionRow[]>(),
    supabase
      .from(VOTE_TABLES.BALLOTS)
      .select('optionId, roundId')
      .in('roundId', roundIds)
      .returns<VoteBallotSelectRow[]>(),
  ]);

  if (optionsError) {
    throw new Error(optionsError.message);
  }

  if (ballotsError) {
    throw new Error(ballotsError.message);
  }

  const roundResults = buildRoundResults(rounds, options ?? [], ballots ?? []);
  const currentRound =
    roundResults.find((round) => round.id === room.currentRoundId) ??
    roundResults[0] ??
    null;

  return {
    room,
    joinedStudentCount: joinedStudentCount ?? 0,
    currentRound,
    rounds: roundResults,
  };
};

export const createVoteRound = async ({
  roomId,
  question,
  maxSelections,
  options,
}: CreateVoteRoundParams): Promise<{ roundId: string }> => {
  const trimmedOptions = options.map((option) => option.trim()).filter(Boolean);
  if (trimmedOptions.length < 2) {
    throw new Error('선택지는 최소 2개 이상 필요합니다.');
  }

  if (trimmedOptions.length > MAX_VOTE_OPTIONS) {
    throw new Error(
      `선택지는 최대 ${MAX_VOTE_OPTIONS}개까지 만들 수 있습니다.`,
    );
  }

  const { data: latestRound } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .select('roundNumber')
    .eq('roomId', roomId)
    .order('roundNumber', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextRoundNumber = (latestRound?.roundNumber ?? 0) + 1;

  const { data: round, error: roundError } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .insert({
      roomId,
      question,
      maxSelections,
      roundNumber: nextRoundNumber,
      status: 'ready' as VoteRoundStatus,
    })
    .select('id')
    .single();

  if (roundError) {
    throw new Error(roundError.message);
  }

  const { error: optionError } = await supabase
    .from(VOTE_TABLES.OPTIONS)
    .insert(
      trimmedOptions.map((option, index) => ({
        roundId: round.id,
        label: option,
        displayOrder: index + 1,
      })),
    );

  if (optionError) {
    throw new Error(optionError.message);
  }

  const { error: roomUpdateError } = await supabase
    .from(VOTE_TABLES.ROOMS)
    .update({
      status: 'draft' as VoteRoomStatus,
      currentRoundId: round.id,
    })
    .eq('id', roomId);

  if (roomUpdateError) {
    throw new Error(roomUpdateError.message);
  }

  return { roundId: round.id };
};

export const updateReadyVoteRound = async ({
  roomId,
  roundId,
  question,
  maxSelections,
  options,
}: UpdateReadyVoteRoundParams): Promise<{ roundId: string }> => {
  const trimmedOptions = options.map((option) => option.trim()).filter(Boolean);
  if (trimmedOptions.length < 2) {
    throw new Error('선택지는 최소 2개 이상 필요합니다.');
  }

  if (trimmedOptions.length > MAX_VOTE_OPTIONS) {
    throw new Error(
      `선택지는 최대 ${MAX_VOTE_OPTIONS}개까지 만들 수 있습니다.`,
    );
  }

  if (maxSelections > trimmedOptions.length - 1) {
    throw new Error(
      '최대 선택 개수는 유효한 선택지 개수보다 1개 적어야 합니다.',
    );
  }

  const { data: targetRound, error: targetRoundError } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .select('id, status')
    .eq('id', roundId)
    .eq('roomId', roomId)
    .single();

  if (targetRoundError) {
    throw new Error(targetRoundError.message);
  }

  if (targetRound.status !== 'ready') {
    throw new Error('준비 상태의 투표만 수정할 수 있습니다.');
  }

  const { error: roundUpdateError } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .update({
      question,
      maxSelections,
    })
    .eq('id', roundId);

  if (roundUpdateError) {
    throw new Error(roundUpdateError.message);
  }

  const { error: deleteOptionError } = await supabase
    .from(VOTE_TABLES.OPTIONS)
    .delete()
    .eq('roundId', roundId);

  if (deleteOptionError) {
    throw new Error(deleteOptionError.message);
  }

  const { error: insertOptionError } = await supabase
    .from(VOTE_TABLES.OPTIONS)
    .insert(
      trimmedOptions.map((option, index) => ({
        roundId,
        label: option,
        displayOrder: index + 1,
      })),
    );

  if (insertOptionError) {
    throw new Error(insertOptionError.message);
  }

  return { roundId };
};

export const startVoteRound = async ({
  roomId,
  roundId,
}: {
  roomId: string;
  roundId: string;
}) => {
  const startedAt = new Date().toISOString();

  const [{ error: roundError }, { error: roomError }] = await Promise.all([
    supabase
      .from(VOTE_TABLES.ROUNDS)
      .update({
        status: 'live' as VoteRoundStatus,
        startedAt,
        endedAt: null,
      })
      .eq('id', roundId),
    supabase
      .from(VOTE_TABLES.ROOMS)
      .update({
        status: 'live' as VoteRoomStatus,
        currentRoundId: roundId,
      })
      .eq('id', roomId),
  ]);

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (roomError) {
    throw new Error(roomError.message);
  }
};

export const endVoteRound = async ({ roundId }: { roundId: string }) => {
  const { error } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .update({
      status: 'ended' as VoteRoundStatus,
      endedAt: new Date().toISOString(),
    })
    .eq('id', roundId);

  if (error) {
    throw new Error(error.message);
  }
};

export const finishVoteRoom = async ({ roomId }: { roomId: string }) => {
  const { error } = await supabase
    .from(VOTE_TABLES.ROOMS)
    .update({
      status: 'ended' as VoteRoomStatus,
    })
    .eq('id', roomId);

  if (error) {
    throw new Error(error.message);
  }
};

export const joinVoteRoomParticipant = async ({
  roomId,
  token,
  name,
}: {
  roomId: string;
  token: string;
  name: string;
}) => {
  const { data: existingParticipant, error: fetchError } = await supabase
    .from(VOTE_TABLES.PARTICIPANTS)
    .select('id')
    .eq('roomId', roomId)
    .eq('token', token)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existingParticipant) {
    const { error: updateError } = await supabase
      .from(VOTE_TABLES.PARTICIPANTS)
      .update({ name })
      .eq('id', existingParticipant.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { participantId: existingParticipant.id };
  }

  const { data, error } = await supabase
    .from(VOTE_TABLES.PARTICIPANTS)
    .insert({
      roomId,
      token,
      name,
      joinedAt: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { participantId: data.id };
};

export const getVoteStudentSnapshot = async ({
  roomId,
  participantToken,
}: {
  roomId: string;
  participantToken: string;
}) => {
  const { data: room, error: roomError } = await supabase
    .from(VOTE_TABLES.ROOMS)
    .select('id, title, currentRoundId')
    .eq('id', roomId)
    .single();

  if (roomError) {
    throw new Error(roomError.message);
  }

  if (!room.currentRoundId) {
    return {
      roomTitle: room.title,
      liveRound: null,
      alreadySubmitted: false,
    };
  }

  const { data: round, error: roundError } = await supabase
    .from(VOTE_TABLES.ROUNDS)
    .select('*')
    .eq('id', room.currentRoundId)
    .single();

  if (roundError) {
    throw new Error(roundError.message);
  }

  if (round.status !== 'live') {
    return {
      roomTitle: room.title,
      liveRound: null,
      alreadySubmitted: false,
    };
  }

  const [{ data: options, error: optionError }, { data: participant }] =
    await Promise.all([
      supabase
        .from(VOTE_TABLES.OPTIONS)
        .select('*')
        .eq('roundId', round.id)
        .order('displayOrder', { ascending: true })
        .returns<VoteOptionRow[]>(),
      supabase
        .from(VOTE_TABLES.PARTICIPANTS)
        .select('id')
        .eq('roomId', roomId)
        .eq('token', participantToken)
        .maybeSingle(),
    ]);

  if (optionError) {
    throw new Error(optionError.message);
  }

  let alreadySubmitted = false;
  if (participant) {
    const { count, error: ballotError } = await supabase
      .from(VOTE_TABLES.BALLOTS)
      .select('id', { count: 'exact', head: true })
      .eq('roundId', round.id)
      .eq('participantId', participant.id);

    if (ballotError) {
      throw new Error(ballotError.message);
    }

    alreadySubmitted = (count ?? 0) > 0;
  }

  return {
    roomTitle: room.title,
    liveRound: {
      ...round,
      options: options ?? [],
    },
    alreadySubmitted,
  };
};

export const submitVoteBallot = async ({
  roomId,
  roundId,
  optionIds,
  participantToken,
  participantName,
}: SubmitVoteBallotParams) => {
  if (optionIds.length === 0) {
    throw new Error('최소 1개 이상의 선택지를 선택해주세요.');
  }

  const { participantId } = await joinVoteRoomParticipant({
    roomId,
    token: participantToken,
    name: participantName,
  });

  const { count, error: countError } = await supabase
    .from(VOTE_TABLES.BALLOTS)
    .select('id', { count: 'exact', head: true })
    .eq('roundId', roundId)
    .eq('participantId', participantId);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) > 0) {
    throw new Error('이미 해당 라운드에 투표를 완료했습니다.');
  }

  const { error: ballotError } = await supabase
    .from(VOTE_TABLES.BALLOTS)
    .insert(
      optionIds.map((optionId) => ({
        roomId,
        roundId,
        optionId,
        participantId,
        createdAt: new Date().toISOString(),
      })),
    );

  if (ballotError) {
    throw new Error(ballotError.message);
  }
};
