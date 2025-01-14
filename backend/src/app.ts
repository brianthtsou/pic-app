import express from "express";
import cors from "cors";

const app = express();
const userRouter = require("./controllers/users");
const authRouter = require("./controllers/auth");
const imagesRouter = require("./controllers/images");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/images", imagesRouter);

module.exports = app;
