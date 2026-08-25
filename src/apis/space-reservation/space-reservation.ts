import { supabaseVote as supabase } from '@/utils/supabase';
import { creatId } from '@/utils/createNanoid';
import {
  SPACE_RESERVATION_PERIODS,
  SPACE_RESERVATION_WEEKDAY_KEYS,
  SpaceReservationPeriod,
  SpaceReservationWeekday,
} from '@/types/space-reservation';
import {
  SPACE_RESERVATION_TABLES,
  SpaceReservationBanRow,
  SpaceReservationParticipantRow,
  SpaceReservationReservationRow,
  SpaceReservationRoomRow,
} from './space-reservation-schema-contract';

const UNIQUE_VIOLATION_CODE = '23505';

const toRoom = (row: SpaceReservationRoomRow) => row;
const toParticipant = (row: SpaceReservationParticipantRow) => row;
const toReservation = (row: SpaceReservationReservationRow) => row;
const toBan = (row: SpaceReservationBanRow) => row;

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const resolveWeekday = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);
  const day = date.getDay();
  if (day < 1 || day > 5) return null;

  return SPACE_RESERVATION_WEEKDAY_KEYS[day - 1] as SpaceReservationWeekday;
};

type DateRange = { startDateKey: string; endDateKey: string };

export const createSpaceReservationRoom = async (input: {
  roomName: string;
  grade: string;
  className: string;
}) => {
  const now = new Date().toISOString();
  const roomId = creatId();
  const adminParticipantId = creatId();

  const roomPayload: SpaceReservationRoomRow = {
    id: roomId,
    name: input.roomName.trim(),
    inviteToken: creatId(),
    adminParticipantId,
    createdAt: now,
  };

  const participantPayload: SpaceReservationParticipantRow = {
    id: adminParticipantId,
    roomId,
    grade: input.grade.trim(),
    className: input.className.trim(),
    joinedAt: now,
    role: 'admin',
  };

  const { error: roomError } = await supabase
    .from(SPACE_RESERVATION_TABLES.ROOMS)
    .insert(roomPayload);

  if (roomError) {
    throw new Error(roomError.message);
  }

  const { error: participantError } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .insert(participantPayload);

  if (participantError) {
    throw new Error(participantError.message);
  }

  return {
    room: roomPayload,
    participant: participantPayload,
  };
};

export const getSpaceReservationRoomById = async (roomId: string) => {
  const { data, error } = await supabase
    .from(SPACE_RESERVATION_TABLES.ROOMS)
    .select('*')
    .eq('id', roomId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;
  return toRoom(data as SpaceReservationRoomRow);
};

export const getSpaceReservationParticipants = async (roomId: string) => {
  const { data, error } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .select('*')
    .eq('roomId', roomId)
    .is('kickedAt', null)
    .order('joinedAt', { ascending: true })
    .returns<SpaceReservationParticipantRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toParticipant);
};

export const getSpaceReservationReservations = async (
  roomId: string,
  range?: DateRange,
) => {
  let query = supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .select('*')
    .eq('roomId', roomId);

  if (range) {
    query = query
      .gte('dateKey', range.startDateKey)
      .lte('dateKey', range.endDateKey);
  }

  const { data, error } =
    await query.returns<SpaceReservationReservationRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toReservation);
};

export const getSpaceReservationReservationsByRoomIds = async (
  roomIds: string[],
  range: DateRange,
) => {
  if (roomIds.length === 0) return [];

  const { data, error } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .select('*')
    .in('roomId', roomIds)
    .gte('dateKey', range.startDateKey)
    .lte('dateKey', range.endDateKey)
    .returns<SpaceReservationReservationRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toReservation);
};

export const getSpaceReservationBans = async (roomId: string) => {
  const { data, error } = await supabase
    .from(SPACE_RESERVATION_TABLES.BANS)
    .select('*')
    .eq('roomId', roomId)
    .order('createdAt', { ascending: false })
    .returns<SpaceReservationBanRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toBan);
};

