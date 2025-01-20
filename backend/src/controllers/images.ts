import { Request, Response, Router } from "express";
import { MulterS3File } from "../types";
import { query } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { authenticateToken } from "../utils/middleware";
import s3Upload from "../utils/s3_upload";

const imagesRouter = Router();

dotenv.config({ path: "../.env" });

imagesRouter.get("/upload", (req: Request, res: Response): any => {
  return res.status(200).send("OK");
});

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
      const user = req.user;
      console.log(user);
      console.log(file);
      if (!file) {
        res.status(400).send("File not uploaded.");
        return;
      }
      const { key, bucket, size, mimetype, originalname } =
        file as unknown as MulterS3File;
      const description = req.body.description || "";

      const userIdQuery = await query(
        "SELECT user_id FROM users WHERE username = ($1)",
        [req.user.username]
      );

      const userId = userIdQuery.rows[0].user_id;
      console.log(userId);
      const result = await query(
        "INSERT INTO images (user_id, s3_key, bucket_name, file_name, file_size, file_type, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [userId, key, bucket, originalname, size, mimetype, description]
      );
      res.status(200).json({ message: "File uploaded successfully.", file });
      return;
    } catch (err) {
      res.status(500).send("Error uploading file. Internal server error.");
    }
  }
);

module.exports = imagesRouter;
