import {
  listEmojis,
  upsertEmoji,
  updateEmoji,
  deleteEmojiByQuery,
  deleteEmojiById,
} from '../services/emojiService.js';

// 이모지 코드(유니코드 코드 포인트의 하이픈/언더스코어 구분 문자열)를 실제 이모지 문자로 변환
const emojiFromCode = (code) => {
  if (!code) return null;
  const parts = String(code).split(/[-_]/);
  try {
    const chars = parts.map((p) => parseInt(p, 16)).map((cp) => String.fromCodePoint(cp));
    return chars.join('');
  } catch (e) {
    return null;
  }
};

export const getEmojis = async (req, res, next) => {
  try {
    const offset = req.query?.offset !== undefined ? parseInt(req.query.offset, 10) : undefined;
    const limit = req.query?.limit !== undefined ? parseInt(req.query.limit, 10) : undefined;
    const { order, studyId } = req.query ?? {};
    const emojis = await listEmojis({ offset, limit, order, studyId });
    const data = emojis.map((e) => ({
      ...e,
      emojiChar: emojiFromCode(e.emojiType),
    }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const postEmoji = async (req, res, next) => {
  try {
    const { studyId, emojiType } = req.body ?? {};
    const createdOrUpdated = await upsertEmoji({ studyId, emojiType });
    res.status(201).json({
      success: true,
      data: {
        ...createdOrUpdated,
        emojiChar: emojiFromCode(createdOrUpdated.emojiType),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const patchEmoji = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const updated = await updateEmoji(id, req.body ?? {});
    res.status(200).json({
      success: true,
      data: { ...updated, emojiChar: emojiFromCode(updated.emojiType) },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEmojiQuery = async (req, res, next) => {
  try {
    const { studyId, emojiType } = req.query ?? {};
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
    const id = req.params?.id;
    await deleteEmojiById(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
