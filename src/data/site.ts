import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import { dayNames } from '../lib/content';

import arbor1 from '../assets/photos/arbor1.jpg';
import arbor2 from '../assets/photos/arbor2.jpg';
import arbor3 from '../assets/photos/arbor3.jpg';
import golaz from '../assets/photos/golaz3-1.jpg';
import solata from '../assets/photos/solata3.jpg';
import ravioli from '../assets/photos/ravioli4.jpg';
import klobasa from '../assets/photos/kranjska-klobasa-3.jpg';
import sufle from '../assets/photos/sufle4.jpg';
import struklji from '../assets/photos/skutini-struklji-3.jpg';
import logo from '../assets/brand/logo.png';
import eatLocal from '../assets/brand/eat-local.png';

export const images = { arbor1, arbor2, arbor3, golaz, solata, ravioli, klobasa, sufle, struklji, logo, eatLocal };

export const contact = {
  name: 'Restavracija Arbor Bled',
  phone: '+386 (0)4 57 43 033',
  tel: '+38645743033',
  email: 'info@arborbled.si',
  instagram: 'restavracijaarbor',
  street: 'Ljubljanska cesta 4',
  postalCode: '4260',
  locality: 'Bled',
  city: '4260 Bled',
  maps: 'https://www.google.com/maps/search/?api=1&query=Restavracija+Arbor+Bled%2C+Ljubljanska+cesta+4',
  menuPdf: '/meni.pdf',
  seatsInside: 52,
  seatsTerrace: 55,
};

export interface Special {
  id: string;
  price: number;
  image: ImageMetadata;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const specials: Special[] = [
  {
    id: 'golaz',
    price: 22,
    image: golaz,
    name: {
      sl: 'Jelenov golaž',
      en: 'Venison goulash',
      it: 'Gulasch di cervo',
      de: 'Hirschgulasch',
    },
    desc: {
      sl: 'Jelenov golaž z ocvrtki',
      en: 'Venison goulash with croquettes',
      it: 'Gulasch di cervo con crocchette',
      de: 'Hirschgulasch mit Kroketten',
    },
  },
  {
    id: 'klobasa',
    price: 19,
    image: klobasa,
    name: {
      sl: 'Kranjska klobasa',
      en: 'Carniolan sausage',
      it: 'Kranjska salsiccia',
      de: 'Krainer Wurst',
    },
    desc: {
      sl: 'Kranjska klobasa, česnov kruh, gorčica',
      en: 'Carniolan sausage, garlic bread and mustard',
      it: 'Kranjska salsiccia, pane con aglio e senape',
      de: 'Krainer Wurst, Brot mit Knoblauch und Senf',
    },
  },
  {
    id: 'ravioli',
    price: 19,
    image: ravioli,
    name: {
      sl: 'Ravioli',
      en: 'Ravioli',
      it: 'Ravioli',
      de: 'Ravioli',
    },
    desc: {
      sl: 'Domači ravioli s sirom in špinačo',
      en: 'Homemade ravioli with cheese and spinach',
      it: 'Ravioli con ricotta e spinaci fatti in casa',
      de: 'Hausgemachte Ravioli mit Käse und Spinat',
    },
  },
  {
    id: 'solata',
    price: 17,
    image: solata,
    name: {
      sl: 'Solatni krožniki',
      en: 'Salad plates',
      it: 'Insalate',
      de: 'Salatteller',
    },
    desc: {
      sl: 'Solatni krožniki s svežo sezonsko zelenjavo',
      en: 'Salad plates with fresh seasonal vegetables',
      it: 'Insalate con verdure fresche di stagione',
      de: 'Salatteller mit frischem Saisongemüse',
    },
  },
  {
    id: 'sufle',
    price: 9,
    image: sufle,
    name: {
      sl: 'Čokoladni sufle',
      en: 'Chocolate soufflé',
      it: 'Soufflé al cioccolato',
      de: 'Schokoladensoufflé',
    },
    desc: {
      sl: 'Čokoladni sufle, sladoled',
      en: 'Chocolate soufflé and ice cream',
      it: 'Soufflé al cioccolato con gelato',
      de: 'Schokoladensoufflé mit Eis',
    },
  },
  {
    id: 'struklji',
    price: 9.5,
    image: struklji,
    name: {
      sl: 'Sladki skutni štruklji',
      en: 'Sweet ricotta dumplings',
      it: 'Struccoli di ricotta dolci',
      de: 'Süße Topfen-Štruklji',
    },
    desc: {
      sl: 'Skutni štruklji s sladkim prelivom',
      en: 'Homemade dumplings with sweet sauce',
      it: 'Struccoli fatti in casa con salsa dolce',
      de: 'Hausgemachte Štruklji mit süßer Sauce',
    },
  },
];

export const dayName = (day: number, lang: Lang) => dayNames[lang][day];

// 19 → "19 €", 17.5 → "17.50 €" (en) / "17,50 €" (others)
export const price = (n: number, lang: Lang) =>
  `${Number.isInteger(n) ? n : n.toFixed(2).replace('.', lang === 'en' ? '.' : ',')} €`;
