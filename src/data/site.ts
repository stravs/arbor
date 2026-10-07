import type { ImageMetadata } from 'astro';
import maliceJson from './malice.json';

import arbor1 from '../assets/photos/arbor1.jpg';
import arbor2 from '../assets/photos/arbor2.jpg';
import arbor3 from '../assets/photos/arbor3.jpg';
import golaz from '../assets/photos/golaz3-1.jpg';
import golazTall from '../assets/photos/golaz4.jpg';
import solata from '../assets/photos/solata3.jpg';
import ravioli from '../assets/photos/ravioli4.jpg';
import klobasa from '../assets/photos/kranjska-klobasa-3.jpg';
import sufle from '../assets/photos/sufle4.jpg';
import sufleWide from '../assets/photos/sufle3.jpg';
import struklji from '../assets/photos/skutini-struklji-3.jpg';
import logo from '../assets/brand/logo.png';
import eatLocal from '../assets/brand/eat-local.png';

export type Lang = 'sl' | 'en';
export const langs: Lang[] = ['sl', 'en'];

export const images = { arbor1, arbor2, arbor3, golaz, golazTall, solata, ravioli, klobasa, sufle, sufleWide, struklji, logo, eatLocal };

export const contact = {
  name: 'Restavracija Arbor Bled',
  phone: '+386 (0)4 57 43 033',
  tel: '+38645743033',
  email: 'info@arborbled.si',
  instagram: 'restavracijaarbor',
  street: 'Ljubljanska cesta 4',
  city: '4260 Bled',
  maps: 'https://www.google.com/maps/search/?api=1&query=Restavracija+Arbor+Bled%2C+Ljubljanska+cesta+4',
  menuPdf: '/meni.pdf',
  // Opening hours in minutes from midnight, Europe/Ljubljana. 0 = Sunday.
  opens: 10 * 60,
  closes: 22 * 60,
  closedDays: [0],
  seatsInside: 52,
  seatsTerrace: 55,
};

type Category = 'med' | 'slo' | 'sweet';

