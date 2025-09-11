import { addFocusTime, addFocusPoint } from '../services/focusSuccessService.js';

export const FocusSuccess = async (req, res, next) => {
  try {
    const { studyId, focusSecond, success } = req.query;

    if (!studyId) {
      // studyId가 없으면 에러
      const e = new Error('STUDY_ID_REQUIRED');
      e.status = 400;
      throw e;
    }
    if (!focusSecond) {
      // focusSecond가 없으면 에러
      const e = new Error('FOCUS_SECOND_REQUIRED');
      e.status = 400;
      throw e;
    }

    const seconds = Number(focusSecond);
    if (Number.isNaN(seconds) || seconds < 0) {
      // focusSecond가 숫자가 아니거나 음수이면 에러
      const e = new Error('FOCUS_SECOND_MUST_BE_NON_NEGATIVE_NUMBER');
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

    const focusTimeInMinutes = Math.floor(seconds / 60);
    const focusPointBase = Math.floor(seconds / 600); // 기본 포인트
    const bonus = isSuccessFlag ? 3 : 0; // 성공시 추가 +3점
    const focusPoint = focusPointBase + bonus;

    const focusTimeResult = await addFocusTime({ studyId, focusTime: focusTimeInMinutes });
    const totalPointResult = await addFocusPoint({ studyId, focusPoint });

    res.status(200).json({
      success: true,
      focuses: {
        id: focusTimeResult.id,
        studyId: focusTimeResult.studyId,
        focusTime: focusTimeInMinutes,
        focusPoint: Math.floor(focusPoint),
      },
      totalPoint: totalPointResult,
    });
  } catch (err) {
    next(err);
  }
};
