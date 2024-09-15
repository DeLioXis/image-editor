import { Box, Button, styled, Typography } from "@mui/material";
import "./App.scss";
import { useState, DragEvent } from "react";
import { Edtior } from "./components/Editor/Editor";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
  height: "100%",
});
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const droppedFile = event.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      {file == null ? (
        <Box display="flex" flexDirection="column" gap={2}>
          <Box bgcolor={"background.paper"} padding={2} borderRadius={2}>
            <DropZone
              display="flex"
              flexDirection="column"
              border={1 + "px dashed black"}
              padding={4}
              borderRadius={2}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Typography color="text.secondary" variant="body1">
                Drag and drop image
              </Typography>
            </DropZone>
          </Box>
          <Box display="flex" flexDirection="column" alignItems={"center"}>
            <Typography variant="body1">or</Typography>
          </Box>
          <Button component="label" variant="contained">
            Upload image
            <VisuallyHiddenInput
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              multiple
            />
          </Button>
        </Box>
      ) : (
        <Edtior image={preview} />
      )}
    </>
  );
}

export default App;
