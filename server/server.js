import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ✅ Render dynamic port support
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Queue ID
const QUEUE_ID = "57e41402-7bb7-4c47-9b7d-9a6f9436d98a";

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Main API route
app.get("/api/check", async (req, res) => {
  const { phone, state, zip } = req.query;

  // ✅ Validation
  if (!phone || !state || !zip) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: phone, state, zip"
    });
  }

  try {
    const url = `https://api.enrollhere.com/dialer/availability/byQueue/${QUEUE_ID}?phone=${encodeURIComponent(
      phone
    )}&state=${encodeURIComponent(state)}&zip=${encodeURIComponent(zip)}`;

    const response = await fetch(url);

    // Handle non-OK responses
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `External API error: ${response.status}`
      });
    }

    const data = await response.json();

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});