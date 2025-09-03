import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { study, point, habit, habitCheck, focus, emoji } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.habitCheck.deleteMany();
  await prisma.emoji.deleteMany();
  await prisma.focus.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.point.deleteMany();
  await prisma.study.deleteMany();

  for (const s of study) {
    const { id, nickName, studyName, description, backgroundImg, password, createdAt, updatedAt } =
      s;

    const hashed = await bcrypt.hash(password, 10);
    await prisma.study.create({
      data: {
        id,
        nickName,
        studyName,
        description,
        backgroundImg,
        password: hashed,

        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  for (const p of point) {
    const { id, studyId, point: pt, createdAt, updatedAt } = p;
    await prisma.point.create({
      data: {
        id,
        studyId,
        point: pt,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  for (const h of habit) {
    const { id, studyId, name, startDate, endDate, createdAt, updatedAt } = h;
    await prisma.habit.create({
      data: {
        id,
        studyId,
        name,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  for (const f of focus) {
    const { id, studyId, time, createdAt, updatedAt } = f;
    await prisma.focus.create({
      data: {
        id,
        studyId,
        time,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  for (const e of emoji) {
    const { id, studyId, emojiType, count, createdAt, updatedAt } = e;
    await prisma.emoji.create({
      data: {
        id,
        studyId,
        emojiType,
        count,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  for (const hc of habitCheck) {
    const { id, habitId, pointId, studyId, isCompleted, checkDate, createdAt, updatedAt } = hc;
    await prisma.habitCheck.create({
      data: {
        id,
        habitId,
        pointId,
        studyId,
        isCompleted,
        checkDate: new Date(checkDate),
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
