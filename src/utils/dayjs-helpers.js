import dayjs from './dayjs.js';

export const kstToday = () => {
  return dayjs().tz('Asia/Seoul').startOf('day').toDate();
};

export const kstConvert = (date) => {
  return dayjs(date).tz('Asia/Seoul').startOf('day').toDate();
};

// 오늘(KST) 00:00:00
export const kstStartOfToday = () => {
  return dayjs().tz('Asia/Seoul').startOf('day');
};

// 오늘(KST) 23:59:59
export const kstEndOfToday = () => {
  return dayjs().tz('Asia/Seoul').endOf('day');
};

export const kstThisWeekRange = () => {
  const start = dayjs().tz('Asia/Seoul').startOf('week').add(1, 'day').startOf('day');
  const end = start.add(6, 'day').endOf('day');
  return { start, end };
};
