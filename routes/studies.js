import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../src/prismaClient.js';
import bcrypt from 'bcryptjs';
import { assert } from 'superstruct';
import { CreateStudy, PatchStudy, } from '../src/structs/study.js';
import { listStudies } from '../src/structs/studyList.js';


const router = express.Router();

////////////////////// study routes /////////////////////
router.get('/', async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest' } = req.query;
  const studies = await listStudies({ offset, limit, order });
  res.send(studies);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const study = await prisma.study.findUniqueOrThrow({ where: { id } });
  const point = await prisma.point.aggregate({
    where: { studyId: id },
    _sum: { point: true },
  });
  const totalPoints = point._sum.point || 0;
  res.send({ ...study, totalPoints });
});

router.post('/', async (req, res) => {
  assert(req.body, CreateStudy);
  const { password, ...rest } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const study = await prisma.study.create({
    data: { ...rest, password: hashed },
  });
  res.status(201).send(study);
});

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.study.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;