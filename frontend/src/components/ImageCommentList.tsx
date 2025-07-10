import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Comment } from "../types";

interface ImageCommentListProps {
  allComments: Comment[];
}

const ImageCommentList = (props: ImageCommentListProps) => {
  const { allComments } = props;
  return (
    <Box>
      <List sx={{ width: "80%" }}>
        {allComments.map((comment) => (
          <ListItem key={comment.comment_id}>
            <ListItemText>{comment.comment_text}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ImageCommentList;
