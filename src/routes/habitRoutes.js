import { Router } from "express";
import {
  getAllHabits,
  getTodayHabitsByStudy,
  createTodayHabit,
} from "../controllers/habitController.js";
import { create } from "superstruct";
import { createHabitToday } from "../services/habitModifyService.js";

const router = Router();

// 오늘의 습관 API
// 오늘의 습관 조회
/**
 * @swagger
 * /habits:
 *   get:
 *     tags: [Habits]
 *     summary: 전체 습관 목록 조회
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
 *                 habits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                       name:
 *                         type: string
 *                         example: "영어 단어 30개 암기"
 *                       studyId:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-09-02"
 *             example:
 *               success: true
 *               habits:
 *                 - id: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                   name: "영어 단어 30개 암기"
 *                   studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                   startDate: "2025-09-02"
 *                 - id: "7a1b2c3d-4567-89ab-cdef-0123456789ab"
 *                   name: "운동 1시간"
 *                   studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                   startDate: "2025-08-28"
 */
router.get("/", getAllHabits);

/**
 * @swagger
 * /habits/{studyId}/today:
 *   get:
 *     tags: [Habits]
 *     summary: 특정 스터디의 오늘 습관 조회
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *           example: "hashed-password"
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
 *                 habits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                       name:
 *                         type: string
 *                         example: "자료구조 문제 1개 풀기"
 *             example:
 *               success: true
 *               habits:
 *                 - id: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                   name: "자료구조 문제 1개 풀기"
 *                 - id: "7a1b2c3d-4567-89ab-cdef-0123456789ab"
 *                   name: "운동 1시간"
 *       400:
 *         description: 비밀번호 필요
 *       401:
 *         description: 비밀번호 불일치
 *       404:
 *         description: 스터디 없음
 */
router.get("/:studyId/today", getTodayHabitsByStudy);

// 오늘의 습관 생성
/**
 * @swagger
 * /habits/create/{studyId}:
 *   post:
 *     tags: [Habits]
 *     summary: 오늘의 습관 생성
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required: [name]
 *           example:
 *             name: "알고리즘 1문제 풀이"
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
 *                       example: "알고리즘 1문제 풀이"
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
 *                 name: "알고리즘 1문제 풀이"
 *                 studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                 startDate: "2025-09-02"
 *       400:
 *         description: 잘못된 요청
 */
router.post("/create/:studyId", createTodayHabit);

export default router;
