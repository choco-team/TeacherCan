'use client';

import {
  SPACE_RESERVATION_WEEKDAY_KEYS,
  SpaceReservationMembership,
  SpaceReservationPeriod,
  SpaceReservationWeekday,
} from '@/types/space-reservation';
import {
  createSpaceReservation,
  createSpaceReservationRoom,
  deleteSpaceReservation,
  getSpaceReservationParticipantById,
  getSpaceReservationParticipants,
  getSpaceReservationReservations,
  getSpaceReservationRoomById,
  joinSpaceReservationRoom,
  kickSpaceReservationParticipant,
} from '@/apis/space-reservation/space-reservation';

const STORAGE_KEYS = {
  MEMBERSHIPS: 'space-reservation-memberships',
} as const;

function getTodayISODateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

export const getRoomReservations = async (roomId: string) => {
  return getSpaceReservationReservations(roomId);
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

export const deleteReservation = async (reservationId: string) => {
  return deleteSpaceReservation(reservationId);
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

export function buildInviteSeed() {
  return null;
}

export function buildInviteLink(input: {
  origin: string;
  roomId: string;
  inviteToken: string;
}) {
  return `${input.origin}/space-reservation/join/${input.roomId}?invite=${input.inviteToken}`;
}

export function decodeInviteSeed() {
  return null;
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
