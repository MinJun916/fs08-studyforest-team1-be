import prisma from "../lib/prisma.js";
import dayjs from "../utils/dayjs.js";
import {
  kstStartOfToday,
  kstEndOfToday,
  kstThisWeekRange,
} from "../utils/dayjs-helpers.js";

// habit 유효성 검사
const checkHabit = async (studyId, habitId) => {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: { id: true, studyId: true, startDate: true, endDate: true },
  });

  if (!habit) throw new Error("NOT_FOUND_HABIT");
  if (habit.studyId !== studyId) throw new Error("MISMATCH_STUDY");

  return habit;
};

// 포인트 레코드 확보 (없으면 생성)
const getPoint = async (studyId) => {
  let point = await prisma.point.findFirst({
    where: { studyId },
    orderBy: { createdAt: "asc" },
    select: { id: true, point: true },
  });

  if (!point) {
    point = await prisma.point.create({
      data: { studyId, point: 0 },
      select: { id: true, point: true },
    });
  }

  return point;
};

const toggleToday = async ({ studyId, habitId }) => {
  await checkHabit(studyId, habitId);

  const todayDate = new Date(dayjs().tz("Asia/Seoul").format("YYYY-MM-DD"));

  // 트랜잭션: HabitCheck upsert + Point 증감
  const { habitCheck, pointTotal } = await prisma.$transaction(async (tx) => {
    const pointRow = await getPoint(studyId);

    const existing = await tx.habitCheck.findUnique({
      where: { unique_habit_day: { habitId, studyId, checkDate: todayDate } },
      select: { isCompleted: true },
    });

    let nextCompleted, delta;
    if (!existing) {
      nextCompleted = true;
      delta = +3;
    } else if (existing.isCompleted) {
      nextCompleted = false;
      delta = -3;
    } else {
      nextCompleted = true;
      delta = +3;
    }

    const habitCheck = await tx.habitCheck.upsert({
      where: { unique_habit_day: { habitId, studyId, checkDate: todayDate } },
      update: {
        isCompleted: nextCompleted,
        pointId: pointRow.id,
        checkDate: todayDate,
      },
      create: {
        habit: { connect: { id: habitId } },
        study: { connect: { id: studyId } },
        point: { connect: { id: pointRow.id } },
        isCompleted: true,
        checkDate: todayDate,
      },
      select: { id: true, isCompleted: true, checkDate: true },
    });

    if (delta !== 0) {
      await tx.point.update({
        where: { id: pointRow.id },
        data: { point: { increment: delta } },
      });
    }

    const pointTotalRow = await tx.point.findUnique({
      where: { id: pointRow.id },
      select: { point: true },
    });

    return { habitCheck, pointTotal: pointTotalRow.point };
  });

  return {
    ...habitCheck,
    checkDateKST: dayjs(habitCheck.checkDate)
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD"),
    pointTotal,
  };
};

export { toggleToday };
