import { verifyStudyPassword } from "../services/globalService.js";
import { getPointByStudy } from "../services/focusService.js";

export const getFocusByStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const password = req.query.password;

    await verifyStudyPassword(studyId, password);

    const focuses = await getPointByStudy(studyId);

    res.status(200).json({ success: true, focuses });
  } catch (err) {
    next(err);
  }
};
