import { Request, Response, Router } from "express";
import { MulterS3File } from "../types";
import dotenv from "dotenv";
import { authenticateToken } from "../utils/middleware";
import s3Upload from "../utils/s3_upload";
import s3Get from "../utils/s3_get";
import { supabase } from "../supabase";

const imagesRouter = Router();

dotenv.config({ path: "../.env" });

imagesRouter.get("/upload", (req: Request, res: Response): any => {
  return res.status(200).send("OK");
});

imagesRouter.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { data: userIdQuery, error: userIdQueryError } = await supabase
      .from("users")
      .select("user_id")
      .eq("username", req.user.username)
      .single();

    if (userIdQueryError || !userIdQuery) {
      res.status(404).send("User not found.");
      return;
    }
    const userId = userIdQuery.user_id;

    const { data: imagesS3KeyQuery, error: imagesS3KeyQueryError } =
      await supabase
        .from("images")
        .select("s3_key, image_id")
        .eq("user_id", userId);

    if (imagesS3KeyQueryError || !imagesS3KeyQuery) {
      res.status(404).send("User not found.");
      return;
    }

    const imagesS3KeyRows = imagesS3KeyQuery;

    const photoUrlPromises = imagesS3KeyRows.map(async (e) => {
      const url = await s3Get(e.s3_key);
      return { image_id: e.image_id, signed_url: url };
    });

    const photoUrlObjects = await Promise.all(photoUrlPromises);

    res.status(200).json({ photoUrls: photoUrlObjects });
  }
);

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
  s3Upload.single("image"),
  authenticateToken,
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

      const { data: userIdQuery, error: userIdQueryError } = await supabase
        .from("users")
        .select("user_id")
        .eq("username", req.user.username)
        .single();

      if (userIdQueryError || !userIdQuery) {
        res.status(404).send("User not found.");
        return;
      }

      const userId = userIdQuery.user_id;

      const { data: insertQuery, error: insertQueryError } = await supabase
        .from("images")
        .insert({
          user_id: userId,
          s3_key: key,
          bucket_name: bucket,
          file_name: originalname,
          file_size: size,
          file_type: mimetype,
          description: description,
        });
      res.status(200).json({ message: "File uploaded successfully.", file });
      return;
    } catch (err) {
      res.status(500).send("Error uploading file. Internal server error.");
    }
  }
);

module.exports = imagesRouter;
