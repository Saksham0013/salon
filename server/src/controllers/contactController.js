import ContactMessage from "../models/ContactMessage.js";
import { isDatabaseReady } from "../config/database.js";
import { contactEmail, sendMail } from "../services/mailer.js";
import { saveContactMessage } from "../services/memoryStore.js";

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

    sendMail({
      subject: `New Contact Message: ${message.subject}`,
      html: contactEmail(message),
      replyTo: message.email,
    })
      .then((info) => {
        console.log("Contact email sent:", info.messageId);
      })
      .catch((mailError) => {
        console.error("Contact email sending failed:", mailError.message);
      });
  } catch (error) {
    next(error);
  }
}
