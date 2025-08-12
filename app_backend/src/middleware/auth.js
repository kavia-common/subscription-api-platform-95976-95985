import jwt from "jsonwebtoken";

/**
 * Express middleware to verify JWT Bearer tokens.
 * Attaches `req.auth` with decoded token if valid.
 */
// PUBLIC_INTERFACE
export function requireAuth(req, res, next) {
  /** Require a valid Bearer token; respond 401 otherwise. */
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn("[auth] JWT_SECRET is not set; refusing to authenticate");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.auth = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
