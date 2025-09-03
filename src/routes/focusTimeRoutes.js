import { Router } from "express";
import { FocusTime } from "../controllers/focusTimeController.js";

const router = Router();

router.post("/", FocusTime);

export default router;