export interface Special {
  id: string;
  category: Category;
  price: number;
  image: ImageMetadata;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const specials: Special[] = [
  {
    id: 'golaz',
    category: 'slo',
    price: 22,
    image: golaz,
    name: { sl: 'Jelenov golaž', en: 'Venison goulash' },
    desc: { sl: 'Jelenov golaž z ocvrtki', en: 'Venison goulash with croquettes' },
  },
  {
    id: 'klobasa',
    category: 'slo',
    price: 19,
    image: klobasa,
    name: { sl: 'Kranjska klobasa', en: 'Carniolan sausage' },
    desc: { sl: 'Kranjska klobasa, česnov kruh, gorčica', en: 'Carniolan sausage, garlic bread and mustard' },
  },
  {
    id: 'ravioli',
    category: 'med',
    price: 19,
    image: ravioli,
    name: { sl: 'Ravioli', en: 'Ravioli' },
    desc: { sl: 'Domači ravioli s sirom in špinačo', en: 'Homemade ravioli with cheese and spinach' },
  },
  {
    id: 'solata',
    category: 'med',
    price: 17,
    image: solata,
    name: { sl: 'Solatni krožniki', en: 'Salad plates' },
    desc: { sl: 'Solatni krožniki s svežo sezonsko zelenjavo', en: 'Salad plates with fresh seasonal vegetables' },
  },
  {
    id: 'sufle',
    category: 'sweet',
    price: 9,
    image: sufle,
    name: { sl: 'Čokoladni sufle', en: 'Chocolate soufflé' },
    desc: { sl: 'Čokoladni sufle, sladoled', en: 'Chocolate soufflé and ice cream' },
  },
  {
    id: 'struklji',
    category: 'sweet',
    price: 9.5,
    image: struklji,
    name: { sl: 'Sladki skutni štruklji', en: 'Sweet ricotta dumplings' },
    desc: { sl: 'Skutni štruklji s sladkim prelivom', en: 'Homemade dumplings with sweet sauce' },
  },
];

export const categories: { id: Category; label: Record<Lang, string> }[] = [
  { id: 'med', label: { sl: 'Okusi Mediterana', en: 'Mediterranean flavours' } },
  { id: 'slo', label: { sl: 'Slovenska kuhinja', en: 'Slovenian cuisine' } },
  { id: 'sweet', label: { sl: 'Sladke radosti', en: 'Sweet delights' } },
];

export interface LunchDay {
  day: number;
  date: string | null;
  items: string[];
}

export const malice = maliceJson as LunchDay[];

const dayNames: Record<Lang, string[]> = {
  sl: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const dayName = (day: number, lang: Lang) => dayNames[lang][day];

export const shortDate = (iso: string | null) => {
  if (!iso) return '';
  const [, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}.`;
};

// 19 → "19 €", 17.5 → "17,50 €" (sl) / "17.50 €" (en)
export const price = (n: number, lang: Lang) =>
  `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', lang === 'sl' ? ',' : '.')} €`;

export const t = {
  sl: {
    title: 'Restavracija Arbor Bled – sveža in lokalno pridelana hrana',
    description:
      'Restavracija Arbor v samem centru Bleda: italijanska, mediteranska in domača kuhinja, dnevne malice ter pogled na jezero, otok in grad.',
    nav: { about: 'Arbor', specials: 'Specialitete', menu: 'Meni', lunch: 'Malice', contact: 'Kontakt' },
    eyebrow: 'Restavracija · Bled',
    tagline: 'Nič ne zbuja spominov bolje kot okus.',
    heroSub:
      'Italijanska, mediteranska in domača kuhinja v samem centru Bleda – s pogledom na jezero, otok in grad.',
    ctaSpecials: 'Hišne specialitete',
    ctaReserve: 'Rezervacije',
    ctaLunch: 'Dnevne malice',
    aboutTitle: 'Uživajte lokalno, uživajte sveže',
    about: [
      'Restavracija Arbor se nahaja v samem centru Bleda. V prijetnem notranjem ambientu ali na letnem vrtu lahko uživate v odlični hrani, pogledu na Blejsko jezero, otok in grad.',
      'Nudimo italijansko, mediteransko in domačo kulinariko v koraku s sodobnimi trendi prehranjevanja s poudarkom na zdravi in lahki prehrani.',
      'Restavracija je primerna za različne priložnosti, sprejme 52 gostov v notranjosti in 55 na terasi.',
    ],
    seatsInside: 'gostov v notranjosti',
    seatsTerrace: 'gostov na terasi',
    view: 'Pogled na jezero, otok in grad',
    specialsTitle: 'Hišne specialitete',
    specialsSub: 'Radost za vaša čutila.',
    menuCta: 'Oglejte si celoten meni',
    menuTitle: 'Meni',
    allergensTitle: 'Alergeni',
    allergensNote: 'Prisotnost zakonsko reguliranih alergenov v naših jedeh označujemo s spodnjimi oznakami.',
    lunchTitle: 'Malice',
    lunchNote: 'Malice strežemo od ponedeljka do petka, od 11.00 do 14.00 ure.',
    lunchHours: 'Pon–pet · 11.00–14.00',
    lunchToday: 'Danes za malico',
    lunchWeek: 'Malice ta teden',
    today: 'Danes',
    contactTitle: 'Z veseljem vas pričakujemo!',
    contactSub: 'Pokličite nas za rezervacijo mize',
    hoursLabel: 'Odpiralni čas',
    hours: 'Pon–sob · 10.00–22.00',
    sunday: 'Nedelja zaprto',
    addressLabel: 'Naslov',
    openNow: 'Odprto zdaj',
    closedNow: 'Trenutno zaprto',
    call: 'Pokliči',
    directions: 'Pot do nas',
    award: 'Restaurant Guru 2024 – med 100 najboljšimi italijanskimi restavracijami v Sloveniji',
    otherLang: 'English',
  },
  en: {
    title: 'Restaurant Arbor Bled – fresh, locally sourced food',
    description:
      'Restaurant Arbor in the heart of Bled: Italian, Mediterranean and Slovenian cuisine, daily lunch menus and a view of the lake, the island and the castle.',
    nav: { about: 'Arbor', specials: 'Specials', menu: 'Menu', lunch: 'Lunch', contact: 'Contact' },
    eyebrow: 'Restaurant · Bled',
    tagline: 'Nothing arouses memories better than taste.',
    heroSub:
      'Italian, Mediterranean and Slovenian cooking in the heart of Bled – with a view of the lake, the island and the castle.',
    ctaSpecials: 'House specials',
    ctaReserve: 'Reservations',
    ctaLunch: 'Daily lunch',
    aboutTitle: 'Eat local, eat fresh',
    about: [
      'Arbor Restaurant is located in the very heart of Bled. The interior and the terrace are vibrant and inviting, and along with a top quality meal you can take in Lake Bled, Bled Island and the Castle.',
      'We offer Italian, Mediterranean and Slovenian cuisine following contemporary trends, with an emphasis on healthy and light food.',
      'The restaurant is also suitable for larger meetings and events: it seats 52 guests inside and 55 on the terrace.',
    ],
    seatsInside: 'guests inside',
    seatsTerrace: 'guests on the terrace',
    view: 'A view of the lake, island and castle',
    specialsTitle: 'House specials',
    specialsSub: 'An absolute delight for your senses.',
    menuCta: 'See the full menu',
    menuTitle: 'Menu',
    allergensTitle: 'Allergens',
    allergensNote: 'Legally regulated allergens in our dishes are marked with the codes below.',
    lunchTitle: 'Daily lunch',
    lunchNote: 'Lunch menus are served Monday to Friday, 11:00 to 14:00. Dishes are listed in Slovenian.',
    lunchHours: 'Mon–Fri · 11:00–14:00',
    lunchToday: "Today's lunch",
    lunchWeek: "This week's lunch",
    today: 'Today',
    contactTitle: 'We would love to welcome you soon!',
    contactSub: 'Call us for table reservations',
    hoursLabel: 'Opening hours',
    hours: 'Mon–Sat · 10:00–22:00',
    sunday: 'Closed on Sunday',
    addressLabel: 'Address',
    openNow: 'Open now',
    closedNow: 'Closed right now',
    call: 'Call',
    directions: 'Directions',
    award: 'Restaurant Guru 2024 – a top 100 Italian restaurant in Slovenia',
    otherLang: 'Slovensko',
  },
} as const;

// Slovenian lives at the base path, English under en/.
export const langPath = (lang: Lang, base = '/') => (lang === 'sl' ? base : `${base}en/`);
