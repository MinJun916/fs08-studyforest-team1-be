import express from "express";
import {
  getEmojis,
  postEmoji,
  patchEmoji,
  deleteEmojiQuery,
  deleteEmojiCtrl,
} from "../src/controllers/emojiController.js";

const router = express.Router();

/**
 * @swagger
 * /emojis:
 *   get:
 *     summary: 이모지 목록 조회
 *     tags: [Emojis]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색어
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emoji'
 *     responses:
 *       201:
 *         description: 생성됨
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
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emoji'
 *     responses:
 *       200:
 *         description: 수정됨
 */
router.patch("/:id", patchEmoji);

/**
 * @swagger
 * /emojis:
 *   delete:
 *     summary: 쿼리 기반 이모지 삭제
 *     description: 예) /emojis?name=thumbs_up
 *     tags: [Emojis]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 삭제 결과
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
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제됨
 */
router.delete("/:id", deleteEmojiCtrl);

export default router;
