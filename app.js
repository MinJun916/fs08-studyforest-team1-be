// 라이브러리 import
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs, swaggerUiOptions } from "./src/swaggerOptions.js";
import morgan from "morgan";

// 환경변수 설정 로드
// .env 파일에서 PORT, JWT_SECRET, DATABASE_URL 등을 읽어옵니다
dotenv.config();

// 라우트 파일들을 import 합니다
import habitRouter from "./routes/Habit.js";

export const prisma = new PrismaClient();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// Morgan 로깅
app.use(morgan("combined"));

// ... API Router 연결
app.use("/studies", habitRouter);

// Swagger API Docs Setting
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// 404 핸들러
app.use("*", (req, res) => {
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

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
