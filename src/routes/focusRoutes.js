import { Router } from "express";
import { getFocusByStudy } from "../controllers/focusController.js";

const router = Router();

// 오늘의 집중 조회
router.get("/:studyId", getFocusByStudy);

export default router;
