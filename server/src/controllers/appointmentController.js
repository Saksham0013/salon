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
  console.log(`[BOOKING FLOW] [LOG] Starting email dispatch for appointment ID: ${appointment._id}`);

  if (salonEmail) {
    console.log(`[BOOKING FLOW] [LOG] Dispatching admin notification email to: ${salonEmail}`);
    sendMail({
      to: salonEmail,
      subject: `New Appointment - ${appointment.service}`,
      html: appointmentNotificationEmail(appointment),
      replyTo: appointment.email,
    })
      .then((info) => {
        console.log(`[BOOKING FLOW] [SUCCESS] Admin notification email sent successfully to ${salonEmail}. Result:`, info);
      })
      .catch((error) => {
        console.error(`[BOOKING FLOW] [ERROR] Admin notification email failed for ${salonEmail}. Error:`, error);
      });
  } else {
    console.warn("[BOOKING FLOW] [WARNING] SALON_EMAIL environment variable is missing. Admin notification skipped.");
  }

  console.log(`[BOOKING FLOW] [LOG] Dispatching customer confirmation email to: ${appointment.email}`);
  sendMail({
    to: appointment.email,
    subject: "Appointment Request Received | Luxe Salon",
    html: appointmentConfirmationEmail(appointment),
  })
    .then((info) => {
      console.log(`[BOOKING FLOW] [SUCCESS] Customer confirmation email sent successfully to ${appointment.email}. Result:`, info);
    })
    .catch((error) => {
      console.error(`[BOOKING FLOW] [ERROR] Customer confirmation email failed for ${appointment.email}. Error:`, error);
    });
}

export async function createAppointment(req, res, next) {
  console.log("[BOOKING FLOW] [LOG] Received appointment request payload:", req.body);
  try {
    console.log("[BOOKING FLOW] [LOG] Validation passed. Saving appointment to storage...");
    const appointment = isDatabaseReady()
      ? await Appointment.create(req.body)
      : saveAppointment(req.body);

    console.log(`[BOOKING FLOW] [LOG] Appointment saved successfully. ID: ${appointment._id} | Storage: ${isDatabaseReady() ? "mongodb" : "memory"}`);

    res.status(201).json({
      success: true,
      message: "Appointment submitted successfully.",
      appointmentId: appointment._id,
      storage: isDatabaseReady() ? "mongodb" : "memory",
    });
    console.log("[BOOKING FLOW] [LOG] JSON response returned to client.");

    sendAppointmentEmails(appointment);
  } catch (error) {
    console.error("[BOOKING FLOW] [FATAL ERROR] Appointment creation failed:", error);
    next(error);
  }
}
