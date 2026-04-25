import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { searchGoogleBooks } from '../services/googleBooks';

// ─── SEARCH BOOKS ─────────────────────────────────────────────────────────────
// Searches Google Books API and returns results for the user to pick from
export const searchBooks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const results = await searchGoogleBooks(q);

    if (results.length === 0) {
      res.status(200).json({
        message: 'No results found. You can add the book manually.',
        results: []
      });
      return;
    }

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── ADD BOOK ─────────────────────────────────────────────────────────────────
// Adds a book to a shelf — either from Google Books or a manual entry
export const addBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;
    const {
      // Google Books fields (populated from search result)
      googleBooksId,
      title,
      author,
      cover,
      description,
      isbn,
      pageCount,
      publishedDate,
      genre,
      // User fields (added by user regardless of source)
      userRating,
      userReview,
      // Flag to indicate manual entry
      isManualEntry
    } = req.body;

    if (!title || !author) {
      res.status(400).json({ message: 'Title and author are required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    // Prevent duplicate books on the same shelf
    const duplicate = shelf.books.some(
      (b) =>
        (googleBooksId && b.googleBooksId === googleBooksId) ||
        (b.title.toLowerCase() === title.toLowerCase() &&
          b.author.toLowerCase() === author.toLowerCase())
    );
    if (duplicate) {
      res.status(400).json({ message: 'This book is already on this shelf' });
      return;
    }

    shelf.books.push({
      googleBooksId: googleBooksId || null,
      title,
      author,
      cover:         cover || null,
      description:   description || null,
      isbn:          isbn || null,
      pageCount:     pageCount || null,
      publishedDate: publishedDate || null,
      genre:         genre || null,
      userRating:    userRating || null,
      userReview:    userReview || null,
      addedAt:       new Date(),
      isManualEntry: isManualEntry || false
    });

    await user.save();

    res.status(201).json({ message: 'Book added', books: shelf.books });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── EDIT BOOK ────────────────────────────────────────────────────────────────
// Edits a book — user can update their rating/review or correct any book info
export const editBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId, bookId } = req.params;
    const {
      title,
      author,
      cover,
      description,
      isbn,
      pageCount,
      publishedDate,
      genre,
      userRating,
      userReview
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    const book = shelf.books.find((b) => b._id?.toString() === bookId);
    if (!book) { res.status(404).json({ message: 'Book not found' }); return; }

    // Only update fields that were actually sent in the request
    if (title)         book.title = title;
    if (author)        book.author = author;
    if (cover)         book.cover = cover;
    if (description)   book.description = description;
    if (isbn)          book.isbn = isbn;
    if (pageCount)     book.pageCount = pageCount;
    if (publishedDate) book.publishedDate = publishedDate;
    if (genre)         book.genre = genre;
    if (userRating)    book.userRating = userRating;
    if (userReview)    book.userReview = userReview;

    await user.save();

    res.status(200).json({ message: 'Book updated', book });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── DELETE BOOK ──────────────────────────────────────────────────────────────
export const deleteBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId, bookId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    const bookIndex = shelf.books.findIndex((b) => b._id?.toString() === bookId);
    if (bookIndex === -1) { res.status(404).json({ message: 'Book not found' }); return; }

    shelf.books.splice(bookIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Book deleted', books: shelf.books });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};