import dayjs from "./dayjs.js";

export const kstToday = () => {
  return dayjs().tz("Asia/Seoul").startOf("day").toDate();
};

export const kstConvert = (date) => {
  return dayjs(date).tz("Asia/Seoul").startOf("day").toDate();
};
