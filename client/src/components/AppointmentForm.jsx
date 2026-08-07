import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck, ChevronDown, Clock } from 'lucide-react';
import Button from './Button.jsx';
import { services } from '../data/salon.js';
import { apiPath } from '../utils/api.js';

const TIME_SLOTS = [
  { value: '09:00', label: '09:00 AM' },
  { value: '09:30', label: '09:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '13:30', label: '01:30 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '14:30', label: '02:30 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '15:30', label: '03:30 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '16:30', label: '04:30 PM' },
  { value: '17:00', label: '05:00 PM' },
  { value: '17:30', label: '05:30 PM' },
  { value: '18:00', label: '06:00 PM' },
  { value: '18:30', label: '06:30 PM' },
  { value: '19:00', label: '07:00 PM' },
  { value: '19:30', label: '07:30 PM' },
  { value: '20:00', label: '08:00 PM' }
];

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
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const todayStr = getTodayStr();
  const currentTimeStr = getCurrentTimeStr();

  // Filter time slots: If today is selected, only show slots AFTER current time
  const availableTimeSlots = TIME_SLOTS.filter((slot) => {
    if (form.preferredDate === todayStr) {
      return slot.value > currentTimeStr;
    }
    return true;
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const nextForm = { ...current, [name]: value };

      if (nextForm.preferredDate === todayStr && nextForm.preferredTime && nextForm.preferredTime <= currentTimeStr) {
        nextForm.preferredTime = '';
      }
      return nextForm;
    });
  };

  const handleSelectTime = (value) => {
    setForm((current) => ({ ...current, preferredTime: value }));
    setIsTimeDropdownOpen(false);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.preferredTime) {
      setStatus({ state: 'error', message: 'Please select a preferred time slot.' });
      return;
    }

    if (form.preferredDate < todayStr) {
      setStatus({ state: 'error', message: 'Please select today or a future date.' });
      return;
    }
    if (form.preferredDate === todayStr && form.preferredTime <= currentTimeStr) {
      setStatus({ state: 'error', message: 'Please select a future time slot for today.' });
      return;
    }

    setStatus({ state: 'loading', message: 'Sending your appointment request...' });
    try {
      const selectedSlot = TIME_SLOTS.find((s) => s.value === form.preferredTime);
      const payload = {
        ...form,
        preferredTime: selectedSlot ? selectedSlot.label : form.preferredTime
      };

      await axios.post(apiPath('/api/appointments'), payload);

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

  const selectedSlotObj = TIME_SLOTS.find((s) => s.value === form.preferredTime);

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
        <div className="relative flex flex-col" ref={dropdownRef}>
          <label className="mb-1 text-xs font-medium text-ink/70 uppercase tracking-wider" htmlFor="preferredTime">Preferred Time</label>
          <button
            type="button"
            id="preferredTime"
            onClick={() => setIsTimeDropdownOpen((prev) => !prev)}
            className="field flex w-full items-center justify-between text-left"
          >
            <span className={form.preferredTime ? 'text-ink font-medium' : 'text-ink/46'}>
              {selectedSlotObj ? selectedSlotObj.label : 'Select time slot'}
            </span>
            <ChevronDown size={18} className={`transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-gold' : 'text-ink/50'}`} />
          </button>

          {isTimeDropdownOpen && (
            <div className="absolute top-[102%] left-0 z-50 max-h-52 w-full overflow-y-auto rounded-lg border border-gold/40 bg-[#fffaf4] p-1.5 shadow-2xl backdrop-blur-xl">
              {availableTimeSlots.length === 0 ? (
                <div className="px-3 py-3 text-xs text-ink/60 flex items-center gap-2">
                  <Clock size={14} /> No time slots available today. Please choose tomorrow.
                </div>
              ) : (
                availableTimeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => handleSelectTime(slot.value)}
                    className={`flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-sm transition-colors ${
                      form.preferredTime === slot.value
                        ? 'bg-[#d7b46a]/30 font-semibold text-ink'
                        : 'text-ink/85 hover:bg-[#d7b46a]/15 hover:text-ink'
                    }`}
                  >
                    <span>{slot.label}</span>
                    {form.preferredTime === slot.value && <span className="h-2 w-2 rounded-full bg-gold"></span>}
                  </button>
                ))
              )}
            </div>
          )}
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



