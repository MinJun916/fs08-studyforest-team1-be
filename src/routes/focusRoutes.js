import { Router } from "express";
import { getFocusByStudy } from "../controllers/focusController.js";

const router = Router();

/**
 * @swagger
 * /focuses/{studyId}:
 *   get:
 *     summary: 스터디의 오늘 포인트(집중) 조회
 *     description: 스터디 비밀번호 검증 후, 해당 스터디의 포인트 정보를 반환합니다.
 *     tags: [Focuses]
 *     parameters:
 *       - in: path
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 스터디 ID
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: 스터디 접근용 비밀번호
 *     responses:
 *       200:
 *         description: 포인트 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 focuses:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: 스터디 ID
 *                     name:
 *                       type: string
 *                       description: 스터디 이름
 *                     pointId:
 *                       type: string
 *                       format: uuid
 *                     point:
 *                       type: integer
 *       400:
 *         description: 비밀번호 누락
 *       401:
 *         description: 비밀번호 불일치
 *       404:
 *         description: 스터디를 찾을 수 없음
 */
// 오늘의 집중 조회
router.get("/:studyId", getFocusByStudy);

export default router;
