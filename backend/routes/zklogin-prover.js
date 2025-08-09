const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

/**
 * POST /zklogin/proof
 * Proxies a ZK proof request to the Mysten zkLogin Prover Dev endpoint.
 * Expects body: { jwt, extendedEphemeralPublicKey, jwtRandomness, salt, keyClaimName }
 */
router.post("/zklogin/proof", async (req, res) => {
  try {
    const {
      jwt,
      extendedEphemeralPublicKey,
      jwtRandomness,
      salt,
      keyClaimName,
    } = req.body;
    const response = await fetch("https://prover-dev.mystenlabs.com/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jwt,
        extendedEphemeralPublicKey,
        jwtRandomness,
        salt,
        keyClaimName,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
