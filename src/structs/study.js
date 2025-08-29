import * as s from 'superstruct';
import isUuid from 'is-uuid';

const BACKGROUNDIMG = [
  'green',  // #E1EDDE
  'yellow', // #FFF1CC
  'blue',   // #E0F1F5 
  'pink',   // #FDE0E9
  'alvaro', // 이미지1
  'mikey',  // 이미지2
  'andrew', // 이미지3
  'chris',  // 이미지4
];

const Uuid = s.define('Uuid', (value) => isUuid.v4(value));

export const CreateStudy = s.object({
  nickName: s.size(s.string(), 1, 15),
  studyName: s.size(s.string(), 1, 40),
  description: s.optional(s.size(s.string(), 0, 2000)),
  backgroundImg: s.optional(s.enums(BACKGROUNDIMG)),
  password: s.size(s.string(), 1, 255),
});

export const PatchStudy = s.partial(CreateStudy);