export const deleteSpaceReservationBan = async (banId: string) => {
  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.BANS)
    .delete()
    .eq('id', banId);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateSpaceReservationRoomName = async (input: {
  roomId: string;
  name: string;
}) => {
  const nextName = input.name.trim();
  if (!nextName) {
    return { ok: false as const, reason: 'INVALID_NAME' };
  }

  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.ROOMS)
    .update({ name: nextName })
    .eq('id', input.roomId);

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const, name: nextName };
};

export const getSpaceReservationParticipantById = async (
  participantId: string,
) => {
  const { data, error } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .select('*')
    .eq('id', participantId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;

  return toParticipant(data as SpaceReservationParticipantRow);
};

export const transferSpaceReservationAdmin = async (input: {
  roomId: string;
  fromParticipantId: string;
  toParticipantId: string;
}) => {
  if (input.fromParticipantId === input.toParticipantId) {
    return { ok: false as const, reason: 'SAME_PARTICIPANT' };
  }

  const [room, nextAdmin] = await Promise.all([
    getSpaceReservationRoomById(input.roomId),
    getSpaceReservationParticipantById(input.toParticipantId),
  ]);

  if (!room || room.adminParticipantId !== input.fromParticipantId) {
    return { ok: false as const, reason: 'NOT_ADMIN' };
  }
  if (!nextAdmin || nextAdmin.roomId !== input.roomId || nextAdmin.kickedAt) {
    return { ok: false as const, reason: 'INVALID_PARTICIPANT' };
  }

  const { error: roomError } = await supabase
    .from(SPACE_RESERVATION_TABLES.ROOMS)
    .update({ adminParticipantId: input.toParticipantId })
    .eq('id', input.roomId);

  if (roomError) {
    throw new Error(roomError.message);
  }

  const { error: previousAdminError } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .update({ role: 'member' })
    .eq('id', input.fromParticipantId);

  if (previousAdminError) {
    throw new Error(previousAdminError.message);
  }

  const { error: nextAdminError } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .update({ role: 'admin' })
    .eq('id', input.toParticipantId);

  if (nextAdminError) {
    throw new Error(nextAdminError.message);
  }

  return { ok: true as const };
};

export const updateSpaceReservationParticipantGradeClass = async (input: {
  participantId: string;
  grade: string;
  className: string;
}) => {
  const trimmedGrade = input.grade.trim();
  const trimmedClassName = input.className.trim();

  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .update({
      grade: trimmedGrade,
      className: trimmedClassName,
    })
    .eq('id', input.participantId);

  if (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      return { ok: false as const, reason: 'GRADE_CLASS_TAKEN' };
    }
    throw new Error(error.message);
  }

  const { error: reservationError } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .update({
      grade: trimmedGrade,
      className: trimmedClassName,
    })
    .eq('createdByParticipantId', input.participantId);

  if (reservationError) {
    throw new Error(reservationError.message);
  }

  return { ok: true as const };
};

export const joinSpaceReservationRoom = async (input: {
  roomId: string;
  inviteToken: string;
  grade: string;
  className: string;
}) => {
  const room = await getSpaceReservationRoomById(input.roomId);
  if (!room) {
    return { ok: false as const, reason: 'ROOM_NOT_FOUND' };
  }
  if (room.inviteToken !== input.inviteToken) {
    return { ok: false as const, reason: 'INVITE_TOKEN_INVALID' };
  }

  const trimmedGrade = input.grade.trim();
  const trimmedClassName = input.className.trim();

  const { data: bannedPair, error: banError } = await supabase
    .from(SPACE_RESERVATION_TABLES.BANS)
    .select('id')
    .eq('roomId', room.id)
    .eq('grade', trimmedGrade)
    .eq('className', trimmedClassName)
    .maybeSingle();

  if (banError) {
    throw new Error(banError.message);
  }
  if (bannedPair) {
    return { ok: false as const, reason: 'BLOCKED_PARTICIPANT' };
  }

  const participantPayload: SpaceReservationParticipantRow = {
    id: creatId(),
    roomId: room.id,
    grade: trimmedGrade,
    className: trimmedClassName,
    joinedAt: new Date().toISOString(),
    role: 'member',
  };

  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .insert(participantPayload);

  if (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      return { ok: false as const, reason: 'GRADE_CLASS_TAKEN' };
    }
    throw new Error(error.message);
  }

  return {
    ok: true as const,
    room,
    participant: participantPayload,
  };
};

