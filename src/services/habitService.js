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
    select: { id: true, name: true },
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
