import express from "express";
import {
  getEmojis,
  postEmoji,
  patchEmoji,
  deleteEmojiQuery,
  deleteEmojiCtrl,
} from "../src/controllers/emojiController.js";

const router = express.Router();

router.get("/", getEmojis);
router.post("/", postEmoji);
router.patch("/:id", patchEmoji);
router.delete("/", deleteEmojiQuery);
router.delete("/:id", deleteEmojiCtrl);

export default router;
