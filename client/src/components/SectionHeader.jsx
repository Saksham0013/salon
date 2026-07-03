export default function SectionHeader({ eyebrow, title, copy, align = 'left' }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-clay">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h2>
      {copy && <p className="mt-5 text-base leading-8 text-ink/68 sm:text-lg">{copy}</p>}
    </div>
  );
}
