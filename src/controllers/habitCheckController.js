import prisma from '../lib/prisma.js';
import dayjs from '../utils/dayjs.js';
import { toggleToday as toggleHabitToday } from '../services/habitCheckService.js';
import { getWeeklyHabitsForStudy } from '../services/habitCheckService.js';

export const getWeeklyHabitCheck = async (req, res, next) => {
  try {
    const { studyId, habitId } = req.params;

    const startOfWeekKst = dayjs().tz('Asia/Seoul').startOf('week').add(1, 'day').startOf('day');
    const endOfWeekKst = startOfWeekKst.add(6, 'day').endOf('day');

    const rows = await prisma.habitCheck.findMany({
      where: {
        studyId,
        habitId,
        checkDate: {
          gte: startOfWeekKst.toDate(),
          lte: endOfWeekKst.toDate(),
        },
      },
      orderBy: { checkDate: 'asc' },
      select: { checkDate: true, isCompleted: true },
    });

    const data = rows.map((r) => ({
      date: dayjs(r.checkDate).tz('Asia/Seoul').format('YYYY-MM-DD'),
      isCompleted: r.isCompleted,
    }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const toggleTodayHabitCheck = async (req, res, next) => {
  try {
    const { studyId, habitId } = req.params;

    const result = await toggleHabitToday({ studyId, habitId });
    return res.status(200).json({
      success: true,
      data: {
        date: result.checkDateKST,
        isCompleted: result.isCompleted,
        pointTotal: result.pointTotal,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getWeeklyHabitsForStudyCtrl = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const data = await getWeeklyHabitsForStudy(studyId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
