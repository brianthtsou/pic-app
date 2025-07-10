import { supabase } from "../supabase";
import { Request, Response, Router } from "express";
import { authenticateToken, apiRequestLog } from "../utils/middleware";

const commentsRouter = Router();

commentsRouter.get(
  "/:imageId",
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
        .select(
          "comment_text, comment_id, user_id, created_at, users ( username )"
        )
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
  "/:imageId",
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
        res
          .status(404)
          .json({ message: "Comment posting failed.", error: newCommentError });
        return;
      }
      res.status(201).json(newComment);
    } catch (err) {
      console.error("Error during comment posting process:", err);
      res.status(500).send("Internal server error.");
    }
  }
);

commentsRouter.delete(
  "/:commentId",
  apiRequestLog,
  authenticateToken,
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);

    if (isNaN(commentId)) {
      res.status(400).send("Invalid Comment ID format.");
      return;
    }

    const userId = req.user.user_id;

    const { data: userValidationQuery, error: userValidationError } =
      await supabase
        .from("comments")
        .select("user_id")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .single();

    if (userValidationError || !userValidationQuery) {
      res.status(404).json({
        message: "User validation failed.",
        error: userValidationError,
      });
      return;
    }

    const { data: deleteCommentQuery, error: deleteCommentError } =
      await supabase.from("comments").delete().eq("comment_id", commentId);

    if (deleteCommentError) {
      res.status(404).json({
        message: "Comment deletion failed.",
        error: deleteCommentError,
      });
      return;
    }
    res.status(200).send("Comment deleted successfully.");
  }
);

module.exports = commentsRouter;
