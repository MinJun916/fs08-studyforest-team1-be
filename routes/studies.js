import express from "express";
import {
  getStudies,
  getStudy,
  postStudy,
  patchStudy,
  deleteStudyCtrl,
  mapValidationError,
} from "../src/controllers/studyController.js";

const router = express.Router();

////////////////////// study routes /////////////////////
router.get("/", getStudies);
router.get("/:id", getStudy);
router.post("/", postStudy);
router.patch("/:id", patchStudy);
router.delete("/:id", deleteStudyCtrl);

// Validation 에러 매핑
router.use(mapValidationError);

export default router;
