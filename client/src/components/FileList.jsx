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


  return (
    <section className="card">

    </section>
  );
}
