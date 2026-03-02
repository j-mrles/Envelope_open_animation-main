require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Where to save RSVPs (separate from app)
const DATA_DIR = path.join(__dirname, "data");
const RSVP_FILE = path.join(DATA_DIR, "rsvps.json");

app.use(cors());
app.use(express.json());

// Serve the RSVP form and assets from the project root
app.use(express.static(path.join(__dirname, "..")));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadRsvps() {
  try {
    const raw = fs.readFileSync(RSVP_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === "ENOENT") return { rsvps: [] };
    throw e;
  }
}

function saveRsvp(entry) {
  const data = loadRsvps();
  data.rsvps.push(entry);
  fs.writeFileSync(RSVP_FILE, JSON.stringify(data, null, 2), "utf8");
}

function buildEmailHtml(body) {
  return `
    <h2>New RSVP</h2>
    <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
    <p><strong>Attending:</strong> ${body.attending === "yes" ? "Yes" : "No"}</p>
    <p><strong>Bringing guest:</strong> ${body.bringing_guest === "yes" ? "Yes" : "No"}</p>
    ${body.guest_name ? `<p><strong>Guest name:</strong> ${escapeHtml(body.guest_name)}</p>` : ""}
    ${body.dietary ? `<p><strong>Dietary / notes:</strong><br>${escapeHtml(body.dietary)}</p>` : ""}
    <p><em>Received at ${new Date().toISOString()}</em></p>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.post("/api/rsvp", async (req, res) => {
  const body = req.body || {};
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();

  if (!name || !email) {
    return res.status(400).json({ ok: false, error: "Name and email are required." });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    email,
    attending: body.attending === "yes" ? "yes" : "no",
    bringing_guest: body.bringing_guest === "yes" ? "yes" : "no",
    guest_name: body.bringing_guest === "yes" ? (body.guest_name || "").trim() : "",
    dietary: (body.dietary || "").trim(),
    received_at: new Date().toISOString(),
  };

  // Save to file
  try {
    saveRsvp(entry);
  } catch (err) {
    console.error("Failed to save RSVP:", err);
    return res.status(500).json({ ok: false, error: "Failed to save response." });
  }

  // Send email if SMTP is configured
  const toEmail = process.env.TO_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (toEmail && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"RSVP" <${smtpUser}>`,
        to: toEmail,
        subject: `RSVP: ${entry.attending === "yes" ? "Yes" : "No"} – ${name}`,
        html: buildEmailHtml(entry),
        text: `Name: ${name}\nEmail: ${email}\nAttending: ${entry.attending}\nBringing guest: ${entry.bringing_guest}${entry.guest_name ? "\nGuest: " + entry.guest_name : ""}${entry.dietary ? "\nNotes: " + entry.dietary : ""}\nReceived: ${entry.received_at}`,
      });
    } catch (err) {
      console.error("Failed to send email:", err);
      // Still return success – we saved the RSVP
    }
  } else {
    console.warn("Email not sent: set TO_EMAIL, SMTP_USER, SMTP_PASS in .env");
  }

  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`RSVP API running at http://localhost:${PORT}`);
  console.log(`Form: http://localhost:${PORT}/`);
  console.log(`RSVPs saved to: ${RSVP_FILE}`);
});
