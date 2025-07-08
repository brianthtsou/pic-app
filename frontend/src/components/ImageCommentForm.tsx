import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

interface ImageCommentFormProps {
  onCommentPost: (commentText: string) => void;
}

const ImageCommentForm = (props: ImageCommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const { onCommentPost } = props;
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
      noValidate
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        onCommentPost(commentText);
        setCommentText("");
      }}
    >
      <TextField
        sx={{ width: "80%" }}
        id="standard-basic"
        placeholder="Comment.."
        variant="standard"
        onChange={(e) => setCommentText(e.target.value)}
      />
      <IconButton sx={{ p: 0 }} type="submit">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ImageCommentForm;
