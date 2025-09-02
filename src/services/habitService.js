import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const getStudyWithPassword = async (studyId) => {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true, password: true },
  });
};

export const verifyStudyPassword = async (studyId, password) => {
  if (!password) {
    const e = new Error("PASSWORD_REQUIRED");
    e.status = 400;
    throw e;
  }

  const study = await getStudyWithPassword(studyId);
  if (!study) {
    const e = new Error("STUDY_NOT_FOUND");
    e.status = 404;
    throw e;
  }

  // bcrypt 사용
  const ok = await bcrypt.compare(password, study.password);

  if (!ok) {
    const e = new Error("PASSWORD_MISMATCH");
    e.status = 401;
    throw e;
  }

  return study;
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
