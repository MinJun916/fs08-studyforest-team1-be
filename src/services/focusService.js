import prisma from "../lib/prisma.js";

export const getPointByStudy = async (studyId) => {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true, studyName: true },
  });

  const pointRow = await prisma.point.findFirst({
    where: { studyId },
    orderBy: { createdAt: "asc" },
    select: { id: true, point: true },
  });

  return {
    id: study.id,
    name: study.studyName,
    pointId: pointRow.id,
    point: pointRow.point,
  };
};
