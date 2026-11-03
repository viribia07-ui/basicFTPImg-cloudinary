import { Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './components/UploadPage.jsx';

/**
 * Root component: defines client-side routes (react-router-dom).
 * Unknown paths redirect to the upload page.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
