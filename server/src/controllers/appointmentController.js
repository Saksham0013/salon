import Appointment from "../models/Appointment.js";
import { isDatabaseReady } from "../config/database.js";
import { appointmentEmail, sendMail } from "../services/mailer.js";
import { saveAppointment } from "../services/memoryStore.js";

export async function createAppointment(req, res, next) {
  try {
    const appointment = isDatabaseReady()
      ? await Appointment.create(req.body)
      : saveAppointment(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment request received.",
      appointmentId: appointment._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });

    sendMail({
      subject: `New Luxe Salon Appointment: ${appointment.service}`,
      html: appointmentEmail(appointment),
      replyTo: appointment.email,
    })
      .then((info) => {
        console.log("Appointment email sent:", info.messageId);
      })
      .catch((mailError) => {
        console.error("Appointment email sending failed:", mailError.message);
      });
  } catch (error) {
    next(error);
  }
}
