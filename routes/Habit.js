import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dayjs from "../utils/dayjs.js";
import { kstToday, kstConvert } from "../utils/dayjs-helpers.js";

const router = express.Router();
const prisma = new PrismaClient();

// 오늘의 습관 API
// 오늘의 습관 조회
router.get("/", async (req, res) => {
  const habits = await prisma.habit.findMany();
  return res.json({ success: true, habits });
});

router.get("/:studyId/today", async (req, res) => {
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

// 오늘의 습관 체크
router.patch("/:studyId/:habitId/habitCheck", async (req, res) => {
  const { studyId, habitId } = req.params;

  const todayKst = kstToday();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: { id: true, studyId: true, startDate: true, endDate: true },
  });

  if (!habit) {
    return res
      .status(404)
      .json({ success: false, message: "습관을 찾을 수 없습니다." });
  }
  if (habit.studyId !== studyId) {
    return res
      .status(400)
      .json({ success: false, message: "습관과 스터디가 일치하지 않습니다." });
  }

  const today = dayjs(todayKst);
  const startDate = dayjs(habit.startDate);
  const endDate = habit.endDate ? dayjs(habit.endDate) : null;

  const inRange =
    (today.isSame(startDate, "day") || today.isAfter(startDate, "day")) &&
    (!endDate || today.isBefore(endDate, "day"));
  if (!inRange) {
    return res
      .status(400)
      .json({ success: false, message: "체크 가능한 기간이 아닙니다." });
  }

  const existing = await prisma.habitCheck.findFirst({
    where: { habitId, studyId, checkDate: todayKst },
    select: { id: true, isCompleted: true, checkDate: true },
  });

  const nextCompleted = existing ? !existing.isCompleted : true;

  const saved = await prisma.habitCheck.upsert({
    where: {
      unique_habit_day: { habitId, studyId, checkDate: todayKst },
    },
    update: {
      isCompleted: nextCompleted,
      checkDate: nextCompleted ? todayKst : existing?.checkDate ?? todayKst,
    },
    create: {
      habit: { connect: { id: habitId } },
      study: { connect: { id: studyId } },
      isCompleted: true,
      checkDate: todayKst,
    },
    select: { id: true, isCompleted: true, checkDate: true, updatedAt: true },
  });

  return res.json({
    success: true,
    data: {
      ...prevData,
      checkDateKST: dayjs(prevData.checkDate)
        .tz("Asia/Seoul")
        .format("YYYY-MM-DD"),
    },
  });
});

// 오늘의 습관을 1주일 단위로 조회해서 체크하지 않은 날은 false 값으로 DB 를 만들어서 프론트에 줍니다.
router.get("/:studyId/:habitId/habitCheck/weekly", async (req, res) => {
  const { studyId, habitId } = req.params;
  const { start } = req.query;

  const startKst = start
    ? dayjs(start).tz("Asia/Seoul").startOf("day")
    : dayjs().tz("Asia/Seoul").startOf("week").add(1, "day").startOf("day");

  const startDate = dayjs(startKst).toDate();
  const endDate = dayjs(startDate).add(7, "day").toDate();

  const week = await prisma.habitCheck.findMany({
    where: { studyId, habitId, checkDate: { gte: startDate, lt: endDate } },
    orderBy: { checkDate: "asc" },
    select: { checkDate: true, isCompleted: true },
  });

  const existingByDay = new Map(
    week.map((day) => [
      dayjs(day.checkDate)
        .tz("Asia/Seoul")
        .format(YYYY - MM - DD),
      day.isCompleted,
    ])
  );

  const toCreate = [];
  const payload = [];

  for (let i = 0; i < 7; i++) {
    const dayKst = startKst.add(i, "day");
    const key = dayKst.format("YYYY-MM-DD");

    if (existingByDay.has(key)) {
      payload.push({ date: key, isCompleted: existingByDay.get(key) });
    } else {
      const checkDate = dayKst.startOf("day").toDate();
      toCreate.push({
        habitId,
        studyId,
        isCompleted: false,
        checkDate,
      });

      payload.push({ date: key, isCompleted: false });
    }

    if (toCreate.length > 0) {
      await prisma.habitCheck.createMany({
        data: toCreate,
        skipDuplicates: true,
      });
    }

    return res.json({ success: true, data: payload });
  }
});

export default router;
