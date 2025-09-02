import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

// ---- helpers used for list ----
const buildSumMap = (grouped) => new Map(grouped.map((g) => [g.studyId, g._sum.point || 0]));
const attachTotalPoints = (studies, sumMap) => studies.map((s) => ({ ...s, totalPoints: sumMap.get(s.id) ?? 0 }));
const orderByIds = (studies, ids) => {
  const map = new Map(studies.map((s) => [s.id, s]));
  return ids.map((id) => map.get(id)).filter(Boolean);
};

export async function listStudies({ offset = 0, limit = 10, order = 'newest' } = {}) {
  const offsetNum = Number.parseInt(offset) || 0;
  const limitNum = Number.parseInt(limit) || 10;

  switch (order) {
    case 'oldest': {
      const studies = await prisma.study.findMany({
        orderBy: { createdAt: 'asc' },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = studies.map((s) => s.id);
      if (ids.length === 0) return [];
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        where: { studyId: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);
      return attachTotalPoints(studies, sumMap);
    }
    case 'points':
    case 'points_desc': {
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        orderBy: { _sum: { point: 'desc' } },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = grouped.map((g) => g.studyId);
      if (ids.length === 0) return [];
      const studies = await prisma.study.findMany({ where: { id: { in: ids } } });
      const sumMap = buildSumMap(grouped);
      const ordered = orderByIds(studies, ids);
      return attachTotalPoints(ordered, sumMap);
    }
    case 'points_asc': {
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        orderBy: { _sum: { point: 'asc' } },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = grouped.map((g) => g.studyId);
      if (ids.length === 0) return [];
      const studies = await prisma.study.findMany({ where: { id: { in: ids } } });
      const sumMap = buildSumMap(grouped);
      const ordered = orderByIds(studies, ids);
      return attachTotalPoints(ordered, sumMap);
    }
    case 'newest':
    default: {
      const studies = await prisma.study.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = studies.map((s) => s.id);
      if (ids.length === 0) return [];
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        where: { studyId: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);
      return attachTotalPoints(studies, sumMap);
    }
  }
}

export async function getStudyById(id) {
  const study = await prisma.study.findUniqueOrThrow({ where: { id } });
  const point = await prisma.point.aggregate({ where: { studyId: id }, _sum: { point: true } });
  return { ...study, totalPoints: point._sum.point || 0 };
}

export async function createStudy(data) {
  const { password, ...rest } = data;
  const hashed = await bcrypt.hash(password, 10);
  return prisma.study.create({ data: { ...rest, password: hashed } });
}

export async function updateStudy(id, data) {
  const payload = { ...data };
  if (payload.password !== undefined) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  return prisma.study.update({ where: { id }, data: payload });
}

export async function deleteStudy(id) {
  await prisma.study.delete({ where: { id } });
}
