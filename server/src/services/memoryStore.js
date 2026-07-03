const appointments = [];
const contactMessages = [];

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function saveAppointment(payload) {
  const appointment = {
    ...payload,
    _id: createId('apt'),
    status: 'requested',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  appointments.push(appointment);
  return appointment;
}

export function saveContactMessage(payload) {
  const message = {
    ...payload,
    _id: createId('msg'),
    status: 'new',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  contactMessages.push(message);
  return message;
}
