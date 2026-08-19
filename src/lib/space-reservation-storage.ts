'use client';

/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */

import { creatId } from '@/utils/createNanoid';
import {
  SPACE_RESERVATION_PERIODS,
  SPACE_RESERVATION_WEEKDAY_KEYS,
  SpaceReservationBan,
  SpaceReservationInviteSeed,
  SpaceReservationMembership,
  SpaceReservationParticipant,
  SpaceReservationPeriod,
  SpaceReservationReservation,
  SpaceReservationRoom,
  SpaceReservationWeekday,
} from '@/types/space-reservation';

const STORAGE_KEYS = {
  ROOMS: 'space-reservation-rooms',
  PARTICIPANTS: 'space-reservation-participants',
  RESERVATIONS: 'space-reservation-reservations',
  MEMBERSHIPS: 'space-reservation-memberships',
  BANS: 'space-reservation-bans',
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

function upsertRoomSeed(seed: SpaceReservationInviteSeed) {
  const rooms = getRooms();
  const hasRoom = rooms.some((room) => room.id === seed.room.id);
  if (!hasRoom) {
    saveRooms([...rooms, seed.room]);
  }

  const participants = getParticipants();
  const participantMap = new Map(participants.map((item) => [item.id, item]));
  seed.participants.forEach((participant) => {
    participantMap.set(participant.id, participant);
  });
  saveParticipants([...participantMap.values()]);

  const reservations = getReservations();
  const reservationMap = new Map(reservations.map((item) => [item.id, item]));
  seed.reservations.forEach((reservation) => {
    reservationMap.set(reservation.id, reservation);
  });
  saveReservations([...reservationMap.values()]);

  const bans = getBans();
  if (!bans.some((ban) => ban.roomId === seed.room.id)) {
    saveBans([...bans, { roomId: seed.room.id, participantIds: [] }]);
  }
}

export function getRooms() {
  return safeRead<SpaceReservationRoom[]>(STORAGE_KEYS.ROOMS, []);
}

export function saveRooms(value: SpaceReservationRoom[]) {
  safeWrite(STORAGE_KEYS.ROOMS, value);
}

export function getParticipants() {
  return safeRead<SpaceReservationParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
}

export function saveParticipants(value: SpaceReservationParticipant[]) {
  safeWrite(STORAGE_KEYS.PARTICIPANTS, value);
}

export function getReservations() {
  return safeRead<SpaceReservationReservation[]>(STORAGE_KEYS.RESERVATIONS, []);
}

export function saveReservations(value: SpaceReservationReservation[]) {
  safeWrite(STORAGE_KEYS.RESERVATIONS, value);
}

export function getMemberships() {
  return safeRead<SpaceReservationMembership[]>(STORAGE_KEYS.MEMBERSHIPS, []);
}

export function saveMemberships(value: SpaceReservationMembership[]) {
  safeWrite(STORAGE_KEYS.MEMBERSHIPS, value);
}

export function getBans() {
  return safeRead<SpaceReservationBan[]>(STORAGE_KEYS.BANS, []);
}

export function saveBans(value: SpaceReservationBan[]) {
  safeWrite(STORAGE_KEYS.BANS, value);
}

export function createRoom(input: {
  roomName: string;
  grade: string;
  className: string;
}) {
  const now = new Date().toISOString();
  const roomId = creatId();
  const adminParticipantId = creatId();
  const room: SpaceReservationRoom = {
    id: roomId,
    name: input.roomName.trim(),
    inviteToken: creatId(),
    adminParticipantId,
    createdAt: now,
  };
  const participant: SpaceReservationParticipant = {
    id: adminParticipantId,
    roomId,
    grade: input.grade.trim(),
    className: input.className.trim(),
    joinedAt: now,
    role: 'admin',
  };
  const ban: SpaceReservationBan = {
    roomId,
    participantIds: [],
  };

  saveRooms([...getRooms(), room]);
  saveParticipants([...getParticipants(), participant]);
  saveBans([...getBans(), ban]);
  upsertMembership(roomId, adminParticipantId);

  return { room, participant };
}

export function getRoomById(roomId: string) {
  return getRooms().find((room) => room.id === roomId) ?? null;
}

export function getRoomParticipants(roomId: string) {
  return getParticipants()
    .filter(
      (participant) => participant.roomId === roomId && !participant.kickedAt,
    )
    .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1));
}

