import { Router } from 'express';
import { getProfile, getPublicProfile, updateProfile, deleteAccount } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/',           protect, getProfile);
router.patch('/',         protect, updateProfile);
router.get('/:userId',    getPublicProfile);   // public — no auth needed
router.delete('/',        protect, deleteAccount);

export default router;