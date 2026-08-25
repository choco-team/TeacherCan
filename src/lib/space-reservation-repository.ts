'use client';

import {
  MyWeekReservationItem,
  SPACE_RESERVATION_WEEKDAY_KEYS,
  SpaceReservationDateRange,
  SpaceReservationMembership,
  SpaceReservationPeriod,
  SpaceReservationWeekday,
} from '@/types/space-reservation';
import {
  createSpaceReservation,
  createSpaceReservationRoom,
  deleteSpaceReservation,
  deleteSpaceReservationBan,
  getSpaceReservationBans,
  getSpaceReservationParticipantById,
  getSpaceReservationParticipants,
  getSpaceReservationReservations,
  getSpaceReservationReservationsByRoomIds,
  getSpaceReservationRoomById,
  joinSpaceReservationRoom,
  kickSpaceReservationParticipant,
  transferSpaceReservationAdmin,
  updateSpaceReservation,
  updateSpaceReservationParticipantGradeClass,
  updateSpaceReservationRoomName,
} from '@/apis/space-reservation/space-reservation';

const STORAGE_KEYS = {
  MEMBERSHIPS: 'space-reservation-memberships',
} as const;

export function getTodayISODateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isPastDateKey(
  dateKey: string,
  todayKey = getTodayISODateKey(),
) {
  return dateKey < todayKey;
}

export function isTodayDateKey(
  dateKey: string,
  todayKey = getTodayISODateKey(),
) {
  return dateKey === todayKey;
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return fallback;

    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

export function getMemberships() {
  return safeRead<SpaceReservationMembership[]>(STORAGE_KEYS.MEMBERSHIPS, []);
}

export function saveMemberships(value: SpaceReservationMembership[]) {
  safeWrite(STORAGE_KEYS.MEMBERSHIPS, value);
}

export function getMembership(roomId: string) {
  return getMemberships().find((item) => item.roomId === roomId) ?? null;
}

export function upsertMembership(roomId: string, participantId: string) {
  const memberships = getMemberships();
  const nextMembership: SpaceReservationMembership = {
    roomId,
    participantId,
    lastVisitedAt: new Date().toISOString(),
  };

  const index = memberships.findIndex((item) => item.roomId === roomId);
  if (index < 0) {
    saveMemberships([...memberships, nextMembership]);
    return;
  }

  const nextValue = [...memberships];
  nextValue[index] = nextMembership;
  saveMemberships(nextValue);
}

export function removeMembership(roomId: string) {
  const memberships = getMemberships();
  saveMemberships(
    memberships.filter((membership) => membership.roomId !== roomId),
  );
}

export const createRoom = async (input: {
  roomName: string;
  grade: string;
  className: string;
}) => {
  const created = await createSpaceReservationRoom(input);
  upsertMembership(created.room.id, created.participant.id);
  return created;
};

export const getRoomById = async (roomId: string) => {
  return getSpaceReservationRoomById(roomId);
};

export const getRoomParticipants = async (roomId: string) => {
  return getSpaceReservationParticipants(roomId);
};

export const getRoomReservations = async (
  roomId: string,
  range?: SpaceReservationDateRange,
) => {
  return getSpaceReservationReservations(roomId, range);
};

export const getRoomBans = async (roomId: string) => {
  return getSpaceReservationBans(roomId);
};

export const joinRoom = async (input: {
  roomId: string;
  inviteToken: string;
  grade: string;
  className: string;
}) => {
  const result = await joinSpaceReservationRoom(input);
  if (result.ok) {
    upsertMembership(result.room.id, result.participant.id);
  }
  return result;
};

export const getCurrentParticipant = async (roomId: string) => {
  const membership = getMembership(roomId);
  if (!membership) return null;

  const participant = await getSpaceReservationParticipantById(
    membership.participantId,
  );
  if (!participant || participant.kickedAt || participant.roomId !== roomId) {
    return null;
  }

  upsertMembership(roomId, participant.id);
  return participant;
};

export const createReservation = async (input: {
  roomId: string;
  dateKey: string;
  period: number;
  grade: string;
  className: string;
  purpose: string;
  createdByParticipantId: string;
}) => {
  return createSpaceReservation({
    ...input,
    period: input.period as SpaceReservationPeriod,
  });
};

export const updateReservation = async (input: {
  reservationId: string;
  dateKey: string;
  period: number;
  purpose: string;
}) => {
  return updateSpaceReservation({
    reservationId: input.reservationId,
    dateKey: input.dateKey,
    period: input.period as SpaceReservationPeriod,
    purpose: input.purpose,
  });
};

export const deleteReservation = async (reservationId: string) => {
  return deleteSpaceReservation(reservationId);
};

export const updateRoomName = async (input: {
  roomId: string;
  name: string;
}) => {
  return updateSpaceReservationRoomName(input);
};

export const transferAdmin = async (input: {
  roomId: string;
  fromParticipantId: string;
  toParticipantId: string;
}) => {
  return transferSpaceReservationAdmin(input);
};

export const updateMyGradeClass = async (input: {
  participantId: string;
  grade: string;
  className: string;
}) => {
  return updateSpaceReservationParticipantGradeClass(input);
};

export const unblockBan = async (banId: string) => {
  return deleteSpaceReservationBan(banId);
};

export const kickParticipant = async (input: {
  roomId: string;
  participantId: string;
}) => {
  const success = await kickSpaceReservationParticipant(input);
  if (success) {
    const membership = getMembership(input.roomId);
    if (membership?.participantId === input.participantId) {
      removeMembership(input.roomId);
    }
  }
  return success;
};

export function buildInviteLink(input: {
  origin: string;
  roomId: string;
  inviteToken: string;
}) {
  return `${input.origin}/space-reservation/join/${input.roomId}?invite=${input.inviteToken}`;
}

export function getWeekDates(weekOffset = 0) {
  const now = new Date();
  const monday = new Date(now);
  const diff = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const weekday = SPACE_RESERVATION_WEEKDAY_KEYS[
      index
    ] as SpaceReservationWeekday;

    return {
      weekday,
      date,
      dateKey: getTodayISODateKey(date),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
    };
  });
}

