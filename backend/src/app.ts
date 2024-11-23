import express from "express";
import cors from "cors";

const app = express();
const userRouter = require("./controllers/users");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);

module.exports = app;
