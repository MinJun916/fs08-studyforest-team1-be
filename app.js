import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs, swaggerUiOptions } from "./src/swaggerOptions.js";
import morgan from "morgan";
import study from "./routes/study.js";

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
app.use('/studies', study);

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
