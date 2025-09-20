import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'})); // to support JSON-encoded bodies

// ✅ Choose a valid model (gemini-2.5-flash is fast & good for most use cases)
const GEMINI_MODEL = "gemini-2.5-flash";

app.post("/api/ask", async (req, res) => {
  try {
    const { question, image } = req.body;

    const parts = [];
    if (question) parts.push({ text: question });
    if (image) {
      parts.push({
        inline_data: {
          mime_type: "image/png", // or detect type dynamically
          data: image.split(",")[1], // remove "data:image/png;base64,"
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
        }),
      }
    );

    const data = await response.json();
    console.log("🔍 Gemini Response:", JSON.stringify(data, null, 2));

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "No response from Gemini";

    res.json({ answer });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));