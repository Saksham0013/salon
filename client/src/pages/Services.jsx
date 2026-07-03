import AppointmentForm from '../components/AppointmentForm.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { services } from '../data/salon.js';

export default function Services() {
  useDocumentTitle('Services | Luxe Salon', 'Explore Luxe Salon services for hair, color, skincare, nails, bridal styling, and scalp care.');

  return (
    <PageTransition>
      <section className="container-luxe py-16">
        <SectionHeader
          eyebrow="Service Menu"
          title="A full suite of beauty rituals"
          copy="Each service begins with a consultation and ends with practical aftercare so the finish lives well beyond the chair."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={(index % 3) * 0.07}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-pearl">
        <div className="container-luxe grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-champagne">Reserve</p>
            <h2 className="mt-4 font-display text-5xl font-semibold">Request your chair</h2>
            <p className="mt-5 leading-8 text-pearl/72">
              Tell us what you are planning. A guest concierge will confirm the best artist, timing, and preparation notes.
            </p>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </PageTransition>
  );
}
