// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp Notification Service — Meta WhatsApp Business Cloud API
//
// Required env vars:
//   WHATSAPP_PHONE_NUMBER_ID   — From Meta Developer Console
//   WHATSAPP_ACCESS_TOKEN      — System user token (permanent) or page access token
//   SALON_WHATSAPP             — Salon owner WhatsApp number (e.g. +919876543210)
//
// Optional:
//   WHATSAPP_TEMPLATE_NAME     — Approved template name (default: sends a text message in sandbox)
// ─────────────────────────────────────────────────────────────────────────────

const META_API_VERSION = "v19.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

/**
 * Normalize a phone number to E.164 format.
 * Auto-prepends +91 (India) if no country code is present.
 */
function normalizePhone(phone = "") {
  // Remove all whitespace, dashes, parentheses
  let cleaned = phone.replace(/[\s\-().]/g, "");

  // Already in E.164 format
  if (cleaned.startsWith("+")) return cleaned;

  // Starts with 91 and is 12 digits → already has country code
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;

  // Starts with 0 → strip leading zero, prepend +91
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);

  // Default: prepend +91 (India)
  return `+91${cleaned}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Build a plain-text WhatsApp message for the customer.
 */
export function formatCustomerMessage(appointment) {
  return (
    `✨ Hello ${appointment.name}! Your appointment at *Luxe Salon* has been received.\n\n` +
    `📋 *Booking Details:*\n` +
    `• 💇 Service: ${appointment.service}\n` +
    `• 📅 Date: ${formatDate(appointment.preferredDate)}\n` +
    `• ⏰ Time: ${appointment.preferredTime}\n` +
    (appointment.notes ? `• 📝 Notes: ${appointment.notes}\n` : "") +
    `\nWe'll confirm your slot shortly. Thank you for choosing *Luxe Salon*! 💫`
  );
}

/**
 * Build a plain-text WhatsApp message for the salon admin.
 */
export function formatAdminMessage(appointment) {
  return (
    `🔔 *New Booking Alert — Luxe Salon*\n\n` +
    `👤 *Name:* ${appointment.name}\n` +
    `📞 *Phone:* ${appointment.phone}\n` +
    `✉️ *Email:* ${appointment.email}\n` +
    `💇 *Service:* ${appointment.service}\n` +
    `📅 *Date:* ${formatDate(appointment.preferredDate)}\n` +
    `⏰ *Time:* ${appointment.preferredTime}\n` +
    (appointment.notes ? `📝 *Notes:* ${appointment.notes}\n` : "") +
    `\n_Sent from Luxe Salon Booking System_`
  );
}

/**
 * Send a WhatsApp text message via Meta Cloud API.
 * @param {Object} params
 * @param {string} params.to   - Recipient phone number (auto-normalised to E.164)
 * @param {string} params.message - Plain text message body
 */
export async function sendWhatsApp({ to, message }) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId) {
    throw new Error("WHATSAPP_PHONE_NUMBER_ID is not set in environment variables.");
  }
  if (!accessToken) {
    throw new Error("WHATSAPP_ACCESS_TOKEN is not set in environment variables.");
  }

  const recipientPhone = normalizePhone(to);
  const url = `${META_BASE_URL}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientPhone,
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  console.log(`[WHATSAPP] Sending message to ${recipientPhone} via Meta Cloud API...`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg =
        data?.error?.message ||
        data?.error?.error_data?.details ||
        JSON.stringify(data);
      throw new Error(`Meta WhatsApp API error (${response.status}): ${errMsg}`);
    }

    const msgId = data?.messages?.[0]?.id || "unknown";
    console.log(`[WHATSAPP] Message sent to ${recipientPhone}. Message ID: ${msgId}`);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
