import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// ...

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
