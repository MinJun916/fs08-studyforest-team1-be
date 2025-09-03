import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

/**
 * @swagger
 * /points:
 *   get:
 *     summary: 포인트 전체 목록 조회
 *     tags: [Points]
 *     responses:
 *       200:
 *         description: 포인트 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Point'
 */
// 전체 Point 데이터 조회
router.get('/', async (req, res, next) => {
  try {
    const points = await prisma.point.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json({ success: true, data: points });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /points/{studyId}:
 *   get:
 *     summary: 특정 스터디의 포인트 조회
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 스터디 ID
 *     responses:
 *       200:
 *         description: 포인트 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Point'
 *       404:
 *         description: 포인트 정보를 찾을 수 없음
 */
// 특정 스터디의 Point 조회 (단일 레코드)
router.get('/:studyId', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const point = await prisma.point.findFirst({
      where: { studyId },
    });

    if (!point) {
      return res.status(404).json({ success: false, message: 'POINT_NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: point });
  } catch (err) {
    next(err);
  }
});

export default router;
