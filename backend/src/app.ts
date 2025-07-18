import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const userRouter = require("./controllers/users");
const authRouter = require("./controllers/auth");
const imagesRouter = require("./controllers/images");
const commentsRouter = require("./controllers/comments");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/images", imagesRouter);
app.use("/api/comments", commentsRouter);

module.exports = app;
