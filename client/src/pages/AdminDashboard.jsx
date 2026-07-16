import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Gauge,
  LayoutDashboard,
  Mail,
  Menu,
  MoreHorizontal,
  Search,
  Scissors,
  Settings,
  Sparkles,
  Star,
  Users,
  UserRoundCheck,
  X,
  XCircle
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const appointmentsSeed = [
  {
    id: 1,
    client: 'Ariana Mehta',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    services: ['Balayage', 'Gloss Toner'],
    date: 'Jul 16, 2026',
    time: '10:30 AM',
    staff: 'Mira Laurent',
    status: 'Pending',
    notes: 'Prefers warm champagne tones with soft face framing.'
  },
  {
    id: 2,
    client: 'Nadia Kapoor',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    services: ['Skin Atelier Facial'],
    date: 'Jul 16, 2026',
    time: '12:00 PM',
    staff: 'Elena Vale',
    status: 'Confirmed',
    notes: 'Sensitive skin. Avoid strong exfoliation.'
  },
  {
    id: 3,
    client: 'Sofia Rao',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80',
    services: ['Bridal Styling', 'Makeup Trial'],
    date: 'Jul 17, 2026',
    time: '03:15 PM',
    staff: 'Amara Voss',
    status: 'Rescheduled',
    notes: 'Bring veil and reference photos.'
  },
  {
    id: 4,
    client: 'Kiara Shah',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    services: ['Luxe Scalp Spa'],
    date: 'Jul 18, 2026',
    time: '11:45 AM',
    staff: 'Mira Laurent',
    status: 'Pending',
    notes: 'First visit. Interested in home care plan.'
  }
];

const staff = [
  { name: 'Mira Laurent', role: 'Color Director', load: 78, status: 'Available' },
  { name: 'Elena Vale', role: 'Skin Specialist', load: 64, status: 'In Treatment' },
  { name: 'Amara Voss', role: 'Bridal Lead', load: 91, status: 'Fully Booked' }
];

const reviews = [
  { client: 'Priya M.', text: 'Every detail felt considered. The finish was beautiful and calm.', rating: 5 },
  { client: 'Isha R.', text: 'Best color consultation I have had. Luxe but never intimidating.', rating: 5 },
  { client: 'Tanya S.', text: 'The team made a busy bridal morning feel effortless.', rating: 5 }
];

const trend = [34, 48, 42, 58, 64, 73, 82];
const slots = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

const menuItems = [
  [LayoutDashboard, 'Dashboard'],
  [CalendarDays, 'Appointments'],
  [Users, 'Clients'],
  [UserRoundCheck, 'Staff'],
  [Scissors, 'Services'],
  [BarChart3, 'Reports'],
  [Settings, 'Settings']
];

const statusStyles = {
  Pending: 'border-amber-300/40 bg-amber-300/12 text-amber-100',
  Confirmed: 'border-emerald-300/40 bg-emerald-300/12 text-emerald-100',
  Rejected: 'border-rose-300/40 bg-rose-300/12 text-rose-100',
  Rescheduled: 'border-sky-300/40 bg-sky-300/12 text-sky-100'
};

