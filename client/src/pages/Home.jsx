import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { services, testimonials } from '../data/salon.js';

export default function Home() {
  const heroRef = useRef(null);

  useDocumentTitle(
    'Luxe Salon | Luxury Hair, Beauty & Spa',
    'Book elevated hair, color, skincare, bridal, and spa services at Luxe Salon.'
  );

  const heroImages = useMemo(
    () => [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    []
  );



  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-media', {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-copy > *', {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [heroImages]);

  return (
    <PageTransition>
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-ink text-pearl"
      >
        <div className="absolute inset-0 overflow-hidden">

          <img
            key={currentImage}
            src={heroImages[currentImage]}
            alt="Luxury Salon"
            className="hero-media absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-1000 ease-in-out"
          />

        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/72 to-ink/18" />

        <div className="container-luxe relative flex min-h-[calc(100vh-5rem)] items-center py-20">
          <div className="hero-copy max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.32em] text-champagne">
              <Sparkles size={16} /> Private beauty atelier
            </p>

            <h1 className="font-display text-6xl font-semibold leading-[0.92] sm:text-7xl lg:text-8xl">
              Luxe Salon
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-pearl/80 sm:text-xl">
              Precision hair, luminous skin, refined nails, and occasion styling
              in a calm, detail-led salon experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/book" variant="light">
                Book an Appointment <ArrowRight size={18} />
              </Button>

              <Button
                to="/services"
                variant="outline"
                className="border-pearl/35 text-pearl hover:text-ink"
              >
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-8 py-16 md:grid-cols-3">
        {['Expert-led rituals', 'Clean luxury finish', 'Consult-first care'].map(
          (item, index) => (
            <Reveal
              key={item}
              delay={index * 0.08}
              className="border-l-2 border-champagne bg-pearl p-6 shadow-sm"
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-clay">
                0{index + 1}
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold">
                {item}
              </h2>

              <p className="mt-3 leading-7 text-ink/66">
                Every appointment is shaped by consultation, craft, and an
                unhurried sense of polish.
              </p>
            </Reveal>
          )
        )}
      </section>

      <section className="bg-pearl py-20">
        <div className="container-luxe">
          <SectionHeader
            eyebrow="Services"
            title="Rituals designed for modern luxury"
            copy="A considered menu for hair, complexion, nails, scalp health, and milestone events."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service, index) => (
              <Reveal key={service.title} delay={index * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeader
            eyebrow="The Atelier"
            title="Quiet confidence, exacting hands"
            copy="Luxe Salon pairs editorial technique with soft hospitality: warm towels, thoughtful pacing, product guidance, and a finish you can actually recreate."
          />

          <Button to="/about" variant="outline" className="mt-8">
            Meet the Team
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
          <img
            className="h-72 w-full object-cover"
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
            alt="Salon hair wash ritual"
          />

          <img
            className="mt-10 h-72 w-full object-cover"
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
            alt="Salon beauty service"
          />
        </Reveal>
      </section>

      <section className="bg-moss py-20 text-pearl">
        <div className="container-luxe">
          <SectionHeader
            eyebrow="Client Notes"
            title="Polished reviews, quietly glowing"
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.author}
                className="border border-pearl/15 bg-pearl/8 p-6"
              >
                <div className="flex gap-1 text-champagne">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-5 leading-7 text-pearl/78">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-champagne">
                  {item.author}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}