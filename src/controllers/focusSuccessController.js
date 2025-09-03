import { addFocusTime, addFocusPoint } from '../services/focusSuccessService.js';

export const FocusSuccess = async (req, res, next) => {
  try {
    const { studyId, focusTime, success } = req.query;

    if (!studyId) {
      // studyId가 없으면 에러
      const e = new Error('STUDY_ID_REQUIRED');
      e.status = 400;
      throw e;
    }
    if (!focusTime) {
      // focusTime이 없으면 에러
      const e = new Error('FOCUS_TIME_REQUIRED');
      e.status = 400;
      throw e;
    }

    const minutes = Number(focusTime);
    if (Number.isNaN(minutes) || minutes <= 0) {
      // focusTime이 숫자가 아니거나 0 이하이면 에러
      const e = new Error('FOCUS_TIME_MUST_BE_POSITIVE_NUMBER');
      e.status = 400;
      throw e;
    }

    // success 파라미터 검증 (옵션). 허용값: "true"/"false"/"1"/"0" 또는 생략
    let isSuccessFlag = false;
    if (typeof success !== 'undefined') {
      if (success === 'true' || success === '1') {
        isSuccessFlag = true;
      } else if (success === 'false' || success === '0') {
        isSuccessFlag = false;
      } else {
        const e = new Error('INVALID_SUCCESS_VALUE');
        e.status = 400;
        throw e;
      }
    }

    const focusPointBase = Math.floor(minutes / 10); // 기본 포인트
    const bonus = isSuccessFlag ? 3 : 0; // 성공시 추가 +3점
    const focusPoint = focusPointBase + bonus;

    const focusTimeResult = await addFocusTime({ studyId, focusTime: minutes });
    const focusPointResult = await addFocusPoint({ studyId, focusPoint });

    res.status(200).json({
      success: true,
      focusTime: focusTimeResult,
      focusPoint: focusPointResult,
    });
  } catch (err) {
    next(err);
  }
};
