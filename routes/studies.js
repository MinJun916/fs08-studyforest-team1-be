import express from "express";
import {
  getStudies,
  getStudy,
  postStudy,
  patchStudy,
  deleteStudyCtrl,
} from "../src/controllers/studyController.js";

const router = express.Router();

router.get("/", getStudies);
/**
 * @swagger
 * /studies:
 *   get:
 *     summary: 스터디 목록 조회
 *     tags: [Studies]
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
 *             - newest
 *             - oldest
 *             - points
 *             - points_desc
 *             - points_asc
 *         description: 정렬 방식 (newest - 최신순 | oldest - 오래된순 | points - 점수높은순 | points_desc - 점수높은순 | points_asc - 점수낮은순)
 *     responses:
 *       200:
 *         description: 스터디 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Study'
 */
router.get("/:id", getStudy);
/**
 * @swagger
 * /studies/{id}:
 *   get:
 *     summary: 스터디 상세 조회
 *     tags: [Studies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 스터디 상세
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Study'
 */
router.post("/", postStudy);
/**
 * @swagger
 * /studies:
 *   post:
 *     summary: 스터디 생성
 *     tags: [Studies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Study'
 *     responses:
 *       201:
 *         description: 생성됨
 */
router.patch("/:id", patchStudy);
/**
 * @swagger
 * /studies/{id}:
 *   patch:
 *     summary: 스터디 수정
 *     tags: [Studies]
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
 *             $ref: '#/components/schemas/Study'
 *     responses:
 *       200:
 *         description: 수정됨
 */
router.delete("/:id", deleteStudyCtrl);
/**
 * @swagger
 * /studies/{id}:
 *   delete:
 *     summary: 스터디 삭제
 *     tags: [Studies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 삭제됨
 */

export default router;
