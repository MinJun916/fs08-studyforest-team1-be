import prisma from '../lib/prisma.js';

export const getStudyWithPassword = async (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true, password: true },
  });
};

export const listAllHabits = () => {
  return prisma.habit.findMany();
};

export const listHabitsByStudy = (studyId) => {
  return prisma.habit.findMany({
    where: { studyId },
    select: { id: true, name: true, studyId: true, isDeleted: true },
  });
};

export const createHabit = async ({ studyId, name, startDate }) => {
  return prisma.habit.create({
    data: {
      name: name.trim(),
      startDate,
      study: { connect: { id: studyId } },
    },
  });
};

export const toggleHabitDeleted = async (habitId) => {
  // fetch current value
  const habit = await prisma.habit.findUnique({ where: { id: habitId }, select: { id: true, isDeleted: true } });
  if (!habit) {
    const e = new Error('HABIT_NOT_FOUND');
    e.status = 404;
    throw e;
  }
  return prisma.habit.update({ where: { id: habitId }, data: { isDeleted: !habit.isDeleted } });
};
