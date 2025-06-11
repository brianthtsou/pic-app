import { Request, Response, Router } from "express";
import { MulterS3File } from "../types";
import dotenv from "dotenv";
import { authenticateToken, apiRequestLog } from "../utils/middleware";
import { s3Upload, s3Get, s3Delete } from "../utils/s3";
import { supabase } from "../supabase";

const imagesRouter = Router();

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
  apiRequestLog,
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

      if (insertQueryError) {
        console.error("!!! Supabase Insert Error:", insertQueryError);
        // Send the actual error back to the frontend
        res.status(400).json({
          message: "Database insertion failed.",
          error: insertQueryError,
        });
        return;
      }

      res.status(200).json({ message: "File uploaded successfully.", file });
      return;
    } catch (err) {
      res.status(500).send("Error uploading file. Internal server error.");
    }
  }
);

imagesRouter.delete(
  "/:imageId",
  apiRequestLog,
  authenticateToken,
  async (req: Request, res: Response) => {
    const imageId = parseInt(req.params.imageId);
    const user = req.user;
    let imageS3Key: string;

    if (isNaN(imageId)) {
      res.status(400).send("Invalid Image ID format.");
      return;
    }
    console.log(user);

    try {
      // retrieve image info from db
      const { data: s3KeyQuery, error: s3KeyQueryError } = await supabase
        .from("images")
        .select("s3_key")
        .eq("image_id", imageId)
        .single();

      if (s3KeyQueryError || !s3KeyQuery) {
        res.status(404).send("S3 key not found.");
        return;
      }
      imageS3Key = s3KeyQuery.s3_key;

      // delete image from S3
      await s3Delete(imageS3Key);

      // delete image data from DB
      const { error: deleteImageDataError } = await supabase
        .from("images")
        .delete()
        .eq("image_id", imageId);

      if (deleteImageDataError) {
        throw deleteImageDataError;
      }

      res.status(200).send("Image deleted successfully from S3 and database.");
    } catch (err) {
      console.error("Error during image deletion process:", err);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = imagesRouter;
