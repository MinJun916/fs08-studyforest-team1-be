import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs, swaggerUiOptions } from "./src/swaggerOptions.js";
import morgan from "morgan";
import bcrypt from "bcryptjs";

dotenv.config();

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger API Docs Setting
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// Morgan 로깅
app.use(morgan("combined"));

// ... API 코드를 작성해 주세요.

// 오늘의 습관 API
app.get("/studies/:studyId/habits", async (req, res) => {
  const { studyId } = req.params;
  const password =
    typeof req.query.password === "string" ? req.query.password : undefined;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "비밀번호를 입력해주세요" });
  }

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { id: true, password: true },
  });

  if (!study) {
    return res
      .status(404)
      .json({ success: false, message: "스터디를 찾을 수 없습니다" });
  }

  const okStudy = await bcrypt.compare(password, study.password);
  if (!okStudy) {
    return res.status(401).json({ success: false, message: "비빌번호 불일치" });
  }

  const habits = await prisma.habit.findMany({
    where: { studyId },
    select: { id: true, name: true },
  });

  return res.json({ success: true, habits });
});

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
