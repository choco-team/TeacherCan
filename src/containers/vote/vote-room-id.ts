const UUID_PATTERN =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;

export const normalizeVoteRoomId = (rawRoomId: string) => {
  const matchedUuid = rawRoomId.match(UUID_PATTERN);
  return matchedUuid?.[0] ?? rawRoomId;
};

export const isUuid = (value: string) => UUID_PATTERN.test(value);
