import prisma from "../prismaClient.js";

/**
 * 목록 조회: 정렬/페이징 옵션에 따라 Study 배열 반환
 * 지원되는 order 값: 'newest' | 'oldest' | 'points' | 'points_desc' | 'points_asc'
 */
export async function listStudies({ offset = 0, limit = 10, order = "newest" } = {}) {
  const offsetNum = Number.parseInt(offset) || 0;
  const limitNum = Number.parseInt(limit) || 10;

  switch (order) {
    case "oldest":
      return prisma.study.findMany({
        orderBy: { createdAt: "asc" },
        skip: offsetNum,
        take: limitNum,
      });

    case "points":
    case "points_desc": {
      const grouped = await prisma.point.groupBy({
        by: ["studyId"],
        _sum: { point: true },
        orderBy: { _sum: { point: "desc" } },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = grouped.map((g) => g.studyId);
      if (ids.length === 0) return [];

      const studies = await prisma.study.findMany({ where: { id: { in: ids } } });
      const map = new Map(studies.map((s) => [s.id, s]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    }

    case "points_asc": {
      const grouped = await prisma.point.groupBy({
        by: ["studyId"],
        _sum: { point: true },
        orderBy: { _sum: { point: "asc" } },
        skip: offsetNum,
        take: limitNum,
      });
      const ids = grouped.map((g) => g.studyId);
      if (ids.length === 0) return [];

      const studies = await prisma.study.findMany({ where: { id: { in: ids } } });
      const map = new Map(studies.map((s) => [s.id, s]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    }

    case "newest":
    default:
      return prisma.study.findMany({
        orderBy: { createdAt: "desc" },
        skip: offsetNum,
        take: limitNum,
      });
  }
}
