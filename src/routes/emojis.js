import express from "express";
import {
  getEmojis,
  postEmoji,
  patchEmoji,
  deleteEmojiQuery,
  deleteEmojiCtrl,
} from "../controllers/emojiController.js";

const router = express.Router();

/**
 * @swagger
 * /emojis:
 *   get:
 *     summary: 이모지 목록 조회
 *     tags: [Emojis]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 조회 시작 오프셋 (기본 0)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 한 번에 조회할 개수 (기본 10)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - recent
 *             - count
 *         description: 정렬 방식 (recent|count)
 *       - in: query
 *         name: studyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 특정 스터디의 이모지만 조회하려면 studyId 전달
 *     responses:
 *       200:
 *         description: 이모지 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emoji'
 */
router.get("/", getEmojis);

/**
 * @swagger
 * /emojis:
 *   post:
 *     summary: 이모지 생성
 *     tags: [Emojis]
 *     description: 
 *       이모지 생성 (중복된 이모지 타입은 count +1)
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
 *               emojiType:
 *                 type: string
 *             required:
 *               - studyId
 *               - emojiType
 *           example:
 *             studyId: "550e8400-e29b-41d4-a716-446655440000"
 *             emojiType: "1f44d"
 *     responses:
 *       201:
 *         description: 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emoji'
 */
router.post("/", postEmoji);

/**
 * @swagger
 * /emojis/{id}:
 *   patch:
 *     summary: 이모지 수정
 *     tags: [Emojis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emoji'
 *     responses:
 *       200:
 *         description: 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emoji'
 */
router.patch("/:id", patchEmoji);

/**
 * @swagger
 * /emojis:
 *   delete:
 *     summary: 쿼리 기반 이모지 삭제
 *     description: 이모지 삭제
 *     tags: [Emojis]
 *     parameters:
 *       - in: query
 *         name: studyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 특정 스터디의 이모지를 삭제하려면 studyId 전달 (선택)
 *       - in: query
 *         name: emojiType
 *         schema:
 *           type: string
 *         description: 삭제할 이모지 타입 코드 (예: '1f44d' 또는 '1f44d-1f3fb') (선택)
 *     responses:
 *       204:
 *         description: 삭제됨 (성공, 컨텐츠 없음)
 *       404:
 *         description: 삭제할 항목 없음
 */
router.delete("/", deleteEmojiQuery);

/**
 * @swagger
 * /emojis/{id}:
 *   delete:
 *     summary: 특정 이모지 삭제
 *     tags: [Emojis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: 삭제됨
 */
router.delete("/:id", deleteEmojiCtrl);

export default router;
