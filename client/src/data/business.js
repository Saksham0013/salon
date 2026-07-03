export const business = {
  name: 'Luxe Salon',
  address: 'Kunserwa, Nautanwa Bazar, Maharajganj, Uttar Pradesh',
  phoneDisplay: '+91 6390385831',
  phoneE164: '916390385831',
  email: 'sakshamagrahari1289@gmail.com',
  instagramUrl: 'https://www.instagram.com/sakshamagrahari1289/',
  whatsappMessage: 'Hello Luxe Salon, I want to book an appointment.'
};

export const whatsappUrl = `https://wa.me/${business.phoneE164}?text=${encodeURIComponent(
  business.whatsappMessage
)}`;
