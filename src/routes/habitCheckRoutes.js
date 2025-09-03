import { Router } from 'express';
import { getWeeklyHabitCheck, toggleTodayHabitCheck } from '../controllers/habitCheckController.js';

const router = Router();

// 주간 오늘의 습관 체크 조회
/**
 * @swagger
 * /habitChecks/{studyId}/{habitId}/habitCheck/weekly:
 *   get:
 *     tags: [HabitChecks]
 *     summary: 주간 오늘의 습관 체크 조회
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *     responses:
 *       200:
 *         description: 성공
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
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-01"
 *                       isCompleted:
 *                         type: boolean
 *             example:
 *               success: true
 *               data:
 *                 - date: "2025-01-06"
 *                   isCompleted: true
 *                 - date: "2025-01-07"
 *                   isCompleted: false
 *                 - date: "2025-01-08"
 *                   isCompleted: true
 *                 - date: "2025-01-09"
 *                   isCompleted: true
 *                 - date: "2025-01-10"
 *                   isCompleted: false
 *                 - date: "2025-01-11"
 *                   isCompleted: true
 *                 - date: "2025-01-12"
 *                   isCompleted: true
 */
router.get('/:studyId/:habitId/habitCheck/weekly', getWeeklyHabitCheck);

// 오늘의 습관 체크 토글
/**
 * @swagger
 * /habitChecks/{studyId}/{habitId}/habitCheck/toggle:
 *   post:
 *     tags: [HabitChecks]
 *     summary: 오늘의 습관 체크 토글
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-01-01"
 *                     isCompleted:
 *                       type: boolean
 *                     pointTotal:
 *                       type: integer
 *                       example: 12
 *             example:
 *               success: true
 *               data:
 *                 date: "2025-01-01"
 *                 isCompleted: true
 *                 pointTotal: 12
 *       400:
 *         description: 스터디와 습관 불일치 등 잘못된 요청
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.post('/:studyId/:habitId/habitCheck/toggle', toggleTodayHabitCheck);

export default router;
