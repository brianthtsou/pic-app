import { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Comment } from "../types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface ImageCommentListProps {
  allComments: Comment[];
  onCommentDelete: (commentId: number) => void;
  onCommentEdit: (commentId: number) => void;
}

const ImageCommentList = (props: ImageCommentListProps) => {
  const { allComments, onCommentDelete, onCommentEdit } = props;
  const [menuSelectedComment, setMenuSelectedComment] =
    useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<null | number>(
    null
  );
  const open = Boolean(menuSelectedComment);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    commentId: number
  ) => {
    setMenuSelectedComment(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleClose = () => {
    setMenuSelectedComment(null);
    setSelectedCommentId(null);
  };

  const handleEdit = () => {
    if (selectedCommentId) {
      onCommentEdit(selectedCommentId);
    } else {
      console.error("Failed to edit comment: no comment ID selected.");
    }
  };

  const handleDelete = () => {
    if (selectedCommentId) {
      setMenuSelectedComment(null);
      onCommentDelete(selectedCommentId);
    } else {
      console.error("Failed to delete comment: no comment ID selected.");
    }
  };

  return (
    <Box>
      <List sx={{ width: "80%" }}>
        {allComments.map((comment) => (
          <Fragment key={comment.comment_id}>
            <ListItem>
              <ListItemText>{comment.comment_text}</ListItemText>
              <IconButton
                aria-label="options"
                onClick={(event) => handleClick(event, comment.comment_id)}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
            <Divider component="li" />
          </Fragment>
        ))}
      </List>
      <Menu open={open} anchorEl={menuSelectedComment} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ImageCommentList;
