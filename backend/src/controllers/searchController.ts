import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// ─── SEARCH ENTIRE BOOKCASE ───────────────────────────────────────────────────
export const searchBookcase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId } = req.params;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const query = q.toLowerCase();
    const results: {
      shelfId: string;
      shelfCategory: string;
      book: any;
    }[] = [];

    bookcase.shelves.forEach((shelf) => {
      shelf.books.forEach((book) => {
        const matches =
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre?.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query);

        if (matches) {
          results.push({
            shelfId:       shelf._id?.toString() as string,
            shelfCategory: shelf.category,
            book
          });
        }
      });
    });

    res.status(200).json({
      query: q,
      total: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── SEARCH SPECIFIC SHELF ────────────────────────────────────────────────────
export const searchShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    const query = q.toLowerCase();

    const results = shelf.books.filter((book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre?.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query) ||
      book.description?.toLowerCase().includes(query)
    );

    res.status(200).json({
      query: q,
      shelf: shelf.category,
      total: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};