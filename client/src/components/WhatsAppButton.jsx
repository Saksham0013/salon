import { whatsappUrl } from '../data/business.js';
import WhatsAppIcon from './WhatsAppIcon.jsx';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Message Luxe Salon on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft ring-4 ring-white/75 transition duration-200 hover:scale-105 hover:bg-[#1fb457] focus:outline-none focus:ring-[#25D366]/30"
    >
      <WhatsAppIcon size={36} />
    </a>
  );
}
