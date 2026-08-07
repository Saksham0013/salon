import Appointment from "../models/Appointment.js";
import { isDatabaseReady } from "../config/database.js";
import {
  appointmentConfirmationEmail,
  appointmentNotificationEmail,
  sendMail,
} from "../services/mailer.js";
import { saveAppointment } from "../services/memoryStore.js";
import {
  sendWhatsApp,
  formatCustomerMessage,
  formatAdminMessage,
} from "../services/whatsapp.js";

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

// ─── WhatsApp Notifications ───────────────────────────────────────────────────

function sendAppointmentWhatsApps(appointment) {
  const whatsappConfigured =
    process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN;

  if (!whatsappConfigured) {
    console.warn(
      "[WHATSAPP] WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN not set. WhatsApp notifications skipped."
    );
    return;
  }

  // Notify salon owner
  const salonWhatsApp = process.env.SALON_WHATSAPP;
  if (salonWhatsApp) {
    console.log(`[WHATSAPP] Sending admin booking alert to salon: ${salonWhatsApp}`);
    sendWhatsApp({
      to: salonWhatsApp,
      message: formatAdminMessage(appointment),
    })
      .then((info) => {
        console.log(`[WHATSAPP] Admin alert sent successfully to ${salonWhatsApp}.`, info);
      })
      .catch((error) => {
        console.error(`[WHATSAPP] Admin alert failed for ${salonWhatsApp}:`, error.message);
      });
  } else {
    console.warn("[WHATSAPP] SALON_WHATSAPP not set. Admin WhatsApp notification skipped.");
  }

  // Notify customer
  if (appointment.phone) {
    console.log(`[WHATSAPP] Sending booking confirmation to customer: ${appointment.phone}`);
    sendWhatsApp({
      to: appointment.phone,
      message: formatCustomerMessage(appointment),
    })
      .then((info) => {
        console.log(`[WHATSAPP] Customer confirmation sent successfully to ${appointment.phone}.`, info);
      })
      .catch((error) => {
        console.error(`[WHATSAPP] Customer confirmation failed for ${appointment.phone}:`, error.message);
      });
  }
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
    sendAppointmentWhatsApps(appointment);
  } catch (error) {
    console.error("[BOOKING FLOW] [FATAL ERROR] Appointment creation failed:", error);
    next(error);
  }
}
