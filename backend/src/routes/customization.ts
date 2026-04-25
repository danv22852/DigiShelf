import { Router } from 'express';
import { changeShelfColor, changeBookColor } from '../controllers/customizationController';
import { protect } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.patch('/:shelfId/color',               protect, changeShelfColor);
router.patch('/:shelfId/books/:bookId/color', protect, changeBookColor);

export default router;