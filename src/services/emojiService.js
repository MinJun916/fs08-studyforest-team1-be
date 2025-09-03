import prisma from "../lib/prisma.js";

export async function listEmojis({
  offset = 0,
  limit = 10,
  order = "recent",
  studyId,
} = {}) {
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

  let orderBy;
  switch (order) {
    case "count":
      orderBy = [{ count: "desc" }, { updatedAt: "desc" }];
      break;
    case "recent":
    default:
      orderBy = { updatedAt: "desc" };
  }

  const where = studyId ? { studyId } : undefined;
  return prisma.emoji.findMany({
    where,
    orderBy,
    skip: offsetNum,
    take: limitNum,
  });
}

export async function upsertEmoji({ studyId, emojiType }) {
  const existing = await prisma.emoji.findFirst({
    where: { studyId, emojiType },
  });
  if (existing) {
    return prisma.emoji.update({
      where: { id: existing.id },
      data: { count: (existing.count || 0) + 1 },
    });
  }
  return prisma.emoji.create({ data: { studyId, emojiType, count: 1 } });
}

export async function updateEmoji(id, data) {
  return prisma.emoji.update({ where: { id }, data });
}

export async function deleteEmojiByQuery({ studyId, emojiType }) {
  return prisma.emoji.deleteMany({ where: { studyId, emojiType } });
}

export async function deleteEmojiById(id) {
  await prisma.emoji.delete({ where: { id } });
}
