import { Router } from 'express';
import { searchBookcase, searchShelf } from '../controllers/searchController';
import { protect } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.get('/search',              protect, searchBookcase);
router.get('/:shelfId/search',    protect, searchShelf);

export default router;