import {
  Box,
  Button,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import FlipIcon from "@mui/icons-material/Flip";
import { useEffect, useRef, useState } from "react";
import ImageEditorModal from "./ImageEditorModal";

interface EditorProps {
  image: string | null;
}

export const Editor: React.FC<EditorProps> = ({ image }) => {
  const [height, setHeight] = useState<number>(400);
  const [width, setWidth] = useState<number>(400);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [exposure, setExposure] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [arbitraryRotation, setArbitraryRotation] = useState<number>(0);
  const [filter, setFilter] = useState<string>("none");
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(6500);
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

          const exposureFactor = exposure / 100;

          let filterString = `brightness(${
            brightness * exposureFactor
          }%) contrast(${contrast}%) saturate(${saturation}%)`;

          switch (filter) {
            case "grayscale":
              filterString += " grayscale(100%)";
              break;
            case "sepia":
              filterString += " sepia(100%)";
              break;
            case "vintage":
              filterString += " sepia(70%) contrast(85%) saturate(120%)";
              break;
            default:
              break;
          }

          ctx.filter = filterString;

          ctx.resetTransform();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(((rotation + arbitraryRotation) * Math.PI) / 180);

          const scaleX = flipHorizontal ? -1 : 1;
          const scaleY = flipVertical ? -1 : 1;
          ctx.scale(scaleX, scaleY);

          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          ctx.drawImage(img, 0, 0, width, height);

          applyTemperatureFilter(ctx, temperature, width, height);
        }
      };
    }
  }, [
    preview,
    image,
    width,
    height,
    brightness,
    contrast,
    saturation,
    exposure,
    rotation,
    filter,
    flipHorizontal,
    flipVertical,
    temperature,
    arbitraryRotation,
  ]);

  const applyTemperatureFilter = (
    ctx: CanvasRenderingContext2D,
    temperature: number,
    width: number,
    height: number
  ) => {
    const warmColor = `rgba(255, 165, 0, ${Math.min(
      (temperature - 6500) / 3500,
      1
    )})`;
    const coolColor = `rgba(0, 191, 255, ${Math.min(
      (6500 - temperature) / 3500,
      1
    )})`;

    if (temperature > 6500) {
      ctx.fillStyle = warmColor;
    } else if (temperature < 6500) {
      ctx.fillStyle = coolColor;
    } else {
      return;
    }

    ctx.globalCompositeOperation = "overlay";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  };

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

  const rotateImageBy45Degrees = () => {
    setRotation((prevRotation) => (prevRotation + 45) % 360);
  };

  const rotateImageBy90Degrees = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
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
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1">Filter</Typography>
            <Select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="grayscale">Black & White</MenuItem>
              <MenuItem value="sepia">Sepia</MenuItem>
              <MenuItem value="vintage">Vintage</MenuItem>
            </Select>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Brightness</Typography>
            <Slider
              value={brightness}
              onChange={(_e, newValue) => setBrightness(newValue as number)}
              aria-labelledby="brightness-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Contrast</Typography>
            <Slider
              value={contrast}
              onChange={(_e, newValue) => setContrast(newValue as number)}
              aria-labelledby="contrast-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Saturation</Typography>
            <Slider
              value={saturation}
              onChange={(_e, newValue) => setSaturation(newValue as number)}
              aria-labelledby="saturation-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">Exposure</Typography>
            <Slider
              value={exposure}
              onChange={(_e, newValue) => setExposure(newValue as number)}
              aria-labelledby="exposure-slider"
              min={0}
              max={200}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1">Temperature</Typography>
            <TextField
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              size="small"
              label="Temperature"
              variant="outlined"
            />
            <Slider
              value={temperature}
              onChange={(_e, newValue) => setTemperature(newValue as number)}
              aria-labelledby="temperature-slider"
              min={0}
              max={10000}
              step={100}
            />
          </Box>
          <Box gap={1} display="flex" flexDirection="column">
            <Typography variant="body1">Rotate</Typography>
            <Box display="flex" gap={2}>
              <Button
                onClick={rotateImageBy90Degrees}
                size="small"
                variant="outlined"
              >
                90°
              </Button>
              <Button
                onClick={rotateImageBy45Degrees}
                size="small"
                variant="outlined"
              >
                45°
              </Button>
              <TextField
                type="number"
                sx={{ width: "100px" }}
                value={arbitraryRotation}
                onChange={(e) => setArbitraryRotation(Number(e.target.value))}
                size="small"
                label="Angle"
                variant="outlined"
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body1">Flip</Typography>
              <Box display="flex" gap={2}>
                <Button
                  onClick={() => setFlipHorizontal((prev) => !prev)}
                  size="small"
                  variant="outlined"
                >
                  <FlipIcon fontSize="small" />
                </Button>
                <Button
                  onClick={() => setFlipVertical((prev) => !prev)}
                  size="small"
                  variant="outlined"
                >
                  <FlipIcon
                    fontSize="small"
                    sx={{ transform: "rotate(90deg)" }}
                  />
                </Button>
              </Box>
            </Box>
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
