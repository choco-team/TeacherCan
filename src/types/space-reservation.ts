export const SPACE_RESERVATION_PERIODS = [1, 2, 3, 4, 5, 6] as const;

export const SPACE_RESERVATION_WEEKDAY_KEYS = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
] as const;

export type SpaceReservationWeekday =
  (typeof SPACE_RESERVATION_WEEKDAY_KEYS)[number];
export type SpaceReservationPeriod = (typeof SPACE_RESERVATION_PERIODS)[number];

export type SpaceReservationRole = 'admin' | 'member';

export interface SpaceReservationRoom {
  id: string;
  name: string;
  inviteToken: string;
  adminParticipantId: string;
  createdAt: string;
}

export interface SpaceReservationParticipant {
  id: string;
  roomId: string;
  grade?: string;
  className?: string;
  joinedAt: string;
  role: SpaceReservationRole;
  kickedAt?: string;
}

export interface SpaceReservationReservation {
  id: string;
  roomId: string;
  dateKey: string;
  weekday: SpaceReservationWeekday;
  period: SpaceReservationPeriod;
  grade: string;
  className: string;
  purpose: string;
  createdByParticipantId: string;
  createdAt: string;
}

export interface SpaceReservationMembership {
  roomId: string;
  participantId: string;
  lastVisitedAt: string;
}

export interface SpaceReservationBan {
  roomId: string;
  participantIds: string[];
}

export interface SpaceReservationInviteSeed {
  room: SpaceReservationRoom;
  participants: SpaceReservationParticipant[];
  reservations: SpaceReservationReservation[];
  generatedAt: string;
}
