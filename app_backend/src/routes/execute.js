import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getSequelize } from "../config/database.js";

const router = Router();

/**
 * @openapi
 * /api/execute:
 *   post:
 *     tags: [Execute]
 *     security: [{ bearerAuth: [] }]
 *     summary: Execute an action with plan-gated behavior
 *     description: >
 *       Demonstrates conditional behavior based on the authenticated user's plan.
 *       Returns a different message and payload fields for normal, premium, and ultra plans.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Execution result varies by plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 plan: { type: string, enum: [normal, premium, ultra] }
 *                 message: { type: string }
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const sequelize = getSequelize();
    const User = sequelize.models.User;
    const user = await User.findByPk(req.auth.uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = user.plan;
    let payload = { success: true, plan, message: "" };

    // Conditional behavior by plan
    if (plan === "normal") {
      payload.message = "Basic execution complete. Upgrade for more features.";
      payload.limit = "low";
    } else if (plan === "premium") {
      payload.message = "Premium execution complete with enhanced processing.";
      payload.limit = "medium";
      payload.speed = "fast";
    } else if (plan === "ultra") {
      payload.message = "Ultra execution complete with all features unlocked.";
      payload.limit = "maximum";
      payload.speed = "fastest";
      payload.priority = true;
    } else {
      payload.message = "Unknown plan";
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
