import express from 'express';
import { downloadVideo, proxyDownload } from '../controllers/tiktokController.js';

const router = express.Router();

router.post('/download', downloadVideo);
router.post('/tiktok-download', downloadVideo);
router.get('/proxy-download', proxyDownload);

export default router;
