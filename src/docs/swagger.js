// docs/swagger.js
// 공통 Swagger JSDoc 정의를 작성하는 파일입니다.

/**
 * @swagger
 * tags:
 *   - name: Studies
 *     description: 스터디 관련 API
 *   - name: Emojis
 *     description: 이모지 관련 API
 *   - name: Habits
 *     description: 습관 목록 조회 및 생성
 *   - name: HabitChecks
 *     description: 습관 체크 조회와 토글 처리
 *   - name: HabitModify
 *     description: 습관 이름 변경, 종료, 생성 관리
 *   - name: Focuses
 *     description: 집중 시간 및 포인트 관련 API
 *   - name: Points
 *     description: 포인트 관련 API
 *   - name: System
 *     description: 서버 헬스체크 등 시스템 엔드포인트
 * components:
 *   schemas:
 *     Study:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nickName:
 *           type: string
 *           example: alice
 *         studyName:
 *           type: string
 *           example: 알고리즘 스터디
 *         description:
 *           type: string
 *           example: 매주 월/수/금 알고리즘 문제 풀이
 *         backgroundImg:
 *           type: string
 *           description: |
 *             허용값 목록:
 *               - "green", "yellow", "blue", "pink", "alvaro", "mikey", "andrew", "chris".
 *               - //green = #E1EDDE
 *               - //yellow = #FFF1CC
 *               - //blue = #E0F1F5
 *               - //pink = #FDE0E9
 *               - //alvaro = 이미지1
 *               - //mikey = 이미지2
 *               - //andrew = 이미지3
 *               - //chris = 이미지4
 *           enum:
 *             - green
 *             - yellow
 *             - blue
 *             - pink
 *             - alvaro
 *             - mikey
 *             - andrew
 *             - chris
 *           example: green
 *         password:
 *           type: string
 *           example: "hashed_password_example"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *     Emoji:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         studyId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         emojiType:
 *           type: string
 *           example: "1f423"
 *         count:
 *           type: integer
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *     Habit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *         studyId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: "영어 단어 30개 암기"
 *         startDate:
 *           type: string
 *           format: date
 *           description: DB에는 Date 타입으로 저장됨
 *           example: "2025-09-02"
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: DB에는 Date 타입으로 저장됨. 종료되지 않았다면 null
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *     HabitCheck:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "7a1b2c3d-4567-89ab-cdef-0123456789ab"
 *         habitId:
 *           type: string
 *           format: uuid
 *           example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *         pointId:
 *           type: string
 *           format: uuid
 *           example: "2c3d4e5f-6789-4abc-def0-1234567890ab"
 *         studyId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         isCompleted:
 *           type: boolean
 *           default: false
 *           example: true
 *         checkDate:
 *           type: string
 *           format: date
 *           description: DB에는 Date 타입으로 저장됨
 *           example: "2025-01-07"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *     Focus:
 *       type: object
 *       description: 스터디 포인트 요약 응답 객체
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 스터디 ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: 스터디 이름
 *           example: 알고리즘 스터디
 *         pointId:
 *           type: string
 *           format: uuid
 *           description: 포인트 레코드 ID
 *           example: "3d4e5f6a-7890-4bcd-ef01-234567890abc"
 *         point:
 *           type: integer
 *           description: 현재 포인트 값
 *           example: 0
 *     Point:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3d4e5f6a-7890-4bcd-ef01-234567890abc"
 *         studyId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         point:
 *           type: integer
 *           default: 0
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *     Focus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "4a5b6c7d-8901-4abc-def0-1234567890ab"
 *         studyId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         time:
 *           type: integer
 *           default: 0
 *           example: 90
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-02T10:00:00.000Z"
 */
