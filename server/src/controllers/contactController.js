import ContactMessage from "../models/ContactMessage.js";
import { isDatabaseReady } from "../config/database.js";
import { contactEmail, sendMail } from "../services/mailer.js";
import { saveContactMessage } from "../services/memoryStore.js";

export async function createContactMessage(req, res, next) {
  try {
    // Save message
    const message = isDatabaseReady()
      ? await ContactMessage.create(req.body)
      : saveContactMessage(req.body);

    // Send email
    try {
      const info = await sendMail({
        subject: `📩 New Contact Message: ${message.subject}`,
        html: contactEmail(message),
        replyTo: message.email,
      });

      console.log("====================================");
      console.log("✅ CONTACT EMAIL SENT");
      console.log("Message ID:", info.messageId);
      console.log("Accepted:", info.accepted);
      console.log("Rejected:", info.rejected);
      console.log("Response:", info.response);
      console.log("====================================");
    } catch (mailError) {
      console.error("====================================");
      console.error("❌ CONTACT EMAIL FAILED");
      console.error(mailError);
      console.error("====================================");
    }

    res.status(201).json({
      success: true,
      message: "Contact message received successfully.",
      messageId: message._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });
  } catch (error) {
    next(error);
  }
}