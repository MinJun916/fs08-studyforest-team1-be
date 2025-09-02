import { Router } from "express";
import {
  renameHabit,
  endHabitToday,
  createHabitToday,
} from "../services/habitModifyService.js";

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studyId:
 *                 type: string
 *               name:
 *                 type: string
 *             required: [studyId, name]
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
 *       400:
 *         description: 잘못된 요청(유효하지 않은 이름 등)
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.patch("/:habitId", async (req, res) => {
  const { habitId } = req.params;
  const { name, studyId } = req.body;
  try {
    const habit = await renameHabit({ habitId, studyId, name });
    return res.json({ success: true, habit });
  } catch (err) {
    if (err.message === "INVALID_NAME") {
      return res
        .status(400)
        .json({ success: false, message: "유효하지 않은 이름입니다." });
    }
    if (err.message === "NOT_FOUND_HABIT") {
      return res
        .status(404)
        .json({ success: false, message: "습관을 찾을 수 없습니다." });
    }
    if (err.message === "MISMATCH_STUDY") {
      return res.status(400).json({
        success: false,
        message: "스터디와 습관이 일치하지 않습니다.",
      });
    }
    console.error("rename error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studyId:
 *                 type: string
 *             required: [studyId]
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
 *       400:
 *         description: 스터디와 습관 불일치 등 잘못된 요청
 *       404:
 *         description: 습관을 찾을 수 없음
 */
router.delete("/:habitId", async (req, res) => {
  const { habitId } = req.params;
  const { studyId } = req.body;
  try {
    const result = await endHabitToday({ habitId, studyId });
    return res.json({ success: true, ended: result });
  } catch (err) {
    if (err.message === "NOT_FOUND_HABIT") {
      return res
        .status(404)
        .json({ success: false, message: "습관을 찾을 수 없습니다." });
    }
    if (err.message === "MISMATCH_STUDY") {
      return res.status(400).json({
        success: false,
        message: "스터디와 습관이 일치하지 않습니다.",
      });
    }
    console.error("end error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

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
 *       400:
 *         description: 잘못된 요청(유효하지 않은 이름 등)
 *       404:
 *         description: 스터디를 찾을 수 없음
 */
router.post("/create/:studyId", async (req, res) => {
  const { studyId } = req.params;
  const { name } = req.body ?? {};
  try {
    const habit = await createHabitToday({ studyId, name });
    return res.status(201).json({ success: true, habit });
  } catch (err) {
    if (err.message === "INVALID_NAME") {
      return res
        .status(400)
        .json({ success: false, message: "유효하지 않은 이름입니다." });
    }
    if (err.message === "NOT_FOUND_STUDY") {
      return res
        .status(404)
        .json({ success: false, message: "스터디를 찾을 수 없습니다." });
    }
    console.error("create error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;
