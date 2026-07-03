import nodemailer from "nodemailer";

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

function createTransporter() {
  if (!hasSmtpConfig()) {
    throw new Error("SMTP configuration is missing. Check your .env file.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMail({ subject, html, replyTo }) {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo,
      subject,
      html,
    });

    console.log("====================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("====================================");

    return info;
  } catch (error) {
    console.error("====================================");
    console.error("❌ EMAIL SENDING FAILED");
    console.error(error);
    console.error("====================================");
    throw error;
  }
}

export function appointmentEmail(appointment) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Arial,sans-serif">

    <h2>💇 New Luxe Salon Appointment</h2>

    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
      <tr>
        <td><strong>Name</strong></td>
        <td>${appointment.name}</td>
      </tr>

      <tr>
        <td><strong>Email</strong></td>
        <td>${appointment.email}</td>
      </tr>

      <tr>
        <td><strong>Phone</strong></td>
        <td>${appointment.phone}</td>
      </tr>

      <tr>
        <td><strong>Service</strong></td>
        <td>${appointment.service}</td>
      </tr>

      <tr>
        <td><strong>Date</strong></td>
        <td>${new Date(appointment.preferredDate).toLocaleDateString()}</td>
      </tr>

      <tr>
        <td><strong>Time</strong></td>
        <td>${appointment.preferredTime}</td>
      </tr>

      <tr>
        <td><strong>Notes</strong></td>
        <td>${appointment.notes || "No Notes"}</td>
      </tr>

    </table>

    <br>

    <p>This appointment was submitted from the Luxe Salon website.</p>

  </body>
  </html>
  `;
}

export function contactEmail(message) {
  return `
  <!DOCTYPE html>
  <html>
  <body>

    <h2>📩 New Contact Message</h2>

    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;width:100%;">
      <tr>
        <td><strong>Name</strong></td>
        <td>${message.name}</td>
      </tr>

      <tr>
        <td><strong>Email</strong></td>
        <td>${message.email}</td>
      </tr>

      <tr>
        <td><strong>Subject</strong></td>
        <td>${message.subject}</td>
      </tr>

      <tr>
        <td><strong>Message</strong></td>
        <td>${message.message}</td>
      </tr>
    </table>

  </body>
  </html>
  `;
}