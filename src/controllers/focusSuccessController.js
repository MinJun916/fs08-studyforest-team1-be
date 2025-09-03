import { addFocusTime, addFocusPoint } from "../services/focusSuccessService.js";

export const FocusSuccess = async (req, res, next) => {
  try {
    const { studyId, focusTime } = req.query;

    if (!studyId) { // studyId가 없으면 에러
      const e = new Error("STUDY_ID_REQUIRED");
      e.status = 400;
      throw e;
    }
    if (!focusTime) { // focusTime이 없으면 에러
      const e = new Error("FOCUS_TIME_REQUIRED");
      e.status = 400;
      throw e;
    }

    const minutes = Number(focusTime);
    if (Number.isNaN(minutes) || minutes <= 0) { // focusTime이 숫자가 아니거나 0 이하이면 에러
      const e = new Error("FOCUS_TIME_MUST_BE_POSITIVE_NUMBER");
      e.status = 400;
      throw e;
    }

    const focusPoint = Math.floor(minutes / 10); // 집중 포인트는 집중 시간의 1/10로 설정

    const focusTimeResult = await addFocusTime({ studyId, focusTime: minutes });
    const focusPointResult = await addFocusPoint({ studyId, focusPoint });

    res.status(200).json({ success: true, focusTime: focusTimeResult, focusPoint: focusPointResult });
  } catch (err) {
    next(err);
  }
};
