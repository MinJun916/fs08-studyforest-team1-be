// docs/swagger.js
// 공통 Swagger JSDoc 정의를 작성하는 파일입니다.

/**
 * @swagger
 * tags:
 *   - name: Studies
 *     description: 스터디 관련 API
 *   - name: Emojis
 *     description: 이모지 관련 API
 *
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
 */

