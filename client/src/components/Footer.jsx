import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { business } from '../data/business.js';

export default function Footer() {
  return (
    <footer className="bg-ink text-pearl">
      <div className="container-luxe grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-4xl font-semibold">Luxe Salon</h2>
          <p className="mt-4 max-w-md leading-7 text-pearl/70">
            A refined beauty atelier for hair, skin, nails, and event styling. Thoughtful service,
            polished technique, and a room that lets you exhale.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Visit</h3>
          <div className="mt-4 space-y-3 text-sm text-pearl/75">
            <p className="flex gap-3"><MapPin size={18} /> {business.address}</p>
            <p className="flex gap-3"><Phone size={18} /> {business.phoneDisplay}</p>
            <p className="flex gap-3"><Mail size={18} /> {business.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Hours</h3>
          <div className="mt-4 space-y-2 text-sm text-pearl/75">
            <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
            <p>Saturday: 9:00 AM - 6:00 PM</p>
            <p>Sunday: 10:00 AM - 4:00 PM</p>
          </div>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-champagne"
          >
            <Instagram size={18} /> Follow the atelier
          </a>
        </div>
      </div>
      <div className="border-t border-pearl/10 py-5">
        <div className="container-luxe flex flex-col gap-3 text-xs text-pearl/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Luxe Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
