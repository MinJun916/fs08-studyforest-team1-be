import {
  listStudies,
  getStudyById,
  createStudy,
  updateStudy,
  deleteStudy,
} from "../services/studyService.js";
import {
  ValidationError,
  requireString,
  optionalEnum,
} from "../utils/validation.js";

const BACKGROUNDIMG = [
  "green",
  "yellow",
  "blue",
  "pink",
  "alvaro",
  "mikey",
  "andrew",
  "chris",
];

export const getStudies = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, order = "newest" } = req.query;
    const studies = await listStudies({ offset, limit, order });
    res.send(studies);
  } catch (err) {
    next(err);
  }
};

export const getStudy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const study = await getStudyById(id);
    res.send(study);
  } catch (err) {
    next(err);
  }
};

export const postStudy = async (req, res, next) => {
  try {
    const body = req.body || {};
    requireString(body, "nickName", { min: 1, max: 15 });
    requireString(body, "studyName", { min: 1, max: 40 });
    if (body.description !== undefined)
      requireString(body, "description", { min: 0, max: 2000 });
    optionalEnum(body, "backgroundImg", BACKGROUNDIMG);
    requireString(body, "password", { min: 1, max: 255 });

    const created = await createStudy(body);
    res.status(201).send(created);
  } catch (err) {
    next(err);
  }
};

export const patchStudy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    if (body.nickName !== undefined)
      requireString(body, "nickName", { min: 1, max: 15 });
    if (body.studyName !== undefined)
      requireString(body, "studyName", { min: 1, max: 40 });
    if (body.description !== undefined)
      requireString(body, "description", { min: 0, max: 2000 });
    if (body.backgroundImg !== undefined)
      optionalEnum(body, "backgroundImg", BACKGROUNDIMG);
    if (body.password !== undefined)
      requireString(body, "password", { min: 1, max: 255 });

    const updated = await updateStudy(id, body);
    res.send(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteStudyCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteStudy(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// 에러 미들웨어 호환 ValidationError -> 400
export function mapValidationError(err, req, res, next) {
  if (err && err.name === "ValidationError") {
    res.status(err.status || 400).send({ message: err.message });
    return;
  }
  next(err);
}
