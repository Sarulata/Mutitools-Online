import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import whois from "whois-json";

const app = express();

// ✅ Railway/Render gunakan PORT dari environment
const PORT = process.env.PORT || 4000;

// Setup __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   Domain Name Checker API
========================= */
app.get("/api/check-domain", async (req, res) => {
  const domain = req.query.domain; // 🔑 parameter ?domain=
  if (!domain) return res.status(400).json({ error: "No domain provided" });

  try {
    const data = await whois(domain);

    if (data && (data.domainName || data.domain)) {
      res.json({
        domain,
        status: "❌ Taken",
        whois: {
          registrar: data.registrar || "Unknown",
          creationDate: data.creationDate || data.createdDate || "Unknown",
          expirationDate: data.registryExpiryDate || "Unknown"
        }
      });
    } else {
      res.json({ domain, status: "✅ Available" });
    }
  } catch (err) {
    res.status(500).json({ error: "WHOIS lookup failed", details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
