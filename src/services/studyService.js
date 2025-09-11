import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

// ---- helpers used for list ----
const buildSumMap = (grouped) => new Map(grouped.map((g) => [g.studyId, g._sum.point || 0]));
const attachTotalPoints = (studies, sumMap) =>
  studies.map((s) => ({ ...s, totalPoints: sumMap.get(s.id) ?? 0 }));
const orderByIds = (studies, ids) => {
  const map = new Map(studies.map((s) => [s.id, s]));
  return ids.map((id) => map.get(id)).filter(Boolean);
};
const attachEmojis = async (studies) => {
  const studyIds = studies.map((s) => s.id);
  if (studyIds.length === 0) return studies;

  const emojis = await prisma.emoji.findMany({
    where: { studyId: { in: studyIds } },
    orderBy: [{ count: 'desc' }, { updatedAt: 'desc' }],
  });

  const emojiMap = new Map();
  emojis.forEach((emoji) => {
    if (!emojiMap.has(emoji.studyId)) {
      emojiMap.set(emoji.studyId, []);
    }
    emojiMap.get(emoji.studyId).push(emoji);
  });

  return studies.map((study) => ({
    ...study,
    emojis: emojiMap.get(study.id) || [],
  }));
};

export async function listStudies({ offset = 0, limit = 10, order = 'newest' } = {}) {
  const offsetNum = Number.parseInt(offset) || 0;
  const limitNum = Number.parseInt(limit) || 10;

  // 전체 스터디 개수 계산
  const totalCount = await prisma.study.count();

  switch (order) {
    case 'oldest': {
      const studies = await prisma.study.findMany({
        orderBy: { createdAt: 'asc' },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = studies.map((s) => s.id);
      if (ids.length === 0) return { studies: [], totalCount };
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        where: { studyId: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);
      const studiesWithPoints = attachTotalPoints(studies, sumMap);
      const studiesWithEmojis = await attachEmojis(studiesWithPoints);
      return { studies: studiesWithEmojis, totalCount };
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
      if (ids.length === 0) return { studies: [], totalCount };
      const studies = await prisma.study.findMany({
        where: { id: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);
      const ordered = orderByIds(studies, ids);

      const studiesWithPoints = attachTotalPoints(ordered, sumMap);
      const studiesWithEmojis = await attachEmojis(studiesWithPoints);
      return { studies: studiesWithEmojis, totalCount };
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
      if (ids.length === 0) return { studies: [], totalCount };
      const studies = await prisma.study.findMany({
        where: { id: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);
      const ordered = orderByIds(studies, ids);

      const studiesWithPoints = attachTotalPoints(ordered, sumMap);
      const studiesWithEmojis = await attachEmojis(studiesWithPoints);
      return { studies: studiesWithEmojis, totalCount };
    }
    case 'newest':
    default: {
      const studies = await prisma.study.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = studies.map((s) => s.id);
      if (ids.length === 0) return { studies: [], totalCount };
      const grouped = await prisma.point.groupBy({
        by: ['studyId'],
        _sum: { point: true },
        where: { studyId: { in: ids } },
      });
      const sumMap = buildSumMap(grouped);

      const studiesWithPoints = attachTotalPoints(studies, sumMap);
      const studiesWithEmojis = await attachEmojis(studiesWithPoints);
      return { studies: studiesWithEmojis, totalCount };
    }
  }
}

export async function getStudyById(id) {
  const study = await prisma.study.findUniqueOrThrow({ where: { id } });
  const point = await prisma.point.aggregate({
    where: { studyId: id },
    _sum: { point: true },
  });
  return { ...study, totalPoints: point._sum.point || 0 };
}

export async function createStudyAndPoint(data) {
  const { password, ...rest } = data;
  const hashed = await bcrypt.hash(password, 10);

  return prisma.study.create({
    data: { ...rest, password: hashed, points: { create: { point: 0 } } },
  });
}

export async function updateStudy(id, data) {
  const payload = { ...data };
  if (payload.password !== undefined) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  return prisma.study.update({ where: { id }, data: payload });
}

export async function updateStudyWithPassword(id, data, verifyPassword) {
  // 스터디 존재 및 비밀번호 조회
  const study = await prisma.study.findUnique({
    where: { id },
    select: { id: true, password: true },
  });
  if (!study) {
    const e = new Error('스터디를 찾을 수 없습니다.');
    e.code = 'NOT_FOUND';
    throw e;
  }

  // 요청 비밀번호 검증 (삭제 로직과 동일한 에러 코드/메시지 사용)
  const ok = await bcrypt.compare(verifyPassword, study.password);
  if (!ok) {
    const e = new Error('비밀번호가 일치하지 않습니다.');
    e.code = 'INVALID_PASSWORD';
    throw e;
  }

  // 수정 페이로드 구성 (비밀번호 변경은 지원하지 않음)
  const payload = { ...data };
  if (payload.password !== undefined) delete payload.password;

  return prisma.study.update({ where: { id }, data: payload });
}

export async function deleteStudyWithPassword(id, password) {
  const study = await prisma.study.findUnique({
    where: { id },
    select: { id: true, password: true },
  });
  if (!study) {
    const e = new Error('스터디를 찾을 수 없습니다.');
    e.code = 'NOT_FOUND';
    throw e;
  }

  const ok = await bcrypt.compare(password, study.password);
  if (!ok) {
    const e = new Error('비밀번호가 일치하지 않습니다.');
    e.code = 'INVALID_PASSWORD';
    throw e;
  }

  // 안전한 순서로 관련 레코드 정리 후 스터디 삭제
  await prisma.$transaction([
    prisma.habitCheck.deleteMany({ where: { studyId: id } }),
    prisma.habit.deleteMany({ where: { studyId: id } }),
    prisma.emoji.deleteMany({ where: { studyId: id } }),
    prisma.focus.deleteMany({ where: { studyId: id } }),
    prisma.point.deleteMany({ where: { studyId: id } }),
    prisma.study.delete({ where: { id } }),
  ]);
}
