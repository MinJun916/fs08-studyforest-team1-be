import { Router } from "express";
import prisma from "../lib/prisma.js";
import dayjs from "../utils/dayjs.js";
import { kstStartOfToday as kstToday } from "../utils/dayjs-helpers.js";

const router = Router();
// 오늘의 습관 API
// 오늘의 습관 조회
router.get("/", async (req, res) => {
  const habits = await prisma.habit.findMany();
  return res.json({ success: true, habits });
});

router.get("/:studyId/today", async (req, res) => {
  const { studyId } = req.params;
  const password = req.query.password;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "비밀번호를 입력해주세요" });
  }

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true, password: true },
  });

  if (!study) {
    return res
      .status(404)
      .json({ success: false, message: "스터디를 찾을 수 없습니다" });
  }

  //임시 테스트 코드 (암호화 적용 X)
  const okStudy = Boolean(password === study.password);
  if (!okStudy) {
    return res.status(401).json({ success: false, message: "비빌번호 불일치" });
  }

  // bcrypt 코드 (테스트 예정)
  // const okStudy = await bcrypt.compare(password, study.password);
  // if (!okStudy) {
  //   return res.status(401).json({ success: false, message: "비빌번호 불일치" });
  // }

  const habits = await prisma.habit.findMany({
    where: { studyId },
    select: { id: true, name: true },
  });

  return res.json({ success: true, habits });
});

// 오늘의 습관 생성
router.post("/create/:studyId", async (req, res) => {
  const { studyId } = req.params;
  const { name } = req.body;

  if (!studyId) {
    return res
      .status(400)
      .json({ success: false, message: "스터디 ID가 필요합니다." });
  }
  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "습관 이름은 문자열이어야 합니다." });
  }

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true },
  });
  if (!study) {
    res
      .status(400)
      .json({ success: false, message: "스터디를 찾을 수 없습니다." });
  }

  const startDate = kstToday();

  const habit = await prisma.habit.create({
    data: {
      name: name.trim(),
      startDate,
      study: { connect: { id: studyId } },
    },
  });

  return res.status(201).json({ success: true, habit });
});

export default router;
