import React, { useState } from 'react';
import axios from 'axios';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';

const LoadResume = () => {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loadData } = useResumeStore();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:3000/api/resume-to-json', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      loadData(response.data);
    } catch (err) {
      setError('Error loading resume: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Load Resume'}
        </Button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {resumeData && (
        <div>
          <h2>Resume Data:</h2>
          <pre>{JSON.stringify(resumeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LoadResume;