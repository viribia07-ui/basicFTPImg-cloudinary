import { useEffect, useRef, useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Upload form: picks a file, previews images, and POSTs it as multipart/form-data.
 * @param {object} props
 * @param {string} props.title Card heading
 * @param {JSX.Element} props.icon Icon shown beside the heading
 * @param {string} props.endpoint Upload URL; server reads the "file" field
 * @param {string} [props.accept] Input accept filter, e.g. "image/*"
 * @param {boolean} [props.imageOnly] Reject non-images and show a preview
 * @param {() => void} [props.onUploaded] Called after a successful upload
 * @returns {JSX.Element}
 */
export default function FileUpload({ title, icon, endpoint, accept, imageOnly, onUploaded }) {
  const [file, setFile] = useState(null)
  
  const handleFormSubmit = (e) =>{
    e.preventDefault()

    if (file) {
      const body = new FormData()
      body.append("file", file)
      
      fetch(endpoint, {
        method: "POST",
        body
      })
      .then(console.log)
      .catch(console.warn)
      .finally( ()=>{

      })
    
    } else{
      return toast.warn("Choose a file first!")
    }
  }

  const handleUploadInputChange = (e) =>{ //csekkolja, hogy létezik-e
    console.log('e.target.files: ', e?.target?.files);
    if (e?.target?.files && e?.target?.files[0]) {
      setFile(e?.target?.files[0])
    }
  }

  return (
    <form className="card" onSubmit={handleFormSubmit}>
      <h2>
        {icon} {title}
      </h2>
      <input id='file' type="file" accept={accept}  onChange={handleUploadInputChange}/>


      <button type="submit" >
        <FaUpload /> 
      </button>

    </form>
  );
}
