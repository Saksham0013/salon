import { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import Button from './Button.jsx';
import { apiPath } from '../utils/api.js';

const initial = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: 'loading', message: 'Sending your message...' });
    try {
      await axios.post(apiPath('/api/contact'), form);

      setForm(initial);
      setStatus({ state: 'success', message: 'Message received. We will reply soon.' });
    } catch (error) {
      setStatus({
        state: 'error',
        message: error.response?.data?.message || 'We could not send that message. Please try again.'
      });
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input className="field" name="name" value={form.name} onChange={update} placeholder="Full name" required minLength="2" />
      <input className="field" type="email" name="email" value={form.email} onChange={update} placeholder="Email address" required />
      <input className="field" name="subject" value={form.subject} onChange={update} placeholder="Subject" required minLength="3" />
      <textarea className="field min-h-36 resize-y" name="message" value={form.message} onChange={update} placeholder="How can we help?" required minLength="10" />
      <Button type="submit" disabled={status.state === 'loading'} className="disabled:cursor-not-allowed disabled:opacity-60">
        <Send size={18} /> Send Message
      </Button>
      {status.message && (
        <p className={`text-sm font-medium ${status.state === 'error' ? 'text-red-700' : 'text-moss'}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}
