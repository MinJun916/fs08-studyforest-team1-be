import { Router } from 'express';
import { FocusSuccess } from '../controllers/focusSuccessController.js';

const router = Router();

/**
 * @swagger
 * /focusSuccess:
 *   post:
 *     tags: [Focuses]
 *     summary: 집중 시간 추가 및 포인트 적립
 *     description: 쿼리로 studyId와 focusTime(분)을 전달하면 해당 스터디의 집중 시간을 누적하고 포인트를 추가합니다. 포인트는 집중 시간의 1/10으로 계산되며, success=true일 경우 추가로 +3점이 부여됩니다.
 *     parameters:
 *       - in: query
 *         name: studyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 대상 스터디 ID
 *       - in: query
 *         name: focusTime
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 집중 시간(분)
 *       - in: query
 *         name: success
 *         required: false
 *         schema:
 *           type: boolean
 *         description: 집중 성공 여부 (true일 경우 포인트 +3)
 *     responses:
 *       200:
 *         description: 성공 - 집중 시간 및 포인트 업데이트 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 focusTime:
 *                   $ref: '#/components/schemas/Focus'
 *                 focusPoint:
 *                   $ref: '#/components/schemas/Point'
 *             example:
 *               success: true
 *               focusTime:
 *                 id: "3d4e5f6a-7890-4bcd-ef01-234567890abc"
 *                 studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                 time: 120
 *                 createdAt: "2025-09-02T10:00:00.000Z"
 *                 updatedAt: "2025-09-02T10:00:00.000Z"
 *               focusPoint:
 *                 id: "2c3d4e5f-6789-4abc-def0-1234567890ab"
 *                 studyId: "550e8400-e29b-41d4-a716-446655440000"
 *                 point: 15
 *                 createdAt: "2025-09-02T10:00:00.000Z"
 *                 updatedAt: "2025-09-02T10:00:00.000Z"
 */
router.post('/', FocusSuccess);

export default router;
