const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Set up storage directory and filename format
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'Data/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to upload files
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Please upload a file.' });
  }
  const filePath = `./Data/${file.originalname}`;

  // Execute command to get file information
  exec(`file ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: `Server error: ${error.message}` });
    }
    console.log(stdout); // Print file details to server console

    // Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
        return res.status(500).send({ message: `Error deleting file: ${err.message}` });
      }
      res.send({ message: 'File processed and deleted successfully.', details: stdout });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
