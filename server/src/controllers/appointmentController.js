import Appointment from "../models/Appointment.js";
import { isDatabaseReady } from "../config/database.js";
import {
  appointmentConfirmationEmail,
  appointmentNotificationEmail,
  sendMail,
} from "../services/mailer.js";
import { saveAppointment } from "../services/memoryStore.js";

function sendAppointmentEmails(appointment) {
  const salonEmail = process.env.SALON_EMAIL;

  if (salonEmail) {
    sendMail({
      to: salonEmail,
      subject: `New Appointment - ${appointment.service}`,
      html: appointmentNotificationEmail(appointment),
      replyTo: appointment.email,
    }).catch((error) => {
      console.error("Salon appointment email failed:", error.message);
    });
  }

  sendMail({
    to: appointment.email,
    subject: "Appointment Request Received | Luxe Salon",
    html: appointmentConfirmationEmail(appointment),
  }).catch((error) => {
    console.error("Customer appointment confirmation failed:", error.message);
  });
}

export async function createAppointment(req, res, next) {
  try {
    const appointment = isDatabaseReady()
      ? await Appointment.create(req.body)
      : saveAppointment(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment submitted successfully.",
      appointmentId: appointment._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });

    sendAppointmentEmails(appointment);
  } catch (error) {
    next(error);
  }
}
