import { useState } from 'react';
import { FaServer, FaCloud } from 'react-icons/fa';
import FileUpload from './FileUpload.jsx';
import FileList from './FileList.jsx';

// Backend base URL; Vite exposes VITE_* env vars via import.meta.env
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Page with an uploader and a file list for each target (FTP, Cloudinary).
 * @returns {JSX.Element}
 */
export default function UploadPage() {


  return (
    <main className="page">
      <h1>File Upload</h1>
      <div className="columns">
        <div className="column">
          <FileUpload
            title='FTP Upload'
            icon={<FaServer />}
            endpoint='http://localhost:5000/api/upload/ftp'
          />
          <FileList  />
        </div>
        <div className="column">
          <FileUpload
            title='Cloudinary Image Upload'
            icon={<FaCloud />}
            endpoint='http://localhost:5000/api/upload/ftp'
          />
          <FileList

          />
        </div>
      </div>
    </main>
  );
}
