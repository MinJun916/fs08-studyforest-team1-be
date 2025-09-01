import {
  listEmojis,
  upsertEmoji,
  updateEmoji,
  deleteEmojiByQuery,
  deleteEmojiById,
} from "../services/emojiService.js";
import {
  ValidationError,
  requireUuid,
  requireString,
  optionalInteger,
} from "../utils/validation.js";

const emojiFromCode = (code)=> {
  if (!code) return null;
  const parts = String(code).split(/[-_]/);
  try {
    const chars = parts
      .map((p) => parseInt(p, 16))
      .map((cp) => String.fromCodePoint(cp));
    return chars.join("");
  } catch (e) {
    return null;
  }
}

export const getEmojis = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, order = "recent", studyId } = req.query;
    const emojis = await listEmojis({ offset, limit, order, studyId });
    res.send(
      emojis.map((e) => ({ ...e, emojiChar: emojiFromCode(e.emojiType) }))
    );
  } catch (err) {
    next(err);
  }
};

export const postEmoji = async (req, res, next) => {
  try {
    const body = req.body || {};
    requireUuid(body, "studyId");
    requireString(body, "emojiType", { min: 1, max: 255 });
    if (body.count !== undefined) optionalInteger(body, "count");
    const createdOrUpdated = await upsertEmoji({
      studyId: body.studyId,
      emojiType: body.emojiType,
    });
    res
      .status(201)
      .send({
        ...createdOrUpdated,
        emojiChar: emojiFromCode(createdOrUpdated.emojiType),
      });
  } catch (err) {
    next(err);
  }
};

export const patchEmoji = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updated = await updateEmoji(id, body);
    res.send({ ...updated, emojiChar: emojiFromCode(updated.emojiType) });
  } catch (err) {
    next(err);
  }
};

export const deleteEmojiQuery = async (req, res, next) => {
  try {
    const { studyId, emojiType } = req.query;
    if (!studyId || !emojiType)
      throw new ValidationError("studyId and emojiType are required");
    const result = await deleteEmojiByQuery({ studyId, emojiType });
    if (result.count === 0) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const deleteEmojiCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteEmojiById(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export function mapValidationError(err, req, res, next) {
  if (err && err.name === "ValidationError") {
    res.status(err.status || 400).send({ message: err.message });
    return;
  }
  next(err);
}
