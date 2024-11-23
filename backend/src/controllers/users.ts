import { Request, Response } from "express";
import { query } from "../db";

const userRouter = require("express").Router();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error connecting to the database.");
  }
});

module.exports = userRouter;
