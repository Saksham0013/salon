import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Scissors, X } from 'lucide-react';
import Button from './Button.jsx';

const links = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) =>
    `text-sm font-semibold uppercase tracking-[0.18em] transition ${
      isActive ? 'text-clay' : 'text-ink/72 hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-pearl/88 backdrop-blur-xl">
      <nav className="container-luxe flex min-h-20 items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3" aria-label="Luxe Salon home">
          <span className="grid h-11 w-11 place-items-center bg-ink text-champagne">
            <Scissors size={20} />
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold leading-none">Luxe Salon</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-ink/55">
              Beauty Atelier
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={navClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button to="/book" className="min-h-10 px-4 py-2">
            Book
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center border border-ink/15 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-pearl lg:hidden">
          <div className="container-luxe grid gap-4 py-5">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className={navClass} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            <Button to="/book" onClick={() => setOpen(false)}>
              Book an Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
