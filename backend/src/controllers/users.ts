import { Request, Response } from "express";
import { query } from "../db";
import { authenticateToken } from "../utils/middleware";
import { supabase } from "../supabase";
import { dataAttr } from "@chakra-ui/react/dist/types/utils";

const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();

const posts = [
  {
    id: 1,
    username: "test1",
    title: "Post 1",
  },
  {
    id: 2,
    username: "test123",
    title: "Post 2",
  },
];

userRouter.get("/posts", authenticateToken, (req: Request, res: Response) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

// Get user information
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Supabase query failed" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error.");
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

    const { error, data } = await supabase
      .from("users")
      .insert({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password_hash: passwordHash,
      })
      .select();
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Supabase query failed" });
    }
    return res.status(201).json({
      message: "User added successfully.",
      user: data?.[0]?.username,
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
