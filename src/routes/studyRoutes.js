import express from 'express';
import {
  getStudies,
  getStudy,
  postStudy,
  patchStudy,
  deleteStudyCtrl,
} from '../controllers/studyController.js';

const router = express.Router();

/**
 * @swagger
 * /studies:
 *   get:
 *     summary: 스터디 목록 조회
 *     tags: [Studies]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: 조회 시작 오프셋 (기본 0)
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: 한 번에 조회할 개수 (기본 10)
 *         example: 6
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *             - points
 *             - points_desc
 *             - points_asc
 *           default: newest
 *         description: 정렬 방식 (newest - 최신순 | oldest - 오래된순 | points - 점수높은순 | points_desc - 점수높은순 | points_asc - 점수낮은순)
 *         example: newest
 *     responses:
 *       200:
 *         description: 스터디 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Study'
 *                       - type: object
 *                         properties:
 *                           totalPoints:
 *                             type: number
 *                             description: "스터디의 총 포인트"
 *                             example: 150
 *                           emojis:
 *                             type: array
 *                             description: "스터디에 등록된 이모지 목록 (카운트 내림차순)"
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                                 studyId:
 *                                   type: string
 *                                   format: uuid
 *                                   example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                                 emojiType:
 *                                   type: string
 *                                   example: "👍"
 *                                 count:
 *                                   type: integer
 *                                   example: 5
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-01-07T10:30:00.000Z"
 *                                 updatedAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-01-07T15:45:00.000Z"
 *                 totalCount:
 *                   type: integer
 *                   description: 전체 스터디 개수
 *                   example: 15
 *             examples:
 *               success:
 *                 summary: 성공 응답 예시
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e"
 *                       nickName: "테스트유저"
 *                       studyName: "영어 공부"
 *                       description: "매일 영어 단어 암기"
 *                       backgroundImg: "blue"
 *                       totalPoints: 150
 *                       createdAt: "2025-01-11T04:00:00.000Z"
 *                       emojis:
 *                         - id: "550e8400-e29b-41d4-a716-446655440000"
 *                           studyId: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e"
 *                           emojiType: "👍"
 *                           count: 5
 *                           createdAt: "2025-01-07T10:30:00.000Z"
 *                           updatedAt: "2025-01-07T15:45:00.000Z"
 *                         - id: "550e8400-e29b-41d4-a716-446655440001"
 *                           studyId: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e"
 *                           emojiType: "🎯"
 *                           count: 3
 *                           createdAt: "2025-01-07T10:30:00.000Z"
 *                           updatedAt: "2025-01-07T15:45:00.000Z"
 *                   totalCount: 15
 *       400:
 *         description: 잘못된 요청 (잘못된 매개변수)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "잘못된 매개변수입니다"
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다"
 */
router.get('/', getStudies);

/**
 * @swagger
 * /studies/{id}:
 *   get:
 *     summary: 스터디 상세 조회
 *     tags: [Studies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 스터디 상세
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Study'
 *                     - type: object
 *                       properties:
 *                         isDeleted:
 *                           type: boolean
 *                           description: "스터디 삭제 여부"
 *                           example: false
 *                         weeklyHabits:
 *                           type: array
 *                           description: 이번주(월~일) 각 습관의 체크 상태
 *                           items:
 *                             type: object
 *                             properties:
 *                               habitId:
 *                                 type: string
 *                                 format: uuid
 *                                 example: "5f7d8c9a-1234-4bcd-9ef0-abcdef123456"
 *                               habitName:
 *                                 type: string
 *                                 example: "영어 단어 30개 암기"
 *                               checks:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     date:
 *                                       type: string
 *                                       format: date
 *                                       example: "2025-01-07"
 *                                     isCompleted:
 *                                       type: boolean
 *                                       example: true
 */
router.get('/:id', getStudy);

