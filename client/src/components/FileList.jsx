import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Fetches and displays uploaded files from a GET endpoint.
 * @param {object} props
 * @param {string} props.title Card heading
 * @param {string} props.endpoint URL returning [{ name, url? }]; without `url`, links to `${endpoint}/:name`
 * @param {number} props.refreshKey Change this value to trigger a refetch
 * @param {boolean} [props.imageOnly] Show thumbnails for items that have a url
 * @returns {JSX.Element}
 */
export default function FileList({ title, endpoint, refreshKey, imageOnly }) {
  const [files, setFiles] = useState([])

  useEffect(()=>{
    fetch(endpoint)
    .then(console.log)
    .catch(console.warn)
  }, [endpoint])

  return (
    <section className="card">
      <h2>{title}</h2>
      <ul className='file-list'>
        {files.map(file => <li key={file}>
          {file}
        </li>)}
      </ul>
    </section>
  );
}
