const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

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

export async function sendMail({ to, subject, html, replyTo }) {
  if (process.env.GOOGLE_SCRIPT_URL) {
    try {
      return await sendViaGoogleScript({ to, subject, html, replyTo });
    } catch (error) {
      console.error(`[MAILER] Google Apps Script email failed for ${to}. Falling back if Brevo is configured.`, error);
    }
  }

  return sendViaBrevo({ to, subject, html, replyTo });
}

async function sendViaGoogleScript({ to, subject, html, replyTo }) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const scriptSecret = process.env.GOOGLE_SCRIPT_SECRET;
  const senderName = process.env.GOOGLE_SCRIPT_SENDER_NAME || process.env.BREVO_SENDER_NAME || "Luxe Salon";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  console.log(`[MAILER] Sending Gmail email via Google Apps Script to ${to} | Subject: "${subject}"`);

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        secret: scriptSecret,
        senderName,
        to,
        subject,
        html,
        replyTo,
      }),
      signal: controller.signal,
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text || "{}");
    } catch {
      throw new Error("Google Apps Script returned a non-JSON response. Check deployment access is set to Anyone.");
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.error || `Google Apps Script failed with status ${response.status}`);
    }

    console.log(`[MAILER] Gmail email sent via Google Apps Script to ${to}.`);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendViaBrevo({ to, subject, html, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Luxe Salon";

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured in environment variables.");
  }

  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL is not configured in environment variables.");
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  console.log(`[MAILER] Sending Brevo email to ${to} | Subject: "${subject}"`);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        `Brevo failed with status ${response.status}: ${data.message || JSON.stringify(data)}`
      );
    }

    console.log(`[MAILER] Brevo email sent to ${to}. Message ID: ${data.messageId || "unknown"}`);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

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