/**
 * @swagger
 * /studies:
 *   post:
 *     summary: 스터디 생성
 *     description: 스터디 생성 시 자동으로 포인트가 생성됩니다.
 *     tags: [Studies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *               studyName:
 *                 type: string
 *               description:
 *                 type: string
 *               backgroundImg:
 *                 type: string
 *                 enum:
 *                   - green
 *                   - yellow
 *                   - blue
 *                   - pink
 *                   - alvaro
 *                   - mikey
 *                   - andrew
 *                   - chris
 *                 description: "스터디 배경 이미지 (green: #E1EDDE, yellow: #FFF1CC, blue: #E0F1F5, pink: #FDE0E9, alvaro: 이미지1, mikey: 이미지2, andrew: 이미지3, chris: 이미지4)"
 *               password:
 *                 type: string
 *             required:
 *               - nickName
 *               - studyName
 *               - password
 *           examples:
 *             green_background:
 *               summary: "Green Background Example"
 *               value:
 *                 nickName: "테스트2"
 *                 studyName: "테스트 스터디"
 *                 description: "샘플 설명입니다."
 *                 backgroundImg: "green"
 *                 password: "secret-password"
 *             yellow_background:
 *               summary: "Yellow Background Example"
 *               value:
 *                 nickName: "개발자"
 *                 studyName: "JavaScript 스터디"
 *                 description: "ES6+ 문법 완벽 정복"
 *                 backgroundImg: "yellow"
 *                 password: "js123"
 *             blue_background:
 *               summary: "Blue Background Example"
 *               value:
 *                 nickName: "프론트엔드"
 *                 studyName: "React 스터디"
 *                 description: "React 기초부터 심화까지"
 *                 backgroundImg: "blue"
 *                 password: "react123"
 *             pink_background:
 *               summary: "Pink Background Example"
 *               value:
 *                 nickName: "디자이너"
 *                 studyName: "UI/UX 스터디"
 *                 description: "사용자 경험 개선하기"
 *                 backgroundImg: "pink"
 *                 password: "design456"
 *             alvaro_background:
 *               summary: "Alvaro Background Example"
 *               value:
 *                 nickName: "백엔드"
 *                 studyName: "Node.js 스터디"
 *                 description: "서버 개발 마스터하기"
 *                 backgroundImg: "alvaro"
 *                 password: "node789"
 *             mikey_background:
 *               summary: "Mikey Background Example"
 *               value:
 *                 nickName: "풀스택"
 *                 studyName: "Vue.js 스터디"
 *                 description: "Vue 3 Composition API"
 *                 backgroundImg: "mikey"
 *                 password: "vue456"
 *             andrew_background:
 *               summary: "Andrew Background Example"
 *               value:
 *                 nickName: "알고리즘"
 *                 studyName: "알고리즘 스터디"
 *                 description: "코딩 테스트 준비"
 *                 backgroundImg: "andrew"
 *                 password: "algo123"
 *             chris_background:
 *               summary: "Chris Background Example"
 *               value:
 *                 nickName: "데이터"
 *                 studyName: "데이터 분석 스터디"
 *                 description: "Python으로 데이터 분석하기"
 *                 backgroundImg: "chris"
 *                 password: "data789"
 *     responses:
 *       201:
 *         description: 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Study'
 */
router.post('/', postStudy);

/**
 * @swagger
 * /studies/{id}:
 *   patch:
 *     summary: 스터디 수정
 *     tags: [Studies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *               studyName:
 *                 type: string
 *               description:
 *                 type: string
 *               backgroundImg:
 *                 type: string
 *                 enum:
 *                   - green
 *                   - yellow
 *                   - blue
 *                   - pink
 *                   - alvaro
 *                   - mikey
 *                   - andrew
 *                   - chris
 *                 description: "스터디 배경 이미지 (green: #E1EDDE, yellow: #FFF1CC, blue: #E0F1F5, pink: #FDE0E9, alvaro: 이미지1, mikey: 이미지2, andrew: 이미지3, chris: 이미지4)"
 *               password:
 *                 type: string
 *           examples:
 *             green_background:
 *               summary: "Green Background Update"
 *               value:
 *                 nickName: "테스트3"
 *                 studyName: "Updated Study Name"
 *                 description: "업데이트된 설명"
 *                 backgroundImg: "green"
 *                 password: "update123"
 *             yellow_background:
 *               summary: "Yellow Background Update"
 *               value:
 *                 nickName: "스터디장"
 *                 studyName: "JavaScript 마스터"
 *                 description: "ES6+ 문법 완벽 정복"
 *                 backgroundImg: "yellow"
 *                 password: "js456"
 *             blue_background:
 *               summary: "Blue Background Update"
 *               value:
 *                 nickName: "프론트엔드"
 *                 studyName: "React 고급 스터디"
 *                 description: "React Hooks와 Context API"
 *                 backgroundImg: "blue"
 *                 password: "react789"
 *             pink_background:
 *               summary: "Pink Background Update"
 *               value:
 *                 nickName: "디자이너"
 *                 studyName: "Figma 마스터"
 *                 description: "UI/UX 디자인 실무"
 *                 backgroundImg: "pink"
 *                 password: "figma123"
 *             alvaro_background:
 *               summary: "Alvaro Background Update"
 *               value:
 *                 nickName: "백엔드"
 *                 studyName: "Express.js 스터디"
 *                 description: "RESTful API 개발"
 *                 backgroundImg: "alvaro"
 *                 password: "express456"
 *             mikey_background:
 *               summary: "Mikey Background Update"
 *               value:
 *                 nickName: "풀스택"
 *                 studyName: "Next.js 스터디"
 *                 description: "풀스택 개발하기"
 *                 backgroundImg: "mikey"
 *                 password: "nextjs789"
 *             andrew_background:
 *               summary: "Andrew Background Update"
 *               value:
 *                 nickName: "알고리즘"
 *                 studyName: "LeetCode 스터디"
 *                 description: "코딩 테스트 완벽 준비"
 *                 backgroundImg: "andrew"
 *                 password: "leetcode123"
 *             chris_background:
 *               summary: "Chris Background Update"
 *               value:
 *                 nickName: "데이터"
 *                 studyName: "Pandas 스터디"
 *                 description: "데이터 분석과 시각화"
 *                 backgroundImg: "chris"
 *                 password: "pandas456"
 *     responses:
 *       200:
 *         description: 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Study'
 */
router.patch('/:id', patchStudy);

/**
 * @swagger
 * /studies/{id}:
 *   delete:
 *     summary: 스터디 삭제
 *     tags: [Studies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: "스터디 삭제 검증용 비밀번호"
 *             required:
 *               - password
 *           example:
 *             password: "hashed-password"
 *     responses:
 *       204:
 *         description: 삭제됨
 */
router.delete('/:id', deleteStudyCtrl);

export default router;
