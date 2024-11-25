import { Request, Response, Router } from "express";
import { query } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const authRouter = Router();

dotenv.config({ path: "../.env" });

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
      const result = await query(
        "SELECT password_hash FROM users WHERE username = ($1)",
        [username]
      );
      if (result.rows.length > 0 && result.rows[0].password_hash) {
        passwordHashDb = result.rows[0].password_hash;
      } else {
        res.status(404).send("User not found.");
        return;
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

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({ accessToken: accessToken });
    return;
  }
);

module.exports = authRouter;
