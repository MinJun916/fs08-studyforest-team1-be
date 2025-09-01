import express from "express";
import {
  getEmojis,
  postEmoji,
  patchEmoji,
  deleteEmojiQuery,
  deleteEmojiCtrl,
  mapValidationError,
} from "../src/controllers/emojiController.js";

const router = express.Router();
router.get("/", getEmojis);
router.post("/", postEmoji);
router.patch("/:id", patchEmoji);
router.delete("/", deleteEmojiQuery);
router.delete("/:id", deleteEmojiCtrl);

// Validation 에러 매핑
router.use(mapValidationError);

export default router;
