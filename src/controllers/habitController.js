import {
  listAllHabits,
  listHabitsByStudy,
  createHabit,
  getStudyWithPassword,
} from "../services/habitService.js";
import { verifyStudyPassword } from "../services/globalService.js";

import { kstStartOfToday as kstToday } from "../utils/dayjs-helpers.js";

export const getAllHabits = async (_req, res, next) => {
  try {
    const habits = await listAllHabits();
    res.status(200).json({ success: true, habits });
  } catch (err) {
    next(err);
  }
};

export const getTodayHabitsByStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const password = req.query.password;

    // 비밀번호 검증(없으면 400, 불일치 401, 스터디 없음 404 에러 throw)
    await verifyStudyPassword(studyId, password);

    // 습관 조회
    const habits = await listHabitsByStudy(studyId);
    res.status(200).json({ success: true, habits });
  } catch (err) {
    next(err);
  }
};

export const createTodayHabit = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    if (!studyId) {
      const e = new Error("STUDY_ID_REQUIRED");
      e.status = 400;
      throw e;
    }
    if (typeof name !== "string") {
      const e = new Error("NAME_MUST_BE_STRING");
      e.status = 400;
      throw e;
    }

    const study = await getStudyWithPassword(studyId);
    if (!study) {
      const e = new Error("STUDY_NOT_FOUND");
      e.status = 404;
      throw e;
    }

    const startDate = kstToday();
    const habit = await createHabit({ studyId, name, startDate });

    res.status(201).json({ success: true, habit });
  } catch (err) {
    next(err);
  }
};
