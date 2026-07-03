import Button from '../components/Button.jsx';
import PageTransition from '../components/PageTransition.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page Not Found | Luxe Salon', 'The requested Luxe Salon page could not be found.');

  return (
    <PageTransition>
      <section className="container-luxe grid min-h-[60vh] place-items-center py-20 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-clay">404</p>
          <h1 className="mt-4 font-display text-6xl font-semibold">This page stepped away.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-ink/66">
            The salon page you are looking for is unavailable. Return home or request an appointment.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button to="/">Home</Button>
            <Button to="/book" variant="outline">Book</Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
