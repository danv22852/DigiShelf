import { Router } from 'express';
import {
  searchBooks,
  addBook,
  editBook,
  deleteBook
} from '../controllers/shelfController';
import { protect } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true }); // mergeParams lets us access bookcaseId

router.get('/books/search', protect, searchBooks);
router.post('/:shelfId/books',       protect, addBook);
router.patch('/:shelfId/books/:bookId', protect, editBook);
router.delete('/:shelfId/books/:bookId', protect, deleteBook);

export default router;