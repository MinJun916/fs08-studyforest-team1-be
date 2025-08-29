import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../src/prismaClient.js';
import { assert } from 'superstruct';
import { CreateEmoji, PatchEmoji } from '../src/structs/emoji.js';

const router = express.Router();

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

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

router.get('/', asyncHandler(async (req, res) => {

  res.send();
}));

router.post('/', asyncHandler(async (req, res) => {
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
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  assert(req.body, PatchEmoji);
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.emoji.update({ where: { id }, data });
  res.send({ ...updated, emojiChar: emojiFromCode(updated.emojiType) });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.emoji.delete({ where: { id } });
  res.sendStatus(204);
}));

export default router;