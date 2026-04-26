import { Router } from 'express';
import { moveBook } from '../controllers/moveBookController';
import { protect } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.patch('/:bookId/move', protect, moveBook);

export default router;