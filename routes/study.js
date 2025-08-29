import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = express.Router();

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1); // 페이지 번호
    const perPage = Math.min(Math.max(parseInt(req.query.perPage || '10', 10), 1), 100); // 페이지당 항목 수
    const search = (req.query.search || '').trim(); // 검색어
    const sort = req.query.sort || 'newest'; // 정렬 기준

    const where = search // 이름, 소개, 닉네임에 부분 일치 검색
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { intro: { contains: search, mode: 'insensitive' } },
            { creatorNickname: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    let orderBy = { createdAt: 'desc' }; // 기본 정렬: 최신순
    if (sort === 'points_asc') orderBy = { points: 'asc' }; // 포인트 오름차순
    else if (sort === 'points_desc') orderBy = { points: 'desc' }; // 포인트 내림차순
    else if (sort === 'newest') orderBy = { createdAt: 'desc' }; // 최신순
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' }; // 오래된순

    const [total, studies] = await Promise.all([ // 동시 실행
      prisma.study.count({ where }), // 총 개수
      prisma.study.findMany({ // 항목 조회
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          name: true,
          creatorNickname: true,
          intro: true,
          background: true,
          points: true,
          createdAt: true,
        },
      }),
    ]);

  res.json({ total, studies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nickname, name, intro, background, password, passwordConfirm } = req.body || {};

    if (!nickname || !name || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'nickname, name and password are required' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'password and passwordConfirm do not match' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const study = await prisma.study.create({
      data: {
        creatorNickname: nickname,
        name,
        intro: intro || '',
        background: background || null,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        creatorNickname: true,
        intro: true,
        background: true,
        points: true,
        createdAt: true,
      },
    });

    res.status(201).json({ data: study });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

async function verifyPassword(studyId, plainPassword) {
  const study = await prisma.study.findUnique({ where: { id: Number(studyId) }, select: { password: true } });
  if (!study) return false;
  return bcrypt.compare(plainPassword, study.password);
}

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const study = await prisma.study.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        creatorNickname: true,
        intro: true,
        background: true,
        points: true,
        createdAt: true,
      },
    });

    if (!study) return res.status(404).json({ error: 'Study not found' });

    const emojis = await prisma.studyEmoji.findMany({
      where: { studyId: id },
      orderBy: { count: 'desc' },
      take: 3,
      select: { emoji: true, count: true },
    });

    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    fromDate.setDate(fromDate.getDate() - 29);

    const habits = await prisma.habit.findMany({
      where: {
        studyId: id,
        date: { gte: fromDate },
      },
      orderBy: { date: 'asc' },
      select: { date: true, done: true },
    });

    res.json({
      data: {
        ...study,
        topEmojis: emojis,
        habits,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const { password, name, intro, background, newPassword, newPasswordConfirm } = req.body || {};
    if (!password) return res.status(401).json({ error: 'password required to modify study' });

    const ok = await verifyPassword(id, password);
    if (!ok) return res.status(403).json({ error: 'Invalid password' });

    const data = {};
    if (name) data.name = name;
    if (intro !== undefined) data.intro = intro;
    if (background !== undefined) data.background = background;

    if (newPassword || newPasswordConfirm) {
      if (!newPassword || !newPasswordConfirm || newPassword !== newPasswordConfirm) {
        return res.status(400).json({ error: 'newPassword and newPasswordConfirm must match' });
      }
      data.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    const updated = await prisma.study.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        intro: true,
        background: true,
        points: true,
        creatorNickname: true,
        createdAt: true,
      },
    });

    res.json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const { password } = req.body || {};
    if (!password) return res.status(401).json({ error: 'password required to delete study' });

    const ok = await verifyPassword(id, password);
    if (!ok) return res.status(403).json({ error: 'Invalid password' });

    await prisma.$transaction([
      prisma.studyEmoji.deleteMany({ where: { studyId: id } }),
      prisma.habit.deleteMany({ where: { studyId: id } }),
      prisma.study.delete({ where: { id } }),
    ]);

    res.json({ data: { id, deleted: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;