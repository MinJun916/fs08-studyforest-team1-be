import {
  renameHabit,
  endHabitToday,
  createHabitToday,
} from "../services/habitModifyService.js";

export const modifyHabit = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { name, studyId } = req.body;

    const habit = await renameHabit({ habitId, studyId, name });
    return res.status(200).json({ success: true, habit });
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { studyId } = req.body;

    const result = await endHabitToday({ habitId, studyId });
    return res.status(200).json({ success: true, ended: result });
  } catch (err) {
    next(err);
  }
};

export const postHabitFromToday = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    const habit = await createHabitToday({ studyId, name });
    return res.status(201).json({ success: true, habit });
  } catch (err) {
    next(err);
  }
};
