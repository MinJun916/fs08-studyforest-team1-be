import express from "express";
import {
  getStudies,
  getStudy,
  postStudy,
  patchStudy,
  deleteStudyCtrl,
} from "../src/controllers/studyController.js";

const router = express.Router();

router.get("/", getStudies);
router.get("/:id", getStudy);
router.post("/", postStudy);
router.patch("/:id", patchStudy);
router.delete("/:id", deleteStudyCtrl);

export default router;
