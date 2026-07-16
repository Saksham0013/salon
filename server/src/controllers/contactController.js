import ContactMessage from "../models/ContactMessage.js";
import { isDatabaseReady } from "../config/database.js";
import {
  contactAutoReplyEmail,
  contactNotificationEmail,
  sendMail,
} from "../services/mailer.js";
import { saveContactMessage } from "../services/memoryStore.js";

function sendContactEmails(message) {
  const salonEmail = process.env.SALON_EMAIL;

  if (salonEmail) {
    sendMail({
      to: salonEmail,
      subject: `New Contact Message - ${message.subject}`,
      html: contactNotificationEmail(message),
      replyTo: message.email,
    }).catch((error) => {
      console.error("Salon contact email failed:", error.message);
    });
  }

  sendMail({
    to: message.email,
    subject: "Thank you for contacting Luxe Salon",
    html: contactAutoReplyEmail(message),
  }).catch((error) => {
    console.error("Customer contact auto-reply failed:", error.message);
  });
}

export async function createContactMessage(req, res, next) {
  try {
    const message = isDatabaseReady()
      ? await ContactMessage.create(req.body)
      : saveContactMessage(req.body);

    res.status(201).json({
      success: true,
      message: "Contact message received successfully.",
      messageId: message._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });

    sendContactEmails(message);
  } catch (error) {
    next(error);
  }
}
