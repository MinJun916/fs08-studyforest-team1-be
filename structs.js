
import * as s from 'superstruct';
import isUuid from 'is-uuid';

// -------- 헬퍼 --------
export const Uuid = s.define('Uuid', (value) => typeof value === 'string' && isUuid.v4(value));

// YYYY-MM-DD (date 전용)
export const DateOnly = s.define('DateOnly', (value) => {
	if (typeof value !== 'string') return false;
	const m = value.match(/^\d{4}-\d{2}-\d{2}$/);
	if (!m) return false;
	const d = new Date(value + 'T00:00:00Z');
	// 유효 날짜 확인 (예: 2025-02-30 방지)
	const [y, mo, da] = value.split('-').map((v) => parseInt(v, 10));
	return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === mo && d.getUTCDate() === da;
});

// 정수 타입
export const Int = s.define('Int', (value) => Number.isInteger(value));

// 길이 제한 문자열 생성기
const bounded = (min, max) => s.size(s.string(), min, max);

// -------- Study --------
export const CreateStudy = s.object({
	nickName: bounded(1, 15),
	studyName: bounded(1, 40),
	description: s.optional(bounded(1, 200)),
	background: s.optional(bounded(1, 40)),
	password: s.optional(bounded(1, 255)),
});

// -------- Habit --------
export const CreateHabit = s.object({
	studyId: Uuid,
	startDate: DateOnly,
	endDate: s.optional(DateOnly),
	password: bounded(1, 255),
});

// -------- HabitCheck --------
export const CreateHabitCheck = s.object({
	habitId: Uuid,
	pointId: Uuid,
	studyId: Uuid,
	checkDate: DateOnly,
	isCompleted: s.optional(s.boolean()),
});

// -------- Focus --------
export const CreateFocus = s.object({
	studyId: Uuid,
	pointId: Uuid,
	time: s.optional(Int),
	point: s.optional(Int),
	isCompleted: s.optional(s.boolean()),
});

// -------- Point --------
export const CreatePoint = s.object({
	studyId: Uuid,
	point: s.optional(Int),
});

// -------- Emoji --------
export const CreateEmoji = s.object({
	studyId: Uuid,
	emojiType: s.optional(bounded(1, 255)),
	count: s.optional(Int),
});

// -------- 공통 ID 파라미터 스키마 --------
export const IdParam = s.object({ id: Uuid });
export const StudyIdParam = s.object({ studyId: Uuid });
export const HabitIdParam = s.object({ habitId: Uuid });
export const PointIdParam = s.object({ pointId: Uuid });
