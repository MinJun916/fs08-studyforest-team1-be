import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../src/prismaClient.js';
import { assert } from 'superstruct';
import { CreateEmoji, PatchEmoji } from '../src/structs/emoji.js';

const router = express.Router();

function emojiFromCode(code) {
  if (!code) return null;
  const parts = code.split(/[-_]/);
  try {
    const chars = parts.map(p => parseInt(p, 16)).map(cp => String.fromCodePoint(cp));
    return chars.join('');
  } catch (e) {
    return null;
  }
}

router.get('/', async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent', studyId } = req.query;

  let orderBy;
  switch (order) {
    case 'count':
      // count 내림차순, 동점일 때 최근 업데이트 순
      orderBy = [{ count: 'desc' }, { updatedAt: 'desc' }];
      break;
    case 'recent':
    default:
      // 최근 업데이트 순
      orderBy = { updatedAt: 'desc' };
  }

  const where = studyId ? { studyId } : undefined;

  const emojis = await prisma.emoji.findMany({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });

  res.send(emojis.map(e => ({ ...e, emojiChar: emojiFromCode(e.emojiType) })));
});

router.post('/', async (req, res) => {
  assert(req.body, CreateEmoji);
  const { studyId, emojiType } = req.body;

  const existing = await prisma.emoji.findFirst({ where: { studyId, emojiType } });
  if (existing) {
    const updated = await prisma.emoji.update({
      where: { id: existing.id },
      data: { count: (existing.count || 0) + 1 },
    });
    res.send({ ...updated, emojiChar: emojiFromCode(updated.emojiType) });
    return;
  }

  const created = await prisma.emoji.create({ data: { studyId, emojiType, count: 1 } });
  res.status(201).send({ ...created, emojiChar: emojiFromCode(created.emojiType) });
});

router.patch('/:id', async (req, res) => {
  assert(req.body, PatchEmoji);
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.emoji.update({ where: { id }, data });
  res.send({ ...updated, emojiChar: emojiFromCode(updated.emojiType) });
});

router.delete('/', async (req, res) => {
  const { studyId, emojiType } = req.query;

  if (!studyId || !emojiType) {
    res.status(400).send({ message: 'studyId and emojiType are required' });
    return;
  }

  const result = await prisma.emoji.deleteMany({ where: { studyId, emojiType } });

  if (result.count === 0) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(204);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.emoji.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;