/**
 * Upload API: accepts files and stores them on an FTP server or in Cloudinary,
 * and exposes GET endpoints to list/download what was uploaded.
 */

// Loads variables from .env into process.env (side-effect import, must run first)
import 'dotenv/config';
// Web framework: routing and middleware
import express from 'express';
// Middleware that sets CORS headers so the browser client (other origin) can call the API
import cors from 'cors';
// Middleware that parses multipart/form-data uploads
import multer from 'multer';
// Used to turn an in-memory Buffer into a stream for FTP upload
import { Readable } from 'stream';
// Safe handling of file names (prevents path traversal)
import path from 'path';
// FTP client
import { Client } from 'basic-ftp';
// Cloudinary SDK (image hosting)
import { v2 as cloudinary } from 'cloudinary';

const app = express();

// Multer middleware config: keep files in memory (req.file.buffer), cap size at 10 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Global middleware: only allow requests from the configured client origin
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

// Credentials come from environment variables, never hard-coded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload/ftp
 * `upload.single('file')` is route-level middleware: it parses the multipart body
 * and exposes the "file" field as req.file before the handler runs.
 * Responds with { message, name }.
 */
app.post('/api/upload/ftp', upload.single('file'), async (req, res) => {
  console.log("req.body: ", req.body);
  console.log("req.file: ", req.file);

  if(!req.file) return res.status(400).json({ error: 'No file provided' });
  
  const ftpClient = new Client()
  try{
    await ftpClient.access({
    host: "192.168.56.1", 
    port: 21,
    user: "tester",
    password: "password",
    secure: "true"
  })
    //ftpClient.ftp.verbose = true
    //await ftpClient.ensureDir("/")
    await ftpClient.uploadFrom(Readable.from(req.file.buffer), path.basename(req.file.originalname))
    //await ftpClient.close()
    
    return res.status(201).json({message: "Upload to FTP"})
  
  } catch (error){
    console.warn(error);
    return res.status(500).json({error: "FTP upload failed: " + error})
  }


});

/**
 * POST /api/upload/cloudinary
 * Accepts images only; responds with { message, url }.
 */
app.post('/api/upload/cloudinary', upload.single('file'), async (req, res) => {
  if(!req.file) return res.status(400).json({ error: 'No file provided' });
  if(!req.file.mimetype.startsWith("image/")) return res.status(400).json({error: "Only images are allowed"})
  
  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}` //'base64' = 64bit
  cloudinary.uploader.upload(dataUri, {resource_type: "image"},
    (error, result)=>{
      console.log("POST /api/upload/cloudinary result: ", result);
      console.log("POST /api/upload/cloudinary error: ", error);
      
      return res.status(error? 500 : 201).json({error, result})
    }
  )
  });

/**
 * Connects and logs in an FTP client using FTP_* environment variables.
 * @param {Client} client basic-ftp client to connect
 * @returns {Promise<import('basic-ftp').FTPResponse>}
 */
const ftpAccess = (client) =>
  client.access({
    host: process.env.FTP_HOST || 'localhost',
    port: Number(process.env.FTP_PORT) || 21,
    user: process.env.FTP_USER || 'anonymous',
    password: process.env.FTP_PASSWORD || '',
    secure: process.env.FTP_SECURE === 'true',
  });

/** GET /api/files/ftp - lists files in the FTP remote dir as [{ name, size }]. */
app.get('/api/files/ftp', async (_req, res) => {

  const client = new Client()
  await client.access({
    host: "192.168.56.1",
    port: 21,
    user: "tester",
    password: "password",
    secure: "true"
  })

  const list = await client.list()
  if (list) {
    await client.close()
    res.status(200).json({list})
  } else{
    res.status(500).json({error: "FTP  list failed: "})
  }

});

/** GET /api/files/ftp/:name - streams one FTP file to the response as a download. */
app.get('/api/files/ftp/:name', async (req, res) => {
 res.status(404).json({ error: 'FTP download failed: '});

});

/** GET /api/files/cloudinary - lists up to 30 images as [{ name, url }]. */
app.get('/api/files/cloudinary', async (_req, res) => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    resource_type: "image",
    max_results: 30
  })
  if (result) {
    return res.status(200).json({list: result.resources.map(r=>({
      name: r.secure_url
    }))
  })
  } else{
    return res.status(500).json({ error: 'Cloudinary list failed: '});
  }

});

// Error-handling middleware (4 args, registered last): turns multer errors
// (e.g. file too large) into 400 and anything else into 500.
app.use((err, _req, res, _next) => {
  res.status(err instanceof multer.MulterError ? 400 : 500).json({ error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on ${port}`));
