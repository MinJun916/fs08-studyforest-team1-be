// 라이브러리 import
import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import helmet from "helmet";

// Swagger 설정
import { specs, swaggerUiOptions } from "./swaggerOptions.js";

// 라우트 파일들을 import 합니다
import habitRouter from "./routes/habitRoutes.js";
import habitCheckRouter from "./routes/habitCheckRoutes.js";
import habitModifyRouter from "./routes/habitModifyRoutes.js";
import studyRouter from "./routes/studyRoutes.js";
import emojiRouter from "./routes/emojiRoutes.js";
import focusRouter from "./routes/focusRoutes.js";
import pointRouter from "./routes/pointRoutes.js";

const app = express();

// Render 프록시 신뢰
app.set("trust proxy", 1);

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// Morgan 로깅
app.use(morgan("combined"));

// ... API Router 연결
app.use("/habits", habitRouter);
app.use("/habitChecks", habitCheckRouter);
app.use("/habitModify", habitModifyRouter);
app.use("/studies", studyRouter);
app.use("/emojis", emojiRouter);
app.use("/focuses", focusRouter);
app.use("/points", pointRouter);

// Swagger API Docs Setting
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// 헬스 체크 엔드포인트
/**
 * @swagger
 * /health:
 *   get:
 *     summary: 서버 헬스 체크
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 서버 상태 OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `경로 ${req.originalUrl}를 찾을 수 없습니다.`,
  });
});

// Global 에러 핸들러
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
