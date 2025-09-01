import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../src/prismaClient.js';
import bcrypt from 'bcryptjs';
import { assert } from 'superstruct';
import {
  CreateStudy,
  PatchStudy,
} from '../src/structs/study.js';


const router = express.Router();

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === 'StructError' ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
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

////////////////////// study routes /////////////////////
router.get('/', asyncHandler(async (req, res) => {
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
  })
);

router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const study = await prisma.study.findUniqueOrThrow({ where: { id } });
    res.send(study);
  })
);

router.post('/', asyncHandler(async (req, res) => {
    assert(req.body, CreateStudy);
    const { password, ...rest } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const study = await prisma.study.create({
      data: { ...rest, password: hashed },
    });
    res.status(201).send(study);
  })
);

router.patch('/:id', asyncHandler(async (req, res) => {
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
  })
);

router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.study.delete({ where: { id } });
    res.sendStatus(204);
  })
);

export default router;