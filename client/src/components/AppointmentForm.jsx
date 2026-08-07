import { useState } from 'react';
import axios from 'axios';
import { CalendarCheck } from 'lucide-react';
import Button from './Button.jsx';
import { services } from '../data/salon.js';
import { apiPath } from '../utils/api.js';

const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTimeStr = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const initial = {
  name: '',
  email: '',
  phone: '',
  service: services[0].title,
  preferredDate: '',
  preferredTime: '',
  notes: ''
};

export default function AppointmentForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const todayStr = getTodayStr();
  const currentTimeStr = getCurrentTimeStr();

  // If selected date is today, min time is current time; otherwise no minimum time restriction
  const minTime = form.preferredDate === todayStr ? currentTimeStr : undefined;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const nextForm = { ...current, [name]: value };

      // If user selects today and current preferredTime is in the past, reset preferredTime
      if (nextForm.preferredDate === todayStr && nextForm.preferredTime && nextForm.preferredTime < currentTimeStr) {
        nextForm.preferredTime = '';
      }
      return nextForm;
    });
  };

  const submit = async (event) => {
    event.preventDefault();

    // Extra validation check for past date or past time on today
    if (form.preferredDate < todayStr) {
      setStatus({ state: 'error', message: 'Please select today or a future date for your appointment.' });
      return;
    }
    if (form.preferredDate === todayStr && form.preferredTime < currentTimeStr) {
      setStatus({ state: 'error', message: 'Please select a future time slot for today.' });
      return;
    }

    setStatus({ state: 'loading', message: 'Sending your appointment request...' });
    try {
      await axios.post(apiPath('/api/appointments'), form);

      setForm(initial);
      setStatus({
        state: 'success',
        message: 'Your request is in. The atelier will confirm availability shortly.'
      });
    } catch (error) {
      setStatus({
        state: 'error',
        message: error.response?.data?.message || 'We could not send that request. Please try again.'
      });
    }
  };

  return (
    <form onSubmit={submit} className="glass-panel grid gap-4 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="name" value={form.name} onChange={update} placeholder="Full name" required minLength="2" />
        <input className="field" type="email" name="email" value={form.email} onChange={update} placeholder="Email address" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" name="phone" value={form.phone} onChange={update} placeholder="Phone number" required minLength="7" />
        <select className="field" name="service" value={form.service} onChange={update} required>
          {services.map((service) => (
            <option key={service.title} value={service.title}>{service.title}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-ink/70 uppercase tracking-wider" htmlFor="preferredDate">Preferred Date</label>
          <input id="preferredDate" className="field w-full" type="date" name="preferredDate" min={todayStr} value={form.preferredDate} onChange={update} required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-ink/70 uppercase tracking-wider" htmlFor="preferredTime">Preferred Time</label>
          <input id="preferredTime" className="field w-full" type="time" name="preferredTime" min={minTime} value={form.preferredTime} onChange={update} required />
        </div>
      </div>
      <textarea className="field min-h-32 resize-y" name="notes" value={form.notes} onChange={update} placeholder="Tell us about your goals, timing, or special requests." />
      <Button type="submit" disabled={status.state === 'loading'} className="w-full disabled:cursor-not-allowed disabled:opacity-60">
        <CalendarCheck size={18} /> Request Appointment
      </Button>
      {status.message && (
        <p className={`text-sm font-medium ${status.state === 'error' ? 'text-red-700' : 'text-moss'}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}

