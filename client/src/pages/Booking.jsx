import { Clock, MapPin, Phone } from 'lucide-react';
import AppointmentForm from '../components/AppointmentForm.jsx';
import PageTransition from '../components/PageTransition.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function Booking() {
  useDocumentTitle('Book Appointment | Luxe Salon', 'Request a Luxe Salon appointment for hair, color, skin, nails, bridal, or spa services.');

  return (
    <PageTransition>
      <section className="container-luxe grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            eyebrow="Booking"
            title="Reserve your Luxe Salon visit"
            copy="Submit your preferred service, date, and time. We will confirm availability and recommend the right artist for your goals."
          />
          <div className="mt-8 grid gap-4 text-sm text-ink/72">
            <p className="flex items-center gap-3"><Clock size={18} /> Same-day requests are subject to artist availability.</p>
            <p className="flex items-center gap-3"><Phone size={18} /> +91 6390385831.</p>
            <p className="flex items-center gap-3"><MapPin size={18} /> Kunserwa, Nautanwa Bazar, Maharajganj, Uttar Pradesh</p>
          </div>
        </div>
        <AppointmentForm />
      </section>
    </PageTransition>
  );
}