function AdminButton({ children, onClick, variant = 'soft', className = '' }) {
  const variants = {
    soft: 'border-white/10 bg-white/8 text-rose-50 hover:bg-white/14',
    gold: 'bg-[#d7b46a] text-[#21100f] hover:bg-[#f0cf82]',
    danger: 'bg-[#7b2038] text-rose-50 hover:bg-[#9b2947]'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(18)].map((_, index) => (
        <span
          key={index}
          className="admin-sparkle absolute h-1 w-1 rounded-full bg-[#f3d78e]/70"
          style={{
            left: `${8 + ((index * 17) % 88)}%`,
            top: `${10 + ((index * 29) % 80)}%`,
            animationDelay: `${index * 0.3}s`
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0.92 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
      {status}
    </motion.span>
  );
}

export default function AdminDashboard() {
  useDocumentTitle('Admin Dashboard | LuxeGlow Salon', 'Luxury salon management dashboard for appointments, staff, reports, and clients.');

  const [collapsed, setCollapsed] = useState(false);
  const [appointments, setAppointments] = useState(appointmentsSeed);
  const [selected, setSelected] = useState(appointmentsSeed[0]);
  const [reschedule, setReschedule] = useState(null);
  const [toast, setToast] = useState('');

  const kpis = useMemo(
    () => [
      ['Today\'s Appointments', '12', CalendarDays, '+18%'],
      ['Pending Approvals', '4', Clock, 'Needs review'],
      ['Revenue This Week', '$2,845', Crown, '+12.4%'],
      ['Occupancy Rate', '87%', Gauge, 'High demand']
    ],
    []
  );

  const updateStatus = (id, status) => {
    setAppointments((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelected((item) => (item?.id === id ? { ...item, status } : item));
    setToast(`${status} successfully`);
    window.setTimeout(() => setToast(''), 1800);
  };

  const sendEmail = (client) => {
    setToast(`Email sent successfully to ${client}`);
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#15080d] text-rose-50">
      <SparkleField />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(123,32,56,0.38),transparent_34rem),radial-gradient(circle_at_80%_10%,rgba(215,180,106,0.18),transparent_28rem),linear-gradient(135deg,#12070b_0%,#241017_52%,#3b1624_100%)]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className={`${collapsed ? 'w-[5.5rem]' : 'w-72'} hidden border-r border-white/10 bg-black/18 p-4 backdrop-blur-2xl transition-all duration-300 lg:block`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d7b46a] text-[#25100d] shadow-[0_0_30px_rgba(215,180,106,0.28)]">
                <Sparkles size={22} />
              </span>
              {!collapsed && (
                <div>
                  <h1 className="font-display text-2xl font-semibold">LuxeGlow</h1>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#e8c7ba]/60">Salon Suite</p>
                </div>
              )}
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map(([Icon, label], index) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${index === 0 ? 'bg-[#d7b46a] text-[#25100d]' : 'text-rose-100/70 hover:bg-white/8 hover:text-rose-50'}`}
              >
                <Icon size={19} />
                {!collapsed && <span>{label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#15080d]/72 px-4 py-4 backdrop-blur-2xl sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/6 lg:hidden" aria-label="Open menu">
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d7b46a]">Owner Dashboard</p>
                  <h2 className="font-display text-3xl font-semibold sm:text-4xl">LuxeGlow Salon</h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-h-12 min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 text-rose-50/70 sm:w-80">
                  <Search size={18} />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-rose-50/40" placeholder="Search clients, staff, services" />
                </label>
                <button className="relative grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/8">
                  <Bell size={19} />
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#d7b46a]" />
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 p-1 pr-4">
                  <img className="h-10 w-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Owner profile" />
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold">Sophia Owner</p>
                    <p className="text-xs text-rose-50/45">Salon Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 sm:p-6">
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {kpis.map(([label, value, Icon, delta], index) => (
                <motion.article
                  key={label}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-rose-50/55">{label}</p>
                      <h3 className="mt-3 font-display text-4xl font-semibold">{value}</h3>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d7b46a]/15 text-[#f3d78e]">
                      <Icon size={22} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b46a]">{delta}</p>
                </motion.article>
              ))}
            </section>

            <section className="grid gap-6 2xl:grid-cols-[1.45fr_0.85fr]">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#d7b46a]">Appointments Management</p>
                    <h3 className="mt-2 font-display text-3xl font-semibold">Today&apos;s guest flow</h3>
                  </div>
                  <AdminButton variant="gold"><CalendarDays size={16} /> New Appointment</AdminButton>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[920px] border-separate border-spacing-y-3 text-left">
                    <thead className="text-xs uppercase tracking-[0.18em] text-rose-50/42">
                      <tr>
                        <th className="px-4 py-2">Client</th>
                        <th className="px-4 py-2">Service(s)</th>
                        <th className="px-4 py-2">Date & Time</th>
                        <th className="px-4 py-2">Staff</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((item) => (
                        <motion.tr
                          key={item.id}
                          layout
                          onClick={() => setSelected(item)}
                          className="group cursor-pointer rounded-3xl bg-white/[0.055] transition hover:bg-[#d7b46a]/10 hover:shadow-[0_0_34px_rgba(215,180,106,0.16)]"
                        >
                          <td className="rounded-l-3xl px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img className="h-11 w-11 rounded-2xl object-cover" src={item.photo} alt={item.client} />
                              <div>
                                <p className="font-semibold">{item.client}</p>
                                <p className="text-xs text-rose-50/45">VIP guest</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {item.services.map((service) => (
                                <span key={service} className="rounded-full border border-white/10 bg-white/7 px-3 py-1 text-xs text-rose-50/72">{service}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium">{item.date}</p>
                            <p className="text-xs text-rose-50/45">{item.time}</p>
                          </td>
                          <td className="px-4 py-4 text-rose-50/72">{item.staff}</td>
                          <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                          <td className="rounded-r-3xl px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <AdminButton onClick={(event) => { event.stopPropagation(); updateStatus(item.id, 'Confirmed'); }} className="px-3"><Check size={15} /> Approve</AdminButton>
                              <AdminButton variant="danger" onClick={(event) => { event.stopPropagation(); updateStatus(item.id, 'Rejected'); }} className="px-3"><XCircle size={15} /> Reject</AdminButton>
                              <AdminButton onClick={(event) => { event.stopPropagation(); setReschedule(item); }} className="px-3"><Clock size={15} /> Reschedule</AdminButton>
                              <AdminButton onClick={(event) => { event.stopPropagation(); sendEmail(item.client); }} className="px-3"><Mail size={15} /> Email</AdminButton>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selected && (
                  <motion.aside
                    key={selected.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">Appointment Details</p>
                      <MoreHorizontal className="text-rose-50/50" />
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <img className="h-16 w-16 rounded-3xl object-cover" src={selected.photo} alt={selected.client} />
                      <div>
                        <h3 className="font-display text-3xl font-semibold">{selected.client}</h3>
                        <StatusBadge status={selected.status} />
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 text-sm text-rose-50/72">
                      <p><span className="text-rose-50/42">Services:</span> {selected.services.join(', ')}</p>
                      <p><span className="text-rose-50/42">When:</span> {selected.date} at {selected.time}</p>
                      <p><span className="text-rose-50/42">Artist:</span> {selected.staff}</p>
                      <p className="rounded-2xl border border-white/10 bg-black/12 p-4 leading-7">{selected.notes}</p>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_1fr] 2xl:grid-cols-[1fr_0.9fr_0.9fr]">
              <article className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">Quick Statistics</p>
                <h3 className="mt-2 font-display text-3xl font-semibold">Appointment trends</h3>
                <div className="mt-8 flex h-48 items-end gap-3">
                  {trend.map((value, index) => (
                    <motion.div key={index} className="flex flex-1 flex-col items-center gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                      <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#7b2038] to-[#d7b46a]" style={{ height: `${value}%` }} />
                      <span className="text-xs text-rose-50/42">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
                    </motion.div>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">Calendar Preview</p>
                <h3 className="mt-2 font-display text-3xl font-semibold">Upcoming</h3>
                <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs">
                  {[...Array(28)].map((_, index) => (
                    <button key={index} className={`aspect-square rounded-2xl border border-white/10 transition ${[2, 7, 14, 19].includes(index) ? 'bg-[#d7b46a] text-[#24100d]' : 'bg-white/6 text-rose-50/62 hover:bg-white/12'}`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl xl:col-span-2 2xl:col-span-1">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">Staff Availability</p>
                <div className="mt-5 space-y-4">
                  {staff.map((person) => (
                    <div key={person.name} className="rounded-3xl border border-white/10 bg-black/12 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{person.name}</p>
                          <p className="text-xs text-rose-50/45">{person.role}</p>
                        </div>
                        <span className="text-xs text-[#d7b46a]">{person.status}</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#e4b7a7] to-[#d7b46a]" style={{ width: `${person.load}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.client} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <div className="flex gap-1 text-[#d7b46a]">
                    {[...Array(review.rating)].map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
                  </div>
                  <p className="mt-4 leading-7 text-rose-50/72">{review.text}</p>
                  <p className="mt-4 text-sm font-semibold">{review.client}</p>
                </article>
              ))}
            </section>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {reschedule && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-xl rounded-[1.7rem] border border-white/10 bg-[#1c0c12] p-6 text-rose-50 shadow-[0_40px_120px_rgba(0,0,0,0.55)]" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7b46a]">Reschedule Appointment</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold">{reschedule.client}</h3>
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/8" onClick={() => setReschedule(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <input type="date" className="mt-6 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-rose-50 outline-none" />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {slots.map((slot) => (
                  <button key={slot} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm transition hover:bg-[#d7b46a] hover:text-[#24100d]">{slot}</button>
                ))}
              </div>
              <AdminButton
                variant="gold"
                className="mt-6 w-full"
                onClick={() => {
                  updateStatus(reschedule.id, 'Rescheduled');
                  setReschedule(null);
                }}
              >
                Confirm Reschedule
              </AdminButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#d7b46a]/40 bg-[#1c0c12]/95 px-5 py-3 text-sm font-semibold text-rose-50 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7b46a] text-[#24100d]"><Check size={16} /></span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
