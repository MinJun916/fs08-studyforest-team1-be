import { Router } from "express";
import {
  renameHabit,
  endHabitToday,
  createHabitToday,
} from "../services/habitModifyService.js";

const router = Router();

// 이름 수정
// PATCH /habit-lifecycle/:habitId  { name, studyId? }
router.patch("/:habitId", async (req, res) => {
  const { habitId } = req.params;
  const { name, studyId } = req.body ?? {};
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
// DELETE /habit-lifecycle/:habitId   (optional body: { studyId })
router.delete("/:habitId", async (req, res) => {
  const { habitId } = req.params;
  const { studyId } = req.body ?? {};
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
// POST /habit-lifecycle/create/:studyId  { name }
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
