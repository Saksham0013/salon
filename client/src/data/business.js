export const business = {
  name: 'Luxe Salon',
  address: 'Karbala Rd, Nautanwa, Uttar Pradesh 273164',
  phoneDisplay: '+91 63930 19726',
  phoneE164: '916393019726',
  email: 'agraharisaksham0109@gmail.com',
  instagramUrl: 'https://www.instagram.com/facestoriesbyvaishnavi/',
  whatsappMessage: 'Hello Luxe Salon, I want to book an appointment.'
};

export const whatsappUrl = `https://wa.me/${business.phoneE164}?text=${encodeURIComponent(
  business.whatsappMessage
)}`;
