import { Award, HeartHandshake, Leaf } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { stylists } from '../data/salon.js';

export default function About() {
  useDocumentTitle('About | Luxe Salon', 'Meet the Luxe Salon atelier and learn about our luxury salon philosophy.');

  return (
    <PageTransition>
      <section className="container-luxe grid gap-10 py-16 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <SectionHeader
            eyebrow="Our Philosophy"
            title="Luxury is precision with warmth"
            copy="Luxe Salon was created for guests who care about detail without wanting the experience to feel stiff. The room is calm, the consultation is honest, and the craft is exact."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <img
            className="h-[32rem] w-full object-cover shadow-soft"
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80"
            alt="Luxe Salon interior"
          />
        </Reveal>
      </section>

      <section className="bg-pearl py-20">
        <div className="container-luxe grid gap-6 md:grid-cols-3">
          {[
            [Award, 'Senior craft', 'Artists are selected for technical fluency, taste, and calm client communication.'],
            [Leaf, 'Considered products', 'We choose high-performance formulas with scalp, skin, and hair integrity in mind.'],
            [HeartHandshake, 'Hospitality first', 'Appointments are paced so you feel seen, not rushed through a schedule.']
          ].map(([Icon, title, copy]) => (
            <Reveal key={title} className="border border-ink/10 bg-white/60 p-7">
              <Icon className="text-clay" size={28} />
              <h2 className="mt-5 font-display text-3xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-ink/65">{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20">
        <SectionHeader eyebrow="Team" title="A small, deliberate atelier" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stylists.map((stylist, index) => (
            <Reveal key={stylist.name} delay={index * 0.08} className="border border-ink/10 bg-pearl p-7">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-champagne">Artist</p>
              <h3 className="mt-4 font-display text-3xl font-semibold">{stylist.name}</h3>
              <p className="mt-3 text-ink/65">{stylist.role}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
