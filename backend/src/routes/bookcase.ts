import { Router } from 'express';
import {
  getBookcases,
  cycleBookcase,
  addBookcase,
  deleteBookcase,
  addShelf,
  deleteShelf
} from '../controllers/bookcaseController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/',                                       protect, getBookcases);
router.post('/',                                      protect, addBookcase);
router.delete('/:bookcaseId',                         protect, deleteBookcase);
router.get('/:bookcaseId/cycle',                      protect, cycleBookcase);
router.post('/:bookcaseId/shelves',                   protect, addShelf);
router.delete('/:bookcaseId/shelves/:shelfId',        protect, deleteShelf);

export default router;