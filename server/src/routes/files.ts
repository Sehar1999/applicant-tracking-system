import { Router } from 'express';
import { uploadFile, getUserFiles, deleteFile, fetchFile, upload, compareFiles, updateProfilePicture } from '../controllers/fileController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.post('/compare', authenticateToken, upload.array('files'), compareFiles);
router.put('/profile-picture', authenticateToken, upload.single('file'), updateProfilePicture);
router.get('/my-files', authenticateToken, getUserFiles);
router.delete('/:fileId', authenticateToken, deleteFile);
router.get('/fetch/:fileId', authenticateToken, fetchFile);

export default router; 