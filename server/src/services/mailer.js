import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Brevo HTTP API ──────────────────────────────────────────────────────────

async function sendViaBrevo({ to, subject, html, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SALON_EMAIL;

  if (!apiKey) throw new Error("BREVO_API_KEY is not set");
  if (!senderEmail) throw new Error("BREVO_SENDER_EMAIL is not set");

  const body = {
    sender: { name: "Luxe Salon", email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };
  if (replyTo) body.replyTo = { email: replyTo };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Brevo error ${res.status}: ${err.message || JSON.stringify(err)}`);
  }

  const data = await res.json();
  console.log(`[Brevo] Email sent to ${to}. Message ID: ${data.messageId}`);
  return data;
}

// ─── SMTP fallback (local dev only — Render blocks SMTP ports) ───────────────

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function resolveSmtpHost(hostname) {
  try {
    const addresses = await dns.promises.resolve4(hostname);
    return addresses[0] || hostname;
  } catch {
    return hostname;
  }
}

async function createTransporter() {
  if (!hasSmtpConfig()) return null;

  const smtpHost = process.env.SMTP_HOST;
  const smtpAddress = await resolveSmtpHost(smtpHost);
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === "true";

  return nodemailer.createTransport({
    host: smtpAddress,
    port: smtpPort,
    secure: smtpSecure,
    family: 4,
    lookup(hostname, _options, callback) {
      dns.lookup(hostname, { family: 4 }, callback);
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
    },
    tls: { servername: smtpHost, rejectUnauthorized: true },
  });
}

async function sendViaSmtp({ to, subject, html, replyTo }) {
  const transporter = await createTransporter();
  if (!transporter) throw new Error("SMTP not configured");

  await transporter.verify();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    replyTo,
    subject,
    html,
  });
  console.log(`[SMTP] Email sent to ${to}. Message ID: ${info.messageId}`);
  return info;
}

// ─── FormSubmit last-resort fallback ────────────────────────────────────────

async function sendViaFormSubmit({ to, subject, html, replyTo }) {
  const salonEmail = process.env.FORMSUBMIT_EMAIL || process.env.SALON_EMAIL;
  if (!salonEmail) throw new Error("No FORMSUBMIT_EMAIL / SALON_EMAIL configured");

  const isCustomerEmail = to !== salonEmail;
  const payload = {
    _subject: isCustomerEmail ? `[AUTO-REPLY COPY] ${subject} → ${to}` : subject,
    _template: "table",
    _captcha: "false",
    name: "Luxe Salon Website",
    email: replyTo || to,
    message: isCustomerEmail
      ? `NOTE: This is a copy of the auto-response that should have been sent to ${to}.\n\n${stripHtml(html)}`
      : stripHtml(html),
  };

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(salonEmail)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = `FormSubmit failed with status ${res.status}`;
    if (res.status === 403) {
      console.error(`[FormSubmit] 403 Forbidden for ${salonEmail}. ACTION REQUIRED: Go to https://formsubmit.co, enter "${salonEmail}", and click the activation link sent to that inbox.`);
    }
    throw new Error(data.message || msg);
  }

  console.log(`[FormSubmit] Email delivered for ${to} via FormSubmit fallback`);
  return { fallback: "formsubmit", ok: true };
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Main sendMail (Brevo → SMTP → FormSubmit) ───────────────────────────────

export async function sendMail({ to, subject, html, replyTo }) {
  console.log(`[MAILER] [START] Initiating sendMail request to: ${to} | Subject: "${subject}"`);

  // 1. Brevo HTTP API (works on Render — uses port 443)
  if (process.env.BREVO_API_KEY) {
    console.log(`[MAILER] [TRY] Attempting delivery via Brevo Cloud API to: ${to}...`);
    try {
      const result = await sendViaBrevo({ to, subject, html, replyTo });
      console.log(`[MAILER] [SUCCESS] Brevo delivery succeeded for: ${to}`);
      return result;
    } catch (err) {
      console.error(`[MAILER] [ERROR] Brevo delivery failed for ${to}. Error:`, err);
    }
  } else {
    console.log("[MAILER] [INFO] BREVO_API_KEY is not defined. Skipping Brevo delivery.");
  }

  // 2. SMTP (works locally; Render blocks ports 465/587)
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  if (!isProduction) {
    console.log(`[MAILER] [TRY] Attempting delivery via SMTP (local transporter) to: ${to}...`);
    try {
      const result = await sendViaSmtp({ to, subject, html, replyTo });
      console.log(`[MAILER] [SUCCESS] SMTP delivery succeeded for: ${to}`);
      return result;
    } catch (err) {
      console.error(`[MAILER] [ERROR] SMTP delivery failed for ${to}. Error:`, err);
    }
  } else {
    console.log("[MAILER] [INFO] Skipping SMTP delivery in production environment (Render blocks ports 465/587) to prevent connection timeouts.");
  }

  // 3. FormSubmit (last resort)
  console.log(`[MAILER] [TRY] Attempting delivery via FormSubmit HTTP fallback to: ${to}...`);
  try {
    const result = await sendViaFormSubmit({ to, subject, html, replyTo });
    console.log(`[MAILER] [SUCCESS] FormSubmit delivery succeeded for: ${to}`);
    return result;
  } catch (err) {
    console.error(`[MAILER] [FATAL ERROR] FormSubmit delivery failed for ${to}. Error:`, err);
    throw err;
  }
}

// ─── Email templates ─────────────────────────────────────────────────────────

function layout({ title, eyebrow, body, accent = "#d7b46a" }) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f7f0e8;font-family:Arial,sans-serif;color:#21100f;">
        <div style="max-width:680px;margin:32px auto;background:#fffaf4;border-radius:18px;overflow:hidden;border:1px solid #ead8b2;">
          <div style="background:#21100f;color:#fffaf4;padding:28px;text-align:center;">
            <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:4px;color:${accent};font-size:12px;font-weight:700;">${eyebrow}</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:34px;">${title}</h1>
          </div>
          <div style="padding:30px;">${body}</div>
          <div style="background:#f7f0e8;padding:18px;text-align:center;color:#7a6257;font-size:13px;">
            Luxe Salon
          </div>
        </div>
      </body>
    </html>
  `;
}

function appointmentRows(appointment) {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Name</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${escapeHtml(appointment.name)}</td></tr>
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Email</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${escapeHtml(appointment.email)}</td></tr>
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Phone</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${escapeHtml(appointment.phone)}</td></tr>
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Service</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${escapeHtml(appointment.service)}</td></tr>
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Date</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${formatDate(appointment.preferredDate)}</td></tr>
      <tr><td style="padding:12px;border-bottom:1px solid #ead8b2;"><strong>Time</strong></td><td style="padding:12px;border-bottom:1px solid #ead8b2;">${escapeHtml(appointment.preferredTime)}</td></tr>
      <tr><td style="padding:12px;"><strong>Notes</strong></td><td style="padding:12px;">${escapeHtml(appointment.notes || "-")}</td></tr>
    </table>
  `;
}

export function appointmentNotificationEmail(appointment) {
  return layout({
    eyebrow: "New Appointment",
    title: "Booking Request Received",
    body: `${appointmentRows(appointment)}<p style="margin-top:22px;color:#7a6257;">This appointment was submitted from the Luxe Salon website.</p>`,
  });
}

export function appointmentConfirmationEmail(appointment) {
  return layout({
    eyebrow: "Appointment Request",
    title: `Thank you, ${escapeHtml(appointment.name)}`,
    body: `
      <p style="font-size:16px;line-height:1.7;">Your appointment request has been received. Our team will review your booking and confirm it shortly.</p>
      ${appointmentRows(appointment)}
    `,
  });
}

export function appointmentApprovedEmail(appointment) {
  return layout({
    eyebrow: "Confirmed",
    title: "Appointment Confirmed",
    body: `<p style="font-size:16px;line-height:1.7;">Hello ${escapeHtml(appointment.name)}, your appointment is confirmed. Please arrive 10 minutes early.</p>${appointmentRows(appointment)}`,
  });
}

export function appointmentRejectedEmail(appointment, reason = "The selected slot is unavailable.") {
  return layout({
    eyebrow: "Update",
    title: "Appointment Could Not Be Confirmed",
    accent: "#e4b7a7",
    body: `<p style="font-size:16px;line-height:1.7;">Hello ${escapeHtml(appointment.name)}, we could not confirm your appointment.</p><p><strong>Reason:</strong> ${escapeHtml(reason)}</p>`,
  });
}

export function appointmentRescheduledEmail(appointment, newDate, newTime) {
  return layout({
    eyebrow: "Rescheduled",
    title: "Appointment Rescheduled",
    body: `
      <p style="font-size:16px;line-height:1.7;">Hello ${escapeHtml(appointment.name)}, your appointment has been rescheduled.</p>
      <p><strong>New Date:</strong> ${formatDate(newDate)}</p>
      <p><strong>New Time:</strong> ${escapeHtml(newTime)}</p>
    `,
  });
}

export function contactNotificationEmail(message) {
  return layout({
    eyebrow: "New Contact Message",
    title: escapeHtml(message.subject),
    body: `
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Message:</strong></p>
      <p style="line-height:1.7;">${escapeHtml(message.message)}</p>
    `,
  });
}

export function contactAutoReplyEmail(message) {
  return layout({
    eyebrow: "Message Received",
    title: `Hi ${escapeHtml(message.name)}`,
    body: `
      <p style="font-size:16px;line-height:1.7;">Thank you for contacting Luxe Salon. We have received your message and our team will get back to you within 24 hours.</p>
      <p style="margin-top:24px;">Regards,<br><strong>Luxe Salon</strong></p>
    `,
  });
}
