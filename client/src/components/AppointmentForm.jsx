import { useState } from 'react';
import axios from 'axios';
import { CalendarCheck } from 'lucide-react';
import Button from './Button.jsx';
import { services } from '../data/salon.js';
import { apiPath } from '../utils/api.js';

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

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
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
          <input id="preferredDate" className="field w-full" type="date" name="preferredDate" value={form.preferredDate} onChange={update} required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-ink/70 uppercase tracking-wider" htmlFor="preferredTime">Preferred Time</label>
          <input id="preferredTime" className="field w-full" type="time" name="preferredTime" value={form.preferredTime} onChange={update} required />
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
