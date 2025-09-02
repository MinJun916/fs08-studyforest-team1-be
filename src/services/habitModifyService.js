import prisma from "../lib/prisma.js";
import dayjs from "../utils/dayjs.js";

const kstDateOnly = (d = dayjs()) =>
  new Date(dayjs(d).tz("Asia/Seoul").format("YYYY-MM-DD"));

const kstYesterdayDateOnly = () =>
  new Date(dayjs().tz("Asia/Seoul").subtract(1, "day").format("YYYY-MM-DD"));

const ensureStudy = async (studyId) => {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
  if (!study) throw new Error("NOT_FOUND_STUDY");
  return study;
};

const ensureHabit = async (habitId, studyId) => {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: {
      id: true,
      studyId: true,
      name: true,
      startDate: true,
      endDate: true,
    },
  });
  if (!habit) throw new Error("NOT_FOUND_HABIT");
  if (studyId && habit.studyId !== studyId) throw new Error("MISMATCH_STUDY");
  return habit;
};

// 이름 수정: 단일 Habit 엔티티의 이름 변경
export const renameHabit = async ({ habitId, studyId, name }) => {
  if (typeof name !== "string" || !name.trim()) throw new Error("INVALID_NAME");
  await ensureHabit(habitId, studyId);
  const habit = await prisma.habit.update({
    where: { id: habitId },
    data: { name: name.trim() },
    select: { id: true, name: true, studyId: true },
  });
  return habit;
};

// 오늘부터 종료: endDate를 KST 어제로 설정(포함 정책)
export const endHabitToday = async ({ habitId, studyId }) => {
  const habit = await ensureHabit(habitId, studyId);
  const endDate = kstYesterdayDateOnly();

  // 멱등 처리: 이미 어제/그 이전에 종료되어 있으면 그대로 둠
  if (habit.endDate && habit.endDate <= endDate) {
    return { id: habit.id, studyId: habit.studyId, endDate: habit.endDate };
  }

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: { endDate },
    select: { id: true, studyId: true, endDate: true },
  });
  return updated;
};

// 오늘부터 생성
export const createHabitToday = async ({ studyId, name }) => {
  if (typeof name !== "string" || !name.trim()) throw new Error("INVALID_NAME");
  await ensureStudy(studyId);
  const startDate = kstDateOnly();

  const habit = await prisma.habit.create({
    data: {
      name: name.trim(),
      startDate,
      study: { connect: { id: studyId } },
    },
    select: { id: true, name: true, startDate: true, studyId: true },
  });
  return habit;
};
