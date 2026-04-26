import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// ─── GET ALL BOOKCASES ────────────────────────────────────────────────────────
export const getBookcases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    res.status(200).json({
      total: user.bookcases.length,
      bookcases: user.bookcases.map((bc, i) => ({
        _id: bc._id,
        name: bc.name,
        index: i,
        shelfCount: bc.shelves.length,
        shelves: bc.shelves
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── CYCLE BOOKCASES ──────────────────────────────────────────────────────────
export const cycleBookcase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId } = req.params;
    const { direction } = req.query;

    if (direction !== 'left' && direction !== 'right') {
      res.status(400).json({ message: "Direction must be 'left' or 'right'" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const currentIndex = user.bookcases.findIndex(
      (bc) => bc._id?.toString() === bookcaseId
    );

    if (currentIndex === -1) {
      res.status(404).json({ message: 'Bookcase not found' });
      return;
    }

    const total = user.bookcases.length;
    const nextIndex =
      direction === 'right'
        ? (currentIndex + 1) % total
        : (currentIndex - 1 + total) % total;

    const nextBookcase = user.bookcases[nextIndex];

    res.status(200).json({
      currentIndex: nextIndex,
      total,
      bookcase: {
        _id: nextBookcase._id,
        name: nextBookcase.name,
        shelfCount: nextBookcase.shelves.length,
        shelves: nextBookcase.shelves
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── ADD BOOKCASE ─────────────────────────────────────────────────────────────
export const addBookcase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ message: 'Bookcase name is required' }); return; }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const exists = user.bookcases.some(
      (bc) => bc.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) { res.status(400).json({ message: 'A bookcase with that name already exists' }); return; }

    user.bookcases.push({ name, shelves: [] });
    await user.save();

    res.status(201).json({ message: 'Bookcase added', bookcases: user.bookcases });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── DELETE BOOKCASE ──────────────────────────────────────────────────────────
export const deleteBookcase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const index = user.bookcases.findIndex((bc) => bc._id?.toString() === bookcaseId);
    if (index === -1) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    user.bookcases.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Bookcase deleted', bookcases: user.bookcases });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── ADD SHELF TO BOOKCASE ────────────────────────────────────────────────────
export const addShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId } = req.params;
    const { category, color } = req.body;

    if (!category) { res.status(400).json({ message: 'Category is required' }); return; }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const exists = bookcase.shelves.some(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    if (exists) { res.status(400).json({ message: 'A shelf with that name already exists' }); return; }

    bookcase.shelves.push({ category, color: color || '#4A90D9', books: [] });
    await user.save();

    res.status(201).json({ message: 'Shelf added', shelves: bookcase.shelves });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── DELETE SHELF FROM BOOKCASE ───────────────────────────────────────────────
export const deleteShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelfIndex = bookcase.shelves.findIndex((s) => s._id?.toString() === shelfId);
    if (shelfIndex === -1) { res.status(404).json({ message: 'Shelf not found' }); return; }

    bookcase.shelves.splice(shelfIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Shelf deleted', shelves: bookcase.shelves });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};