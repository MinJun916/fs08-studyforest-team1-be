import * as s from 'superstruct';
import isUuid from 'is-uuid';

const Uuid = s.define('Uuid', (value) => isUuid.v4(value));

export const CreateEmoji = s.object({
  studyId: Uuid,
  // emojiType stored as hex code like '1f44d' or combined '1f44d-1f3fb'
  emojiType: s.size(s.string(), 1, 255),
  count: s.optional(s.integer()),
});

export const PatchEmoji = s.partial(CreateEmoji);
