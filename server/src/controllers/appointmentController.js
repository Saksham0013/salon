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

    // Send email (do not fail booking if email fails)
    try {
      const info = await sendMail({
        subject: `💇 New Luxe Salon Appointment: ${appointment.service}`,
        html: appointmentEmail(appointment),
        replyTo: appointment.email,
      });

      console.log("✅ Appointment email sent");
      console.log(info);
    } catch (mailError) {
      console.error("❌ Email sending failed:");
      console.error(mailError);
    }

    // Send success response
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