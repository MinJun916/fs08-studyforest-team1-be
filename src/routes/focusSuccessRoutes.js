import { Router } from "express";
import { FocusSuccess } from "../controllers/focusSuccessController.js";

const router = Router();

router.post("/", FocusSuccess);

export default router;
