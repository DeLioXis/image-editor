import React, { useRef } from "react";
import { Modal, Button, Box } from "@mui/material";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ReactCropperElement } from "react-cropper";

interface ImageEditorModalProps {
  open: boolean;
  image: string | null;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  open,
  image,
  onClose,
  onSave,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleSave = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const croppedImage = URL.createObjectURL(blob);
          onSave(croppedImage);
        }
      }, "image/png");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "80%",
          height: "80%",
          margin: "auto",
          bgcolor: "background.paper",
          padding: 2,
        }}
      >
        {image && (
          <Cropper
            src={image}
            ref={cropperRef}
            style={{ height: "80%", width: "100%" }}
            aspectRatio={1}
            guides={false}
            cropBoxResizable
          />
        )}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageEditorModal;
