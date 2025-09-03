import { Router } from 'express';
import {
  modifyHabit,
  deleteHabit,
  postHabitFromToday,
} from '../controllers/habitModifyController.js';

const router = Router();

// 이름 수정
/**
 * @swagger
 * /habitModify/{habitId}:
 *   patch:
 *     tags: [HabitModify]
 *     summary: 습관 이름 수정
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studyId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               name:
 *                 type: string
 *                 example: "CS 스터디 회고 작성"
 *             required: [studyId, name]
 *           example:
 *             studyId: "550e8400-e29b-41d4-a716-446655440000"
 *             name: "CS 스터디 회고 작성"
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
 *                 habit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                     name:
 *                       type: string
 *                       example: "CS 스터디 회고 작성"
 *                     studyId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-09-02"
 *             example:
 *               success: true
 *               habit:
 *                 id: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                 name: "CS 스터디 회고 작성"
 *                 studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                 startDate: "2025-09-02"
 *       400:
 *         description: 잘못된 요청(유효하지 않은 이름 등)
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.patch('/:habitId', modifyHabit);

// 오늘부터 종료
/**
 * @swagger
 * /habitModify/{habitId}:
 *   delete:
 *     tags: [HabitModify]
 *     summary: 오늘부터 습관 종료
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studyId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *             required: [studyId]
 *           example:
 *             studyId: "550e8400-e29b-41d4-a716-446655440000"
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
 *                 ended:
 *                   type: boolean
 *             example:
 *               success: true
 *               ended: true
 *       400:
 *         description: 스터디와 습관 불일치 등 잘못된 요청
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.delete('/:habitId', deleteHabit);

// 오늘부터 생성
/**
 * @swagger
 * /habitModify/create/{studyId}:
 *   post:
 *     tags: [HabitModify]
 *     summary: 오늘부터 습관 생성
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "영어 단어 30개 암기"
 *             required: [name]
 *           example:
 *             name: "영어 단어 30개 암기"
 *     responses:
 *       201:
 *         description: 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 habit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "9b8a7c6d-1234-4e5f-8901-abcdefabcdef"
 *                     name:
 *                       type: string
 *                       example: "영어 단어 30개 암기"
 *                     studyId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-09-02"
 *             example:
 *               success: true
 *               habit:
 *                 id: "9b8a7c6d-1234-4e5f-8901-abcdefabcdef"
 *                 name: "영어 단어 30개 암기"
 *                 studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                 startDate: "2025-09-02"
 *       400:
 *         description: 잘못된 요청(유효하지 않은 이름 등)
 *       404:
 *         description: 스터디를 찾을 수 없음
 */
router.post('/create/:studyId', postHabitFromToday);

export default router;
