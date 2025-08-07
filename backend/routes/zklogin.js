// backend/routes/zklogin.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

/**
 * POST /zklogin/salt
 * Receives a JWT, validates it, and returns a user salt based on iss, aud, sub
 */
router.post("/salt", async (req, res) => {
  const { jwtToken } = req.body;
  if (!jwtToken) {
    return res.status(400).json({ error: "Missing jwtToken" });
  }
  try {
    // Decode JWT (do not verify signature here, just extract claims)
    const decoded = jwt.decode(jwtToken);
    if (!decoded || !decoded.iss || !decoded.aud || !decoded.sub) {
      return res.status(400).json({ error: "Invalid JWT claims" });
    }
    // Derive user salt (for demo: hash of iss+aud+sub)
    const saltSource = `${decoded.iss}|${decoded.aud}|${decoded.sub}`;
    const salt = require("crypto")
      .createHash("sha256")
      .update(saltSource)
      .digest("hex");
    return res.json({ user_salt: salt });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to process JWT", details: err.message });
  }
});

/**
 * POST /zklogin/proof
 * Receives JWT, user_salt, eph_pk, jwt_randomness, sub and returns a stub ZK proof
 * In production, this should call a real ZK proving service
 */
router.post("/proof", async (req, res) => {
  const { jwtToken, user_salt, eph_pk, jwt_randomness, sub } = req.body;
  if (!jwtToken || !user_salt || !eph_pk || !jwt_randomness || !sub) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Here you would call your ZK proving service and return the proof
  // For now, return a stub
  return res.json({
    zk_proof: {
      proof: "ZK_PROOF_PLACEHOLDER",
      public_inputs: {
        user_salt,
        eph_pk,
        jwt_randomness,
        sub,
      },
    },
    message:
      "This is a stub. Integrate with a real ZK proving service for production.",
  });
});

module.exports = router;
