import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

// 오늘의 습관 API
// 오늘의 습관 조회
router.get("/", async (req, res) => {
  const studies = await prisma.study.findMany();
  return res.json({ success: true, studies });
});

router.get("/:studyId/habits", async (req, res) => {
  const { studyId } = req.params;
  const password =
    typeof req.query.password === "string" ? req.query.password : undefined;

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

export default router;
