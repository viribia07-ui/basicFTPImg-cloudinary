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


  return (
    <form className="card" >

      <input  type="file" accept={accept}  />


      <button type="submit" >
        <FaUpload /> 
      </button>

    </form>
  );
}