export function getRoomReservations(roomId: string) {
  return getReservations().filter(
    (reservation) => reservation.roomId === roomId,
  );
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

function getOrCreateRoomBan(roomId: string) {
  const bans = getBans();
  const found = bans.find((ban) => ban.roomId === roomId);
  if (found) return found;

  const nextBan: SpaceReservationBan = {
    roomId,
    participantIds: [],
  };
  saveBans([...bans, nextBan]);

  return nextBan;
}

export function isBlockedParticipant(
  roomId: string,
  input: { participantId?: string },
) {
  const ban = getOrCreateRoomBan(roomId);
  return input.participantId
    ? ban.participantIds.includes(input.participantId)
    : false;
}

export function joinRoom(input: {
  roomId: string;
  inviteToken: string;
  grade: string;
  className: string;
  seed?: string;
}) {
  if (input.seed) {
    const decoded = decodeInviteSeed(input.seed);
    if (decoded) {
      upsertRoomSeed(decoded);
    }
  }

  const room = getRoomById(input.roomId);
  if (!room) {
    return { ok: false as const, reason: 'ROOM_NOT_FOUND' };
  }
  if (room.inviteToken !== input.inviteToken) {
    return { ok: false as const, reason: 'INVITE_TOKEN_INVALID' };
  }

  const trimmedGrade = input.grade.trim();
  const trimmedClassName = input.className.trim();

  const roomParticipants = getRoomParticipants(room.id);
  const hasDuplicatedGradeClass = roomParticipants.some(
    (participant) =>
      participant.grade?.trim() === trimmedGrade &&
      participant.className?.trim() === trimmedClassName,
  );

  if (hasDuplicatedGradeClass) {
    return { ok: false as const, reason: 'GRADE_CLASS_TAKEN' };
  }

  const newParticipant: SpaceReservationParticipant = {
    id: creatId(),
    roomId: room.id,
    grade: trimmedGrade,
    className: trimmedClassName,
    joinedAt: new Date().toISOString(),
    role: 'member',
  };
  saveParticipants([...getParticipants(), newParticipant]);
  upsertMembership(room.id, newParticipant.id);

  return {
    ok: true as const,
    room,
    participant: newParticipant,
  };
}

export function getCurrentParticipant(roomId: string) {
  const membership = getMembership(roomId);
  if (!membership) return null;

  const participant = getParticipants().find(
    (item) => item.id === membership.participantId,
  );

  if (!participant || participant.kickedAt) return null;
  if (isBlockedParticipant(roomId, { participantId: participant.id }))
    return null;

  return participant;
}

export function kickParticipant(input: {
  roomId: string;
  participantId: string;
}) {
  const participants = getParticipants();
  const targetIndex = participants.findIndex(
    (participant) =>
      participant.id === input.participantId &&
      participant.roomId === input.roomId,
  );
  if (targetIndex < 0) return false;

  const nextParticipants = [...participants];
  nextParticipants[targetIndex] = {
    ...nextParticipants[targetIndex],
    kickedAt: new Date().toISOString(),
  };
  saveParticipants(nextParticipants);

  const bans = getBans();
  const banIndex = bans.findIndex((ban) => ban.roomId === input.roomId);

  if (banIndex < 0) {
    saveBans([
      ...bans,
      {
        roomId: input.roomId,
        participantIds: [input.participantId],
      },
    ]);
  } else {
    const nextBans = [...bans];
    const currentBan = nextBans[banIndex];
    nextBans[banIndex] = {
      ...currentBan,
      participantIds: [
        ...new Set([...currentBan.participantIds, input.participantId]),
      ],
    };
    saveBans(nextBans);
  }

  const membership = getMembership(input.roomId);
  if (membership?.participantId === input.participantId) {
    removeMembership(input.roomId);
  }
  removeReservationsByParticipant(input.roomId, input.participantId);
  return true;
}

export function removeReservationsByParticipant(
  roomId: string,
  participantId: string,
) {
  const reservations = getReservations();
  saveReservations(
    reservations.filter(
      (reservation) =>
        !(
          reservation.roomId === roomId &&
          reservation.createdByParticipantId === participantId
        ),
    ),
  );
}

export function createReservation(input: {
  roomId: string;
  dateKey: string;
  period: SpaceReservationPeriod;
  grade: string;
  className: string;
  purpose: string;
  createdByParticipantId: string;
}) {
  const date = new Date(`${input.dateKey}T00:00:00`);
  const day = date.getDay();
  if (day < 1 || day > 5) {
    return { ok: false as const, reason: 'WEEKDAY_ONLY' };
  }

  const period = Number(input.period) as SpaceReservationPeriod;
  if (!SPACE_RESERVATION_PERIODS.includes(period)) {
    return { ok: false as const, reason: 'INVALID_PERIOD' };
  }

  const duplicate = getReservations().find(
    (reservation) =>
      reservation.roomId === input.roomId &&
      reservation.dateKey === input.dateKey &&
      reservation.period === period,
  );
  if (duplicate) {
    return { ok: false as const, reason: 'DUPLICATED' };
  }

  const weekday = SPACE_RESERVATION_WEEKDAY_KEYS[
    day - 1
  ] as SpaceReservationWeekday;
  const nextReservation: SpaceReservationReservation = {
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

  saveReservations([...getReservations(), nextReservation]);
  return { ok: true as const, reservation: nextReservation };
}

export function deleteReservation(reservationId: string) {
  const reservations = getReservations();
  saveReservations(
    reservations.filter((reservation) => reservation.id !== reservationId),
  );
}

export function buildInviteSeed(roomId: string) {
  const room = getRoomById(roomId);
  if (!room) return null;

  const seed: SpaceReservationInviteSeed = {
    room,
    participants: getRoomParticipants(roomId),
    reservations: getRoomReservations(roomId),
    generatedAt: new Date().toISOString(),
  };

  return encodeInviteSeed(seed);
}

export function buildInviteLink(input: {
  origin: string;
  roomId: string;
  inviteToken: string;
  seed?: string | null;
}) {
  const baseUrl = `${input.origin}/space-reservation/join/${input.roomId}?invite=${input.inviteToken}`;
  if (!input.seed) return baseUrl;

  return `${baseUrl}&seed=${encodeURIComponent(input.seed)}`;
}

function encodeInviteSeed(seed: SpaceReservationInviteSeed) {
  try {
    const jsonValue = JSON.stringify(seed);
    return btoa(unescape(encodeURIComponent(jsonValue)));
  } catch (error) {
    console.error(error);
    return '';
  }
}

export function decodeInviteSeed(rawSeed: string) {
  if (!rawSeed) return null;
  try {
    const json = decodeURIComponent(escape(atob(rawSeed)));
    return JSON.parse(json) as SpaceReservationInviteSeed;
  } catch (error) {
    console.error(error);
    return null;
  }
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
    const weekday = SPACE_RESERVATION_WEEKDAY_KEYS[index];

    return {
      weekday,
      date,
      dateKey: getTodayISODateKey(date),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
    };
  });
}
