import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// ─── CHANGE SHELF COLOR ───────────────────────────────────────────────────────
export const changeShelfColor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;
    const { color } = req.body;

    if (!color) {
      res.status(400).json({ message: 'Color is required' });
      return;
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      res.status(400).json({ message: 'Color must be a valid hex code e.g. #4A90D9' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    shelf.color = color;
    await user.save();

    res.status(200).json({ message: 'Shelf color updated', shelf });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── CHANGE BOOK COLOR ────────────────────────────────────────────────────────
export const changeBookColor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId, bookId } = req.params;
    const { color } = req.body;

    if (!color) {
      res.status(400).json({ message: 'Color is required' });
      return;
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      res.status(400).json({ message: 'Color must be a valid hex code e.g. #4A90D9' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    const book = shelf.books.find((b) => b._id?.toString() === bookId);
    if (!book) { res.status(404).json({ message: 'Book not found' }); return; }

    book.color = color;
    await user.save();

    res.status(200).json({ message: 'Book color updated', book });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};