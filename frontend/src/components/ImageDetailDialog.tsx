import Dialog from "@mui/material/Dialog";
import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ImageDeleteButton from "@/components/ImageDeleteButton";
import ImageCommentForm from "@/components/ImageCommentForm";
import ImageCommentList from "@/components/ImageCommentList";
import axios from "../services/axios";
import { Comment, Image } from "../types";

export interface ImageDetailDialogProps {
  open: boolean;
  selectedImageUrl: string;
  selectedImageId: number | null;
  handleClose: () => void;
  handleImageDeletion: () => void;
}

const ImageDetailDialog = (props: ImageDetailDialogProps) => {
  const {
    handleClose,
    selectedImageUrl,
    selectedImageId,
    open,
    handleImageDeletion,
  } = props;

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchCommentsData();
  }, [open, selectedImageId]);

  const fetchCommentsData = async () => {
    if (open && selectedImageId) {
      const fetchCommentsData = async () => {
        try {
          const response = await axios.get(`/comments/${selectedImageId}`);
          setComments(response.data);
        } catch (err) {
          console.error("Error retrieving comment data", err);
          setComments([]);
        }
      };

      fetchCommentsData();
    } else {
      setComments([]);
    }
  };

  const handleCommentPost = async (commentText: string) => {
    try {
      const commentData = { comment_text: commentText };
      await axios.post(`/comments/${selectedImageId}`, commentData);
      fetchCommentsData();
    } catch (error) {
      console.error("Error posting comment data", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      fetchCommentsData();
    } catch (error) {
      console.error("Error deleting comment.", error);
    }
  };

  const handleCommentEdit = async (commentId: number) => {};

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <img
            src={selectedImageUrl}
            style={{
              width: "100%", // Make the image take up 100% of its container's width
              height: "auto", // Adjust height automatically to maintain aspect ratio
              display: "block", // Removes extra space below the image
            }}
          ></img>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ImageCommentList
            allComments={comments}
            onCommentDelete={handleCommentDelete}
            onCommentEdit={handleCommentEdit}
          ></ImageCommentList>
          <ImageCommentForm
            onCommentPost={handleCommentPost}
          ></ImageCommentForm>
          <ImageDeleteButton
            imageId={selectedImageId}
            onDeleteSuccess={handleImageDeletion}
          ></ImageDeleteButton>
        </Grid>
      </Grid>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
};

export default ImageDetailDialog;
