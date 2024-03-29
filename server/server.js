const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'Data/');
  },
  filename: function(req, file, cb) {
    // Clear the directory before saving a new file
    fs.readdir('Data/', (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(`Data/${file}`, err => {
          if (err) throw err;
        });
      }
    });

    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

app.get('/print', (req, res) => {
  // List files in Data directory
  fs.readdir('Data/', (err, files) => {
    if (err) {
      console.error(`Error reading Data directory: ${err}`);
      return res.status(500).send('Error processing file.');
    }

    if (files.length === 0) {
      return res.status(400).send('No file stored.');
    }

    const storedFileName = files[0]; // Assuming only one file is stored at a time

    exec(`lp ./Data/${storedFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error executing command.');
      }
      console.log(stdout); // Print file content to server console

      // Clear the directory after printing
      fs.unlink(`./Data/${storedFileName}`, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return res.status(500).send('Error deleting file after printing.');
        }
        res.send('File printed and deleted successfully.');
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
