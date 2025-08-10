import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import { 
  createJobDescription, 
  getJobDescriptions, 
  getJobDescriptionById, 
  updateJobDescription, 
  deleteJobDescription 
} from '../controllers/jobController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// CRUD routes for job descriptions
router.post('/', createJobDescription);
router.get('/', getJobDescriptions);
router.get('/:id', getJobDescriptionById);
router.put('/:id', updateJobDescription);
router.delete('/:id', deleteJobDescription);

export default router;
