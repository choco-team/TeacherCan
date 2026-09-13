import {
  SpaceReservationBan,
  SpaceReservationParticipant,
  SpaceReservationReservation,
  SpaceReservationRoom,
} from '@/types/space-reservation';

export const SPACE_RESERVATION_TABLES = {
  ROOMS: 'space_reservation_rooms',
  PARTICIPANTS: 'space_reservation_participants',
  RESERVATIONS: 'space_reservation_reservations',
  BANS: 'space_reservation_bans',
} as const;

export type SpaceReservationRoomRow = SpaceReservationRoom;
export type SpaceReservationParticipantRow = SpaceReservationParticipant;
export type SpaceReservationReservationRow = SpaceReservationReservation;

export type SpaceReservationBanRow = SpaceReservationBan;
