import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

export interface ImageDetailDialogProps {
  open: boolean;
  selectedImageUrl: string;
  handleClose: () => void;
}
const ImageDetailDialog = (props: ImageDetailDialogProps) => {
  const { handleClose, selectedImageUrl, open } = props;

  return (
    <Dialog onClose={handleClose} open={open}>
      <img src={selectedImageUrl}></img>
    </Dialog>
  );
};

export default ImageDetailDialog;
