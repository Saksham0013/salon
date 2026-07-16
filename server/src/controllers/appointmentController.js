import Appointment from "../models/Appointment.js";
import { isDatabaseReady } from "../config/database.js";
import { appointmentEmail, sendMail } from "../services/mailer.js";
import { saveAppointment } from "../services/memoryStore.js";

export async function createAppointment(req, res, next) {
  try {
    // Save appointment
    const appointment = isDatabaseReady()
      ? await Appointment.create(req.body)
      : saveAppointment(req.body);

    // Send email
    try {
      const info = await sendMail({
        subject: `New Luxe Salon Appointment: ${appointment.service}`,
        html: appointmentEmail(appointment),
        replyTo: appointment.email,
      });

      console.log("====================================");
      console.log("✅ APPOINTMENT EMAIL SENT");
      console.log("Message ID:", info.messageId);
      console.log("Accepted:", info.accepted);
      console.log("Rejected:", info.rejected);
      console.log("====================================");
    } catch (mailError) {
      console.error("====================================");
      console.error("❌ APPOINTMENT EMAIL FAILED");
      console.error("Message:", mailError.message);
      console.error("Code:", mailError.code);
      console.error("Response:", mailError.response);
      console.error(mailError);
      console.error("====================================");
    }

    // Send response
    res.status(201).json({
      success: true,
      message: "Appointment request received.",
      appointmentId: appointment._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });

  } catch (error) {
    next(error);
  }
}