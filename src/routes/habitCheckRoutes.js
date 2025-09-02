import { Router } from "express";
import prisma from "../lib/prisma.js";
import dayjs from "../utils/dayjs.js";
import { toggleToday as toggleHabitToday } from "../services/habitCheckService.js";

const router = Router();

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
