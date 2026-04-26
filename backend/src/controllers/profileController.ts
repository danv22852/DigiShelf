import bcrypt from 'bcrypt';
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

// ─── GET OWN PROFILE ──────────────────────────────────────────────────────────
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('-password -verifyToken -verifyTokenExpiry -resetToken -resetTokenExpiry');

    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── GET PUBLIC PROFILE ───────────────────────────────────────────────────────
// Anyone can view a public profile by userId
export const getPublicProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('displayName bio profilePicture followers following bookcases createdAt');

    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // Only return public bookcases
    const publicBookcases = user.bookcases.filter((bc) => bc.isPublic);

    res.status(200).json({
      displayName:    user.displayName,
      bio:            user.bio,
      profilePicture: user.profilePicture,
      followerCount:  user.followers.length,
      followingCount: user.following.length,
      bookcases:      publicBookcases,
      memberSince:    user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName, bio, profilePicture } = req.body;

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined)         user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      profile: {
        displayName:    user.displayName,
        bio:            user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// ─── DELETE ACCOUNT ───────────────────────────────────────────────────────────
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: 'Please provide your password to confirm deletion' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // Verify password before deleting
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    // Remove this user from everyone else's followers/following lists
    await User.updateMany(
      { $or: [{ followers: user._id }, { following: user._id }] },
      { $pull: { followers: user._id, following: user._id } }
    );

    await User.findByIdAndDelete(req.userId);

    res.status(200).json({ message: 'Account successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};