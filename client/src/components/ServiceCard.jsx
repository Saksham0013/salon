import { Clock } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <article className="group overflow-hidden border border-ink/10 bg-pearl shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold">{service.title}</h3>
          <p className="shrink-0 text-sm font-bold text-clay">{service.price}</p>
        </div>
        <p className="mt-3 leading-7 text-ink/66">{service.description}</p>
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink/54">
          <Clock size={16} /> {service.duration}
        </p>
      </div>
    </article>
  );
}
