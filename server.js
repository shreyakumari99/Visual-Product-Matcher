const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Save the file path
  const uploadedFilePath = path.join(__dirname, req.file.path);

  // Return the file path to the frontend
  res.json({ uploaded_image: req.file.filename });

  // Call the Python script to process the image using CLIP
  exec(`python3 backend/clip_model.py "${uploadedFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Error processing the image with CLIP.' });
    }

    // Parse the output from Python and return to frontend
    const predictions = JSON.parse(stdout);
    res.json({ similar_products: predictions });

    // Optionally, delete the uploaded image after processing to save space
    fs.unlinkSync(uploadedFilePath);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
