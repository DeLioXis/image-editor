import { Box, Button, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ImageEditorModal from "./ImageEditorModal";

interface EditorProps {
  image: string | null;
}

export const Edtior: React.FC<EditorProps> = ({ image }) => {
  const [height, setHeight] = useState<number>(400);
  const [width, setWidth] = useState<number>(400);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [preview, setPreview] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (preview || image) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = new Image();
      img.src = preview || image!;

      img.onload = () => {
        if (canvas && ctx) {
          canvas.width = width;
          canvas.height = height;
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
          ctx.drawImage(img, 0, 0, width, height);
        }
      };
    }
  }, [preview, image, width, height, brightness, contrast, saturation]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "edited_image.png";
          link.click();
        }
      }, "image/png");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveCroppedImage = (croppedImage: string) => {
    setPreview(croppedImage);
    handleCloseModal();
  };

  return (
    <>
      <Box gap={4} display="grid" gridTemplateColumns="auto 1fr">
        {image && (
          <>
            <canvas
              ref={canvasRef}
              style={{ width: `${width}px`, height: `${height}px` }}
            ></canvas>
          </>
        )}
        <Box
          height="fit-content"
          display="flex"
          flexDirection="column"
          borderRadius={2}
          padding={2}
          gap={2}
          bgcolor={"background.paper"}
        >
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Crop image
          </Button>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1">Width</Typography>
            <TextField
              type="number"
              onChange={(e) => setWidth(Number(e.target.value))}
              size="small"
              label="Width"
              variant="outlined"
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1">Height</Typography>
            <TextField
              type="number"
              onChange={(e) => setHeight(Number(e.target.value))}
              size="small"
              label="Height"
              variant="outlined"
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Brightness</Typography>
            <Slider
              value={brightness}
              onChange={(e, newValue) => setBrightness(newValue as number)}
              aria-labelledby="brightness-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Contrast</Typography>
            <Slider
              value={contrast}
              onChange={(e, newValue) => setContrast(newValue as number)}
              aria-labelledby="contrast-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Saturation</Typography>
            <Slider
              value={saturation}
              onChange={(e, newValue) => setSaturation(newValue as number)}
              aria-labelledby="saturation-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Button color="success" variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      <ImageEditorModal
        open={modalOpen}
        image={preview || image!}
        onClose={handleCloseModal}
        onSave={handleSaveCroppedImage}
      />
    </>
  );
};
