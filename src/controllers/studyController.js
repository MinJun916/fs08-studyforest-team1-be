import {
  listStudies,
  getStudyById,
  createStudy,
  updateStudy,
  deleteStudy,
} from "../services/studyService.js";

export const getStudies = async (req, res, next) => {
  try {
    const offset =
      req.query?.offset !== undefined
        ? parseInt(req.query.offset, 10)
        : undefined;
    const limit =
      req.query?.limit !== undefined
        ? parseInt(req.query.limit, 10)
        : undefined;
    const order = req.query?.order;
    const studies = await listStudies({ offset, limit, order });
    res.status(200).json({ success: true, data: studies });
  } catch (err) {
    next(err);
  }
};

export const getStudy = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const study = await getStudyById(id);
    res.status(200).json({ success: true, data: study });
  } catch (err) {
    next(err);
  }
};

export const postStudy = async (req, res, next) => {
  try {
    const created = await createStudy(req.body ?? {});
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const patchStudy = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const updated = await updateStudy(id, req.body ?? {});
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteStudyCtrl = async (req, res, next) => {
  try {
    const id = req.params?.id;
    await deleteStudy(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
