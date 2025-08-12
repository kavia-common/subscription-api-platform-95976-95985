import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getSequelize } from "../config/database.js";

const router = Router();

/**
 * @openapi
 * /api/user/me:
 *   get:
 *     tags: [User]
 *     security: [{ bearerAuth: [] }]
 *     summary: Get current user
 *     description: Returns the authenticated user's profile.
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const sequelize = getSequelize();
    const User = sequelize.models.User;
    const user = await User.findByPk(req.auth.uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
