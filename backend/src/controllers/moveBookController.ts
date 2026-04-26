import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// ─── MOVE BOOK BETWEEN SHELVES ────────────────────────────────────────────────
export const moveBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId, bookId } = req.params;
    const { targetBookcaseId, targetShelfId } = req.body;

    if (!targetBookcaseId || !targetShelfId) {
      res.status(400).json({ message: 'targetBookcaseId and targetShelfId are required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // Find source
    const sourceBookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!sourceBookcase) { res.status(404).json({ message: 'Source bookcase not found' }); return; }

    const sourceShelf = sourceBookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!sourceShelf) { res.status(404).json({ message: 'Source shelf not found' }); return; }

    const bookIndex = sourceShelf.books.findIndex((b) => b._id?.toString() === bookId);
    if (bookIndex === -1) { res.status(404).json({ message: 'Book not found' }); return; }

    // Find target
    const targetBookcase = user.bookcases.find((bc) => bc._id?.toString() === targetBookcaseId);
    if (!targetBookcase) { res.status(404).json({ message: 'Target bookcase not found' }); return; }

    const targetShelf = targetBookcase.shelves.find((s) => s._id?.toString() === targetShelfId);
    if (!targetShelf) { res.status(404).json({ message: 'Target shelf not found' }); return; }

    // Check for duplicate on target shelf
    const book = sourceShelf.books[bookIndex];
    const duplicate = targetShelf.books.some(
      (b) =>
        (book.googleBooksId && b.googleBooksId === book.googleBooksId) ||
        (b.title.toLowerCase() === book.title.toLowerCase() &&
          b.author.toLowerCase() === book.author.toLowerCase())
    );

    if (duplicate) {
      res.status(400).json({ message: 'This book already exists on the target shelf' });
      return;
    }

    // Move — remove from source, add to target
    const [movedBook] = sourceShelf.books.splice(bookIndex, 1);
    targetShelf.books.push(movedBook);

    await user.save();

    res.status(200).json({
      message: `Book moved to ${targetShelf.category}`,
      book: movedBook
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};