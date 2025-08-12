import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth } from "../middleware/auth.js";
import { getSequelize } from "../config/database.js";

const router = Router();

/**
 * @openapi
 * /api/plan:
 *   get:
 *     tags: [Plan]
 *     security: [{ bearerAuth: [] }]
 *     summary: Get user plan
 *     description: Returns the current subscription plan for the authenticated user.
 *     responses:
 *       200:
 *         description: Plan object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan:
 *                   type: string
 *                   enum: [normal, premium, ultra]
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const sequelize = getSequelize();
    const User = sequelize.models.User;
    const user = await User.findByPk(req.auth.uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ plan: user.plan });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/plan:
 *   put:
 *     tags: [Plan]
 *     security: [{ bearerAuth: [] }]
 *     summary: Update user plan
 *     description: Change the authenticated user's subscription plan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plan]
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [normal, premium, ultra]
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  requireAuth,
  [body("plan").isIn(["normal", "premium", "ultra"]).withMessage("Invalid plan")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", details: errors.array() });
      }
      const { plan } = req.body;

      const sequelize = getSequelize();
      const User = sequelize.models.User;
      const user = await User.findByPk(req.auth.uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.plan = plan;
      await user.save();

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
  }
);

export default router;