export function getWeekDateRange(weekOffset = 0): SpaceReservationDateRange {
  const weekDates = getWeekDates(weekOffset);

  return {
    startDateKey: weekDates[0].dateKey,
    endDateKey: weekDates[weekDates.length - 1].dateKey,
  };
}

export function formatWeekRangeLabel(weekOffset = 0) {
  const weekDates = getWeekDates(weekOffset);
  return `${weekDates[0].label} – ${weekDates[weekDates.length - 1].label}`;
}

export async function getMyWeekReservations(
  weekOffset = 0,
): Promise<MyWeekReservationItem[]> {
  const memberships = getMemberships();
  if (memberships.length === 0) return [];

  const range = getWeekDateRange(weekOffset);
  const participantIds = new Set(
    memberships.map((membership) => membership.participantId),
  );
  const roomIds = memberships.map((membership) => membership.roomId);

  const [rooms, reservations] = await Promise.all([
    Promise.all(roomIds.map((roomId) => getRoomById(roomId))),
    getSpaceReservationReservationsByRoomIds(roomIds, range),
  ]);

  const roomNameById = new Map(
    rooms
      .filter((room): room is NonNullable<typeof room> => room !== null)
      .map((room) => [room.id, room.name]),
  );

  return reservations
    .filter((reservation) =>
      participantIds.has(reservation.createdByParticipantId),
    )
    .map((reservation) => ({
      id: reservation.id,
      roomId: reservation.roomId,
      roomName: roomNameById.get(reservation.roomId) ?? '공간예약',
      dateKey: reservation.dateKey,
      weekday: reservation.weekday,
      period: reservation.period,
      purpose: reservation.purpose,
    }))
    .sort((left, right) => {
      if (left.dateKey !== right.dateKey) {
        return left.dateKey.localeCompare(right.dateKey);
      }
      return left.period - right.period;
    });
}
