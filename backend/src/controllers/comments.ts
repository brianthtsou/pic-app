import { supabase } from "../supabase";
import { Request, Response, Router } from "express";
import { authenticateToken, apiRequestLog } from "../utils/middleware";

const commentsRouter = Router();

commentsRouter.get(
  ":/imageId",
  apiRequestLog,
  authenticateToken,
  async (req: Request, res: Response) => {
    const imageId = parseInt(req.params.imageId);

    if (isNaN(imageId)) {
      res.status(400).send("Invalid Image ID format.");
      return;
    }

    try {
      const { data: commentsQuery, error: commentsQueryError } = await supabase
        .from("comments")
        .select("comment_text, user_id, created_at, users ( username )")
        .eq("image_id", imageId)
        .order("created_at", { ascending: true });

      if (commentsQueryError || !commentsQuery) {
        res.status(404).send("Comments not found.");
        return;
      }
      res.status(200).json(commentsQuery);
    } catch (err) {
      console.error("Error during comment retrieval process:", err);
      res.status(500).send("Internal server error.");
    }
  }
);

commentsRouter.post(
  ":/imageId",
  apiRequestLog,
  authenticateToken,
  async (req: Request, res: Response) => {
    const imageId = parseInt(req.params.imageId);

    if (isNaN(imageId)) {
      res.status(400).send("Invalid Image ID format.");
      return;
    }

    try {
      const user = req.user;
      const { comment_text } = req.body;
      const { data: newComment, error: newCommentError } = await supabase
        .from("comments")
        .insert({
          image_id: imageId,
          user_id: user.user_id,
          comment_text: comment_text,
        })
        .select()
        .single();

      if (newCommentError || !newComment) {
        res.status(404).send("Comment posting failed.");
        return;
      }
      res.status(201).json(newComment);
    } catch (err) {
      console.error("Error during comment posting process:", err);
      res.status(500).send("Internal server error.");
    }
  }
);
