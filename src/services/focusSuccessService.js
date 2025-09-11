import prisma from '../lib/prisma.js';

export const addFocusTime = async ({ studyId, focusTime }) => {
  // 집중시간 추가
  if (!studyId) {
    const e = new Error('STUDY_ID_REQUIRED');
    e.status = 400;
    throw e;
  }

  const minutes = Number(focusTime);
  if (Number.isNaN(minutes) || minutes < 0) {
    const e = new Error('FOCUS_TIME_MUST_BE_NON_NEGATIVE_NUMBER');
    e.status = 400;
    throw e;
  }

  // ensure study exists
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
  if (!study) {
    const e = new Error('STUDY_NOT_FOUND');
    e.status = 404;
    throw e;
  }

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.focus.findFirst({ where: { studyId } });
    if (!existing) {
      return tx.focus.create({
        data: {
          study: { connect: { id: studyId } },
          time: Math.floor(minutes),
        },
      });
    }

    return tx.focus.update({
      where: { id: existing.id },
      data: { time: existing.time + Math.floor(minutes) },
    });
  });

  return result;
};

export const addFocusPoint = async ({ studyId, focusPoint }) => {
  // 집중 포인트 추가
  if (!studyId) {
    const e = new Error('STUDY_ID_REQUIRED');
    e.status = 400;
    throw e;
  }
  const points = Number(focusPoint);
  if (Number.isNaN(points) || points < 0) {
    const e = new Error('FOCUS_POINT_MUST_BE_NON_NEGATIVE_NUMBER');
    e.status = 400;
    throw e;
  }

  // ensure study exists
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
  if (!study) {
    const e = new Error('STUDY_NOT_FOUND');
    e.status = 404;
    throw e;
  }

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.point.findUnique({ where: { studyId } });

    return tx.point.update({
      where: { id: existing.id },
      data: { point: existing.point + Math.floor(points) },
    });
  });

  return result;
};
