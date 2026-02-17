import express from 'express';
import { downloadVideo } from '../controllers/tiktokController.js';

const router = express.Router();

router.post('/download', downloadVideo);

export default router;
