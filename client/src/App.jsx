import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure you have this CSS file for styling

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadSuccess(false); // Reset upload success flag when a new file is selected
  };

  const handleAction = async (action) => {
    setLoading(true);
    try {
      switch(action) {
        case 'upload':
          const formData = new FormData();
          formData.append('file', file, 'uploadedFile');
          await axios.post('http://192.168.1.45:5000/upload', formData);
          setMessage('File Uploaded Successfully!');
          setUploadSuccess(true); // Set upload success flag
          setTimeout(() => {
            setLoading(false); // Delay the loading state to enable the Print button
          }, 2000); // Wait for 2 seconds before enabling the Print button
          return;
        case 'print':
          await axios.get('http://192.168.1.45:5000/print');
          window.location.reload();
          break;
        case 'reset':
          window.location.reload();
          break;
        default:
          throw new Error('Invalid action');
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>File Operations</h1>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      <button onClick={() => handleAction('upload')} disabled={!file || loading || uploadSuccess}>Upload</button>
      <button onClick={() => handleAction('print')} disabled={!uploadSuccess || loading}>Print</button>
      <button onClick={() => handleAction('reset')} disabled={loading}>Reset</button>
      {loading && <div className="loader"></div>}
      <p>{message}</p>
    </div>
  );
}

export default App;
