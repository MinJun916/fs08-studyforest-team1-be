// 간단한 입력 유효성 검사 유틸 (superstruct 대체)

export class ValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ValidationError';
    this.status = status;
  }
}

export function requireString(obj, key, { min = 1, max = 255 } = {}) {
  const val = obj[key];
  if (typeof val !== 'string') throw new ValidationError(`${key} must be a string`);
  if (val.length < min) throw new ValidationError(`${key} length must be >= ${min}`);
  if (val.length > max) throw new ValidationError(`${key} length must be <= ${max}`);
}

export function optionalEnum(obj, key, values) {
  const val = obj[key];
  if (val === undefined) return;
  if (!values.includes(val)) throw new ValidationError(`${key} must be one of: ${values.join(', ')}`);
}

export function requireUuid(obj, key) {
  const val = obj[key];
  if (typeof val !== 'string') throw new ValidationError(`${key} must be a string`);
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4Regex.test(val)) throw new ValidationError(`${key} must be a valid UUID v4`);
}

export function optionalInteger(obj, key) {
  const val = obj[key];
  if (val === undefined) return;
  if (!Number.isInteger(val)) throw new ValidationError(`${key} must be an integer`);
}
