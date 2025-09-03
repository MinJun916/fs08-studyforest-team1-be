import { addFocusTime } from "../services/focusTimeService.js";

export const FocusTime = async (req, res, next) => {
  try {
    const { studyId, focusTime } = req.query;

    if (!studyId) {
      const e = new Error("STUDY_ID_REQUIRED");
      e.status = 400;
      throw e;
    }
    if (!focusTime) {
      const e = new Error("FOCUS_TIME_REQUIRED");
      e.status = 400;
      throw e;
    }
    const focus = await addFocusTime({ studyId, focusTime });
    res.status(200).json({ success: true, focus });
  } catch (err) {
    next(err);
  }
};