export const createSpaceReservation = async (input: {
  roomId: string;
  dateKey: string;
  period: SpaceReservationPeriod;
  grade: string;
  className: string;
  purpose: string;
  createdByParticipantId: string;
}) => {
  if (input.dateKey < getDateKey()) {
    return { ok: false as const, reason: 'PAST_DATE' };
  }

  const weekday = resolveWeekday(input.dateKey);
  if (!weekday) {
    return { ok: false as const, reason: 'WEEKDAY_ONLY' };
  }

  const period = Number(input.period) as SpaceReservationPeriod;
  if (!SPACE_RESERVATION_PERIODS.includes(period)) {
    return { ok: false as const, reason: 'INVALID_PERIOD' };
  }

  const reservationPayload: SpaceReservationReservationRow = {
    id: creatId(),
    roomId: input.roomId,
    dateKey: input.dateKey,
    weekday,
    period,
    grade: input.grade.trim(),
    className: input.className.trim(),
    purpose: input.purpose.trim(),
    createdByParticipantId: input.createdByParticipantId,
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .insert(reservationPayload);

  if (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      return { ok: false as const, reason: 'DUPLICATED' };
    }
    throw new Error(error.message);
  }

  return { ok: true as const, reservation: reservationPayload };
};

export const updateSpaceReservation = async (input: {
  reservationId: string;
  dateKey: string;
  period: SpaceReservationPeriod;
  purpose: string;
}) => {
  if (input.dateKey < getDateKey()) {
    return { ok: false as const, reason: 'PAST_DATE' };
  }

  const weekday = resolveWeekday(input.dateKey);
  if (!weekday) {
    return { ok: false as const, reason: 'WEEKDAY_ONLY' };
  }

  const period = Number(input.period) as SpaceReservationPeriod;
  if (!SPACE_RESERVATION_PERIODS.includes(period)) {
    return { ok: false as const, reason: 'INVALID_PERIOD' };
  }

  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .update({
      dateKey: input.dateKey,
      weekday,
      period,
      purpose: input.purpose.trim(),
    })
    .eq('id', input.reservationId);

  if (error) {
    if (error.code === UNIQUE_VIOLATION_CODE) {
      return { ok: false as const, reason: 'DUPLICATED' };
    }
    throw new Error(error.message);
  }

  return { ok: true as const };
};

export const deleteSpaceReservation = async (reservationId: string) => {
  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .delete()
    .eq('id', reservationId);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteSpaceReservationByParticipant = async (
  roomId: string,
  participantId: string,
) => {
  const { error } = await supabase
    .from(SPACE_RESERVATION_TABLES.RESERVATIONS)
    .delete()
    .eq('roomId', roomId)
    .eq('createdByParticipantId', participantId);

  if (error) {
    throw new Error(error.message);
  }
};

export const kickSpaceReservationParticipant = async (input: {
  roomId: string;
  participantId: string;
}) => {
  const participant = await getSpaceReservationParticipantById(
    input.participantId,
  );
  if (!participant || participant.roomId !== input.roomId) {
    return false;
  }
  if (!participant.grade || !participant.className) {
    return false;
  }

  const kickedAt = new Date().toISOString();

  const { error: participantError } = await supabase
    .from(SPACE_RESERVATION_TABLES.PARTICIPANTS)
    .update({ kickedAt })
    .eq('id', input.participantId);

  if (participantError) {
    throw new Error(participantError.message);
  }

  const { error: banError } = await supabase
    .from(SPACE_RESERVATION_TABLES.BANS)
    .insert({
      id: creatId(),
      roomId: input.roomId,
      grade: participant.grade,
      className: participant.className,
      createdAt: kickedAt,
    });

  if (banError && banError.code !== UNIQUE_VIOLATION_CODE) {
    throw new Error(banError.message);
  }

  await deleteSpaceReservationByParticipant(input.roomId, input.participantId);
  return true;
};
