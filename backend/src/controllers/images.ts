import { Request, Response, Router } from "express";
import { query } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { authenticateToken } from "../utils/middleware";
import s3Upload from "../utils/s3_upload";

const imagesRouter = Router();

dotenv.config({ path: "../.env" });

imagesRouter.post(
  "/upload",
  (req, res, next) => {
    // Log basic details of the incoming request
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.originalUrl);
    console.log("Headers:", req.headers);
    console.log("Body (before multer):", req.body);
    next();
  },
  authenticateToken,
  s3Upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).send("File not uploaded.");
        return;
      }
      res.status(200).json({ message: "File uploaded successfully.", file });
      return;
    } catch (err) {
      res.status(500).send("Error uploading file. Internal server error.");
    }
  }
);

module.exports = imagesRouter;
