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
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: 알고리즘 스터디
 *         description:
 *           type: string
 *           example: 매주 월/수/금 알고리즘 문제 풀이
 *     Emoji:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: thumbs_up
 *         unicode:
 *           type: string
 *           example: U+1F44D
 */

