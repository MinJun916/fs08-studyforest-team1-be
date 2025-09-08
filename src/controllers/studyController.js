import {
  listStudies,
  getStudyById,
  updateStudyWithPassword,
  deleteStudyWithPassword,
  createStudyAndPoint,
} from '../services/studyService.js';
import { getWeeklyHabitsForStudy } from '../services/habitCheckService.js';

export const getStudies = async (req, res, next) => {
  try {
    const offset = req.query?.offset !== undefined ? parseInt(req.query.offset, 10) : undefined;
    const limit = req.query?.limit !== undefined ? parseInt(req.query.limit, 10) : undefined;
    const order = req.query.order;
    const studies = await listStudies({ offset, limit, order });
    res.status(200).json({ success: true, data: studies });
  } catch (err) {
    next(err);
  }
};

export const getStudy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const study = await getStudyById(id);
  // 이번주(월~일) 각 습관의 체크 상태도 함께 반환
  const weeklyHabits = await getWeeklyHabitsForStudy(id);
  return res.status(200).json({ success: true, data: { ...study, weeklyHabits } });
  } catch (err) {
    next(err);
  }
};

export const postStudy = async (req, res, next) => {
  try {
    const created = await createStudyAndPoint(req.body ?? {});
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const patchStudy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { password, ...data } = req.body ?? {};
    // 비밀번호 검증 후 수정 수행 (삭제와 동일한 검증 로직)
    const updated = await updateStudyWithPassword(id, data, password);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteStudyCtrl = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { password } = req.body ?? {};
    await deleteStudyWithPassword(id, password);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
