// dayjs 라이브러리 기본 설정 파일
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// 플러그인 세팅
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
