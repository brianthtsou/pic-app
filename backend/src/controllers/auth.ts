import { Request, Response, Router } from "express";
import { query } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { supabase } from "../supabase";

const authRouter = Router();

// Authenticate user
authRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    // Retrieve username & password from request, fail if one is missing
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Username or password missing.");
      return;
    }

    // Retrieve password hash from database
    let passwordHashDb: string = "";

    try {
      const { data, error } = await supabase
        .from("users")
        .select("password_hash")
        .eq("username", username)
        .single();
      if (error || !data) {
        res.status(404).send("User not found.");
        return;
      } else {
        passwordHashDb = data.password_hash;
      }
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Error connecting to the database.");
      return;
    }

    // Match password hash to password entered
    const passwordCorrect = await bcrypt.compare(password, passwordHashDb);

    if (!passwordCorrect) {
      res.status(401).send("Incorrect username or password.");
      return;
    }

    // If password verified, return access token
    const user = { username: username };

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not set in environment variables."
      );
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        "REFRESH_TOKEN_SECRET is not set in environment variables."
      );
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    res.status(200).json({
      accessToken: `Bearer ${accessToken}`,
      refreshToken: refreshToken,
    });
    return;
  }
);

authRouter.post("/token", (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  return;
});

module.exports = authRouter;
