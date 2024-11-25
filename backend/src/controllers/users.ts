import { Request, Response } from "express";
import { query } from "../db";

const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();

// Get all user information
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT id, username FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error connecting to the database.");
  }
});

// Create a new user
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;

    if (!first_name || !last_name || !email || !username || !password) {
      return res.status(400).json({
        message: "Please include all required fields.",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const postRequest = await query(
      `INSERT INTO Users (first_name, last_name, email, username, passwordHash) VALUES ($1, $2, $3, $4, $5) RETURNING username`,
      [first_name, last_name, email, username, passwordHash]
    );
    return res.status(201).json({
      message: "User added successfully.",
      user: postRequest.rows[0],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Database error: ", errorMessage);

    return res.status(500).json({
      message: "Error occurred when adding data to database.",
      err: errorMessage,
    });
  }
});

module.exports = userRouter;
