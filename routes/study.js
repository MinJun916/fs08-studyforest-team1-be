import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../src/prismaClient.js';
import bcrypt from 'bcryptjs';
import { assert } from 'superstruct';
import { CreateStudy, PatchStudy, } from '../src/structs/study.js';


const router = express.Router();

////////////////////// study routes /////////////////////
router.get('/', (req, res) => {
  const { offset = 0, limit = 10, order = 'newest' } = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }
  const studies = await prisma.study.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.send(studies);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const study = await prisma.study.findUniqueOrThrow({ where: { id } });
  res.send(study);
});

router.post('/', (req, res) => {
  assert(req.body, CreateStudy);
  const { password, ...rest } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const study = await prisma.study.create({
    data: { ...rest, password: hashed },
  });
  res.status(201).send(study);
});

router.patch('/:id', (req, res) => {
  assert(req.body, PatchStudy);
  const { id } = req.params;
  const data = { ...req.body };
  if (data.password !== undefined) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  const study = await prisma.study.update({
    where: { id },
    data,
  });
  res.send(study);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  await prisma.study.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;