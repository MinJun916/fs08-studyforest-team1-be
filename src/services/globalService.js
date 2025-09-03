import bcrypt from 'bcryptjs';
import { getStudyWithPassword } from './habitService.js';

export const verifyStudyPassword = async (studyId, password) => {
  if (!password) {
    const e = new Error('PASSWORD_REQUIRED');
    e.status = 400;
    throw e;
  }

  const study = await getStudyWithPassword(studyId);
  if (!study) {
    const e = new Error('STUDY_NOT_FOUND');
    e.status = 404;
    throw e;
  }

  // bcrypt 사용
  const ok = await bcrypt.compare(password, study.password);

  if (!ok) {
    const e = new Error('PASSWORD_MISMATCH');
    e.status = 401;
    throw e;
  }

  return study;
};
