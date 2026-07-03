import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm.jsx';
import PageTransition from '../components/PageTransition.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { business, whatsappUrl } from '../data/business.js';

export default function Contact() {
  useDocumentTitle('Contact | Luxe Salon', 'Contact Luxe Salon for appointments, events, product questions, and guest care.');

  return (
    <PageTransition>
      <section className="container-luxe grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            eyebrow="Contact"
            title="Speak with the atelier"
            copy="For appointment changes, private events, press, or product guidance, send a note and the guest concierge will reply."
          />
          <div className="mt-8 space-y-4 text-ink/72">
            <p className="flex items-center gap-3"><MapPin size={20} /> {business.address}</p>
            <p className="flex items-center gap-3"><Phone size={20} /> {business.phoneDisplay}</p>
            <p className="flex items-center gap-3"><Mail size={20} /> {business.email}</p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1fb457]"
            >
              <WhatsAppIcon size={20} /> WhatsApp
            </a>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-champagne hover:bg-champagne/15"
            >
              <Instagram size={18} /> Instagram
            </a>
          </div>
        </div>
        <div className="glass-panel p-5 sm:p-7">
          <ContactForm />
        </div>
      </section>
      <section className="h-[28rem] bg-ink">
        <iframe
          title="Luxe Salon map"
          className="h-full w-full opacity-80 grayscale"
          loading="lazy"
          src="https://maps.google.com/maps?q=Kunserwa%20Nautanwa%20Bazar%20Maharajganj%20Uttar%20Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </section>
    </PageTransition>
  );
}
