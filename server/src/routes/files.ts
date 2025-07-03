import { Router } from 'express';
import { uploadFile, getUserFiles, deleteFile, fetchFile, upload } from '../controllers/fileController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/my-files', authenticateToken, getUserFiles);
router.delete('/:fileId', authenticateToken, deleteFile);
router.get('/fetch/:fileId', authenticateToken, fetchFile);

export default router; 