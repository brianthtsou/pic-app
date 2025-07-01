import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ImageDeleteButton from "@/components/ImageDeleteButton";

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
