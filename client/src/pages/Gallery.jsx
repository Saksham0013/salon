import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { gallery } from '../data/salon.js';

export default function Gallery() {
  const gridRef = useRef(null);
  useDocumentTitle('Gallery | Luxe Salon', 'View the Luxe Salon gallery of hair, beauty, skincare, and salon atmosphere.');

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.gallery-tile', {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out'
      });
    }, gridRef);
    return () => context.revert();
  }, []);

  return (
    <PageTransition>
      <section className="container-luxe py-16">
        <SectionHeader
          eyebrow="Gallery"
          title="Details from the atelier"
          copy="A glimpse at the textures, tones, and quiet visual language of Luxe Salon."
        />
        <div ref={gridRef} className="mt-10 grid auto-rows-[18rem] gap-4 md:grid-cols-3">
          {gallery.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Luxe Salon gallery ${index + 1}`}
              className={`gallery-tile h-full w-full object-cover shadow-sm ${index === 0 || index === 4 ? 'md:row-span-2' : ''}`}
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
