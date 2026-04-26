import { Router } from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  toggleBookcasePrivacy,
  shareShelf,
  unshareShelf,
  viewSharedShelf
} from '../controllers/socialController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Follow
router.post('/follow/:userId',    protect, followUser);
router.delete('/follow/:userId',  protect, unfollowUser);
router.get('/followers',          protect, getFollowers);
router.get('/following',          protect, getFollowing);

// Bookcase privacy
router.patch('/bookcase/:bookcaseId/privacy', protect, toggleBookcasePrivacy);

// Shelf sharing
router.post('/bookcase/:bookcaseId/shelves/:shelfId/share',   protect, shareShelf);
router.delete('/bookcase/:bookcaseId/shelves/:shelfId/share', protect, unshareShelf);

// Public shared shelf view — no auth
router.get('/shelf/shared/:shareToken', viewSharedShelf);

export default router;