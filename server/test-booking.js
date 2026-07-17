import dotenv from 'dotenv';
dotenv.config();

import {
  appointmentConfirmationEmail,
  appointmentNotificationEmail,
  sendMail
} from './src/services/mailer.js';

const mockAppointment = {
  name: 'Test Client',
  email: 'agraharisaksham0109@gmail.com',
  phone: '916390385831',
  service: 'Signature Hair Design',
  preferredDate: new Date('2026-07-25T00:00:00.000Z'),
  preferredTime: '14:30',
  notes: 'Testing mailer execution flows'
};

async function test() {
  console.log('Sending salon notification...');
  try {
    await sendMail({
      to: process.env.SALON_EMAIL,
      subject: `New Appointment - ${mockAppointment.service}`,
      html: appointmentNotificationEmail(mockAppointment),
      replyTo: mockAppointment.email
    });
    console.log('Salon notification sent successfully.');
  } catch (err) {
    console.error('Salon notification failed:', err);
  }

  console.log('Sending customer confirmation...');
  try {
    await sendMail({
      to: mockAppointment.email,
      subject: 'Appointment Request Received | Luxe Salon',
      html: appointmentConfirmationEmail(mockAppointment)
    });
    console.log('Customer confirmation sent successfully.');
  } catch (err) {
    console.error('Customer confirmation failed:', err);
  }
}

test();
