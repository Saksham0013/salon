import { Link } from 'react-router-dom';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-champagne/25 hover:-translate-y-0.5 hover:scale-105';

const variants = {
  primary: 'bg-ink text-pearl hover:bg-clay',
  light: 'bg-pearl text-ink hover:bg-champagne',
  outline: 'border border-ink/20 text-ink hover:border-champagne hover:bg-champagne/15'
};

export default function Button({ to, href, children, variant = 'primary', className = '', ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
