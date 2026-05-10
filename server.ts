import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure SendGrid lazily
  const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "notifications@hirehorizon.com";

    if (!apiKey) {
      console.warn("SENDGRID_API_KEY not set. Email not sent.");
      return;
    }

    sgMail.setApiKey(apiKey);
    const msg = {
      to,
      from: fromEmail,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  app.use(express.json());

  // API Routes
  app.post("/api/notify", async (req, res) => {
    const { type, recipientEmail, details } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    let subject = "";
    let body = "";

    switch (type) {
      case "NEW_APPLICATION":
        subject = `New Application for ${details.jobTitle}`;
        body = `
          <h2>New Job Application Received</h2>
          <p>Hello ${details.employerName},</p>
          <p>A new candidate has applied for the position of <strong>${details.jobTitle}</strong>.</p>
          <p>Log in to your dashboard to review their profile.</p>
          <p>Best regards,<br/>HireHorizon Team</p>
        `;
        break;
      case "APPLICATION_SHORTLISTED":
        subject = `You've been shortlisted for ${details.jobTitle}!`;
        body = `
          <h2>Great News!</h2>
          <p>Hello ${details.candidateName},</p>
          <p>We are pleased to inform you that you have been shortlisted for the <strong>${details.jobTitle}</strong> position at <strong>${details.companyName}</strong>.</p>
          <p>The employer will reach out to you shortly for the next steps.</p>
          <p>Best regards,<br/>HireHorizon Team</p>
        `;
        break;
      case "STATUS_UPDATE":
        subject = `Status Update: ${details.jobTitle}`;
        body = `
          <h2>Application Status Updated</h2>
          <p>Hello ${details.candidateName},</p>
          <p>There has been an update to your application status for <strong>${details.jobTitle}</strong>.</p>
          <p>Current Status: <strong>${details.newStatus}</strong></p>
          <p>Log in to your profile to see more details.</p>
          <p>Best regards,<br/>HireHorizon Team</p>
        `;
        break;
      default:
        return res.status(400).json({ error: "Invalid notification type" });
    }

    await sendEmail(recipientEmail, subject, body, body);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
