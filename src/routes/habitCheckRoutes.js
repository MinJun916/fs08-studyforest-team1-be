import { Router } from "express";
import prisma from "../lib/prisma.js";
import dayjs from "../utils/dayjs.js";
import { toggleToday as toggleHabitToday } from "../services/habitCheckService.js";

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
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
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
 *                         example: 2025-01-01
 *                       isCompleted:
 *                         type: boolean
 */
router.get("/:studyId/:habitId/habitCheck/weekly", async (req, res) => {
  const { studyId, habitId } = req.params;

  const startOfWeekKst = dayjs()
    .tz("Asia/Seoul")
    .startOf("week")
    .add(1, "day")
    .startOf("day");
  const endOfWeekKst = startOfWeekKst.add(6, "day").endOf("day");

  const rows = await prisma.habitCheck.findMany({
    where: {
      studyId,
      habitId,
      checkDate: {
        gte: startOfWeekKst.toDate(),
        lte: endOfWeekKst.toDate(),
      },
    },
    orderBy: { checkDate: "asc" },
    select: { checkDate: true, isCompleted: true },
  });

  const data = rows.map((r) => ({
    date: dayjs(r.checkDate).tz("Asia/Seoul").format("YYYY-MM-DD"),
    isCompleted: r.isCompleted,
  }));

  return res.json({ success: true, data });
});

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
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
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
 *                       example: 2025-01-01
 *                     isCompleted:
 *                       type: boolean
 *                     pointTotal:
 *                       type: integer
 *       400:
 *         description: 스터디와 습관 불일치 등 잘못된 요청
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.post("/:studyId/:habitId/habitCheck/toggle", async (req, res) => {
  const { studyId, habitId } = req.params;
  try {
    const result = await toggleHabitToday({ studyId, habitId });
    return res.json({
      success: true,
      data: {
        date: result.checkDateKST,
        isCompleted: result.isCompleted,
        pointTotal: result.pointTotal,
      },
    });
  } catch (err) {
    if (err && err.message === "NOT_FOUND_HABIT") {
      return res
        .status(404)
        .json({ success: false, message: "습관을 찾을 수 없습니다." });
    }
    if (err && err.message === "MISMATCH_STUDY") {
      return res.status(400).json({
        success: false,
        message: "스터디와 습관이 일치하지 않습니다.",
      });
    }
    console.error("Toggle error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;
