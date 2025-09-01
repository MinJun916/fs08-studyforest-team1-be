import express from "express";
import {
  getStudies,
  getStudy,
  postStudy,
  patchStudy,
  deleteStudyCtrl,
} from "../src/controllers/studyController.js";

const router = express.Router();

/**
 * @swagger
 * /studies:
 *   get:
 *     summary: 스터디 목록 조회
 *     tags: [Studies]
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
router.get("/", getStudies);
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
 *           type: integer
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
 *           type: integer
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
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제됨
 */

export default router;
