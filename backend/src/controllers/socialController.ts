import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import crypto from 'crypto';

// ─── FOLLOW USER ──────────────────────────────────────────────────────────────
export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (userId === req.userId) {
      res.status(400).json({ message: 'You cannot follow yourself' });
      return;
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.userId),
      User.findById(userId)
    ]);

    if (!currentUser || !targetUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === userId
    );

    if (alreadyFollowing) {
      res.status(400).json({ message: 'You are already following this user' });
      return;
    }

    currentUser.following.push(targetUser._id as mongoose.Types.ObjectId);
    targetUser.followers.push(currentUser._id as mongoose.Types.ObjectId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      message: `You are now following ${targetUser.displayName || targetUser.email}`,
      followingCount: currentUser.following.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── UNFOLLOW USER ────────────────────────────────────────────────────────────
export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.userId),
      User.findById(userId)
    ]);

    if (!currentUser || !targetUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.userId
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      message: `You have unfollowed ${targetUser.displayName || targetUser.email}`,
      followingCount: currentUser.following.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── GET FOLLOWERS ────────────────────────────────────────────────────────────
export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .populate('followers', 'displayName profilePicture email');

    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    res.status(200).json({
      total: user.followers.length,
      followers: user.followers
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── GET FOLLOWING ────────────────────────────────────────────────────────────
export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .populate('following', 'displayName profilePicture email');

    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    res.status(200).json({
      total: user.following.length,
      following: user.following
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── TOGGLE BOOKCASE PRIVACY ──────────────────────────────────────────────────
export const toggleBookcasePrivacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    bookcase.isPublic = !bookcase.isPublic;
    await user.save();

    res.status(200).json({
      message: `Bookcase is now ${bookcase.isPublic ? 'public' : 'private'}`,
      isPublic: bookcase.isPublic
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── SHARE SHELF ──────────────────────────────────────────────────────────────
// Generates a unique share link for a shelf
export const shareShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    // Generate token if one doesn't exist yet
    if (!shelf.shareToken) {
      shelf.shareToken = crypto.randomBytes(32).toString('hex');
    }

    shelf.isShared = true;
    await user.save();

    const shareLink = `${process.env.CLIENT_URL}/shelf/shared/${shelf.shareToken}`;

    res.status(200).json({
      message: 'Shelf is now shared',
      shareLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── UNSHARE SHELF ────────────────────────────────────────────────────────────
export const unshareShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookcaseId, shelfId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const bookcase = user.bookcases.find((bc) => bc._id?.toString() === bookcaseId);
    if (!bookcase) { res.status(404).json({ message: 'Bookcase not found' }); return; }

    const shelf = bookcase.shelves.find((s) => s._id?.toString() === shelfId);
    if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }

    // Revoke token so old links stop working
    shelf.shareToken = undefined;
    shelf.isShared = false;
    await user.save();

    res.status(200).json({ message: 'Shelf is no longer shared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── VIEW SHARED SHELF ────────────────────────────────────────────────────────
// Public route — no auth required, accessible via share link
export const viewSharedShelf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shareToken } = req.params;

    // Search all users for the matching share token
    const user = await User.findOne({
      'bookcases.shelves.shareToken': shareToken
    }).select('displayName profilePicture bookcases');

    if (!user) {
      res.status(404).json({ message: 'Shared shelf not found or link has been revoked' });
      return;
    }

    let foundShelf = null;
    for (const bookcase of user.bookcases) {
      const shelf = bookcase.shelves.find((s) => s.shareToken === shareToken);
      if (shelf) { foundShelf = shelf; break; }
    }

    if (!foundShelf || !foundShelf.isShared) {
      res.status(404).json({ message: 'Shared shelf not found or link has been revoked' });
      return;
    }

    res.status(200).json({
      sharedBy: {
        displayName:    user.displayName,
        profilePicture: user.profilePicture
      },
      shelf: {
        category: foundShelf.category,
        color:    foundShelf.color,
        books:    foundShelf.books
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};