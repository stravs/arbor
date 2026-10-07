import type { ImageMetadata } from 'astro';
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

export type Lang = 'sl' | 'en' | 'it' | 'de';
export const langs: Lang[] = ['sl', 'en', 'it', 'de'];
export const langNames: Record<Lang, string> = { sl: 'Slovensko', en: 'English', it: 'Italiano', de: 'Deutsch' };

export const images = { arbor1, arbor2, arbor3, golaz, solata, ravioli, klobasa, sufle, struklji, logo, eatLocal };

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

export const t = {
  sl: {
    title: 'Restavracija Arbor Bled – sveža in lokalno pridelana hrana',
    description:
      'Restavracija Arbor v samem centru Bleda: italijanska, mediteranska in domača kuhinja, dnevne malice ter pogled na jezero, otok in grad.',
    nav: { about: 'Arbor', specials: 'Specialitete', menu: 'Meni', lunch: 'Malice', contact: 'Kontakt' },
    tagline: 'Nič ne zbuja spominov bolje kot okus.',
    heroSub:
      'Italijanska, mediteranska in domača kuhinja v samem centru Bleda – s pogledom na jezero, otok in grad.',
    ctaSpecials: 'Hišne specialitete',
    aboutTitle: 'Uživajte lokalno, uživajte sveže',
    about: [
      'Restavracija Arbor se nahaja v samem centru Bleda. V prijetnem notranjem ambientu ali na terasi lahko uživate v odlični hrani, pogledu na Blejsko jezero, otok in grad.',
      'Nudimo italijansko, mediteransko in domačo kulinariko v koraku s sodobnimi trendi prehranjevanja s poudarkom na zdravi in lahki prehrani.',
      'Restavracija je primerna za različne priložnosti, sprejme 52 gostov v notranjosti in 55 na terasi.',
    ],
    seatsInside: 'gostov v notranjosti',
    seatsTerrace: 'gostov na terasi',
    specialsTitle: 'Hišne specialitete',
    specialsSub: 'Radost za vaša čutila.',
    menuCta: 'Oglejte si celoten meni',
    menuTitle: 'Meni',
    allergensTitle: 'Alergeni',
    allergensNote: 'Prisotnost zakonsko reguliranih alergenov v naših jedeh označujemo s spodnjimi oznakami.',
    lunchHours: 'Pon–pet · 11.00–14.00',
    lunchToday: 'Danes za malico',
    lunchWeek: 'Malice ta teden',
    today: 'Danes',
    contactTitle: 'Z veseljem vas pričakujemo!',
    contactSub: 'Pokličite nas za rezervacijo mize',
    hoursLabel: 'Odpiralni čas',
    addressLabel: 'Naslov',
    openNow: 'Odprto zdaj',
    closedNow: 'Trenutno zaprto',
    directions: 'Pot do nas',
    award: 'Restaurant Guru 2024 – med 100 najboljšimi italijanskimi restavracijami v Sloveniji',
  },
  en: {
    title: 'Restaurant Arbor Bled – fresh, locally sourced food',
    description:
      'Restaurant Arbor in the heart of Bled: Italian, Mediterranean and Slovenian cuisine, daily lunch menus and a view of the lake, the island and the castle.',
    nav: { about: 'Arbor', specials: 'Specials', menu: 'Menu', lunch: 'Lunch', contact: 'Contact' },
    tagline: 'Nothing arouses memories better than taste.',
    heroSub:
      'Italian, Mediterranean and Slovenian cooking in the heart of Bled – with a view of the lake, the island and the castle.',
    ctaSpecials: 'House specials',
    aboutTitle: 'Eat local, eat fresh',
    about: [
      'Arbor Restaurant is located in the very heart of Bled. The interior and the terrace are vibrant and inviting, and along with a top quality meal you can take in Lake Bled, Bled Island and the Castle.',
      'We offer Italian, Mediterranean and Slovenian cuisine following contemporary trends, with an emphasis on healthy and light food.',
      'The restaurant is also suitable for larger meetings and events: it seats 52 guests inside and 55 on the terrace.',
    ],
    seatsInside: 'guests inside',
    seatsTerrace: 'guests on the terrace',
    specialsTitle: 'House specials',
    specialsSub: 'An absolute delight for your senses.',
    menuCta: 'See the full menu',
    menuTitle: 'Menu',
    allergensTitle: 'Allergens',
    allergensNote: 'Legally regulated allergens in our dishes are marked with the codes below.',
    lunchHours: 'Mon–Fri · 11:00–14:00',
    lunchToday: "Today's lunch",
    lunchWeek: "This week's lunch",
    today: 'Today',
    contactTitle: 'We would love to welcome you soon!',
    contactSub: 'Call us for table reservations',
    hoursLabel: 'Opening hours',
    addressLabel: 'Address',
    openNow: 'Open now',
    closedNow: 'Closed right now',
    directions: 'Directions',
    award: 'Restaurant Guru 2024 – a top 100 Italian restaurant in Slovenia',
  },
  it: {
    title: 'Ristorante Arbor Bled – cucina fresca e locale',
    description:
      "Ristorante Arbor nel cuore di Bled: cucina italiana, mediterranea e slovena, menù del giorno a pranzo e vista sul lago, sull'isola e sul castello.",
    nav: { about: 'Arbor', specials: 'Specialità', menu: 'Menù', lunch: 'Pranzo', contact: 'Contatti' },
    tagline: 'Niente risveglia i ricordi meglio del gusto.',
    heroSub:
      "Cucina italiana, mediterranea e slovena nel cuore di Bled – con vista sul lago, sull'isola e sul castello.",
    ctaSpecials: 'Specialità della casa',
    aboutTitle: 'Mangia locale, mangia fresco',
    about: [
      "Il ristorante Arbor si trova nel cuore di Bled. Nell'accogliente sala interna o in terrazza potete gustare ottimi piatti con vista sul lago di Bled, sull'isola e sul castello.",
      'Proponiamo cucina italiana, mediterranea e slovena al passo con le tendenze contemporanee, con particolare attenzione a piatti sani e leggeri.',
      "Il ristorante è adatto a diverse occasioni: accoglie 52 ospiti all'interno e 55 in terrazza.",
    ],
    seatsInside: "ospiti all'interno",
    seatsTerrace: 'ospiti in terrazza',
    specialsTitle: 'Specialità della casa',
    specialsSub: 'Una delizia per i vostri sensi.',
    menuCta: 'Scopri il menù completo',
    menuTitle: 'Menù',
    allergensTitle: 'Allergeni',
    allergensNote: 'La presenza degli allergeni regolamentati per legge nei nostri piatti è indicata con le sigle qui sotto.',
    lunchHours: 'Lun–ven · 11.00–14.00',
    lunchToday: 'Oggi a pranzo',
    lunchWeek: 'I pranzi della settimana',
    today: 'Oggi',
    contactTitle: 'Vi aspettiamo con piacere!',
    contactSub: 'Chiamateci per prenotare un tavolo',
    hoursLabel: 'Orari di apertura',
    addressLabel: 'Indirizzo',
    openNow: 'Aperto ora',
    closedNow: 'Chiuso al momento',
    directions: 'Come arrivare',
    award: 'Restaurant Guru 2024 – tra i 100 migliori ristoranti italiani in Slovenia',
  },
  de: {
    title: 'Restaurant Arbor Bled – frische, regionale Küche',
    description:
      'Restaurant Arbor im Herzen von Bled: italienische, mediterrane und slowenische Küche, täglich wechselnde Mittagsmenüs und Blick auf den See, die Insel und die Burg.',
    nav: { about: 'Arbor', specials: 'Spezialitäten', menu: 'Speisekarte', lunch: 'Mittagsmenü', contact: 'Kontakt' },
    tagline: 'Nichts weckt Erinnerungen so sehr wie Geschmack.',
    heroSub:
      'Italienische, mediterrane und slowenische Küche im Herzen von Bled – mit Blick auf den See, die Insel und die Burg.',
    ctaSpecials: 'Spezialitäten des Hauses',
    aboutTitle: 'Regional genießen, frisch genießen',
    about: [
      'Das Restaurant Arbor liegt mitten im Zentrum von Bled. Im gemütlichen Innenraum oder auf der Terrasse genießen Sie hervorragendes Essen und den Blick auf den Bleder See, die Insel und die Burg.',
      'Wir bieten italienische, mediterrane und slowenische Küche im Einklang mit modernen Ernährungstrends, mit Schwerpunkt auf gesunden und leichten Gerichten.',
      'Das Restaurant eignet sich für verschiedene Anlässe und bietet Platz für 52 Gäste im Innenbereich und 55 auf der Terrasse.',
    ],
    seatsInside: 'Gäste im Innenbereich',
    seatsTerrace: 'Gäste auf der Terrasse',
    specialsTitle: 'Spezialitäten des Hauses',
    specialsSub: 'Ein Genuss für alle Sinne.',
    menuCta: 'Zur ganzen Speisekarte',
    menuTitle: 'Speisekarte',
    allergensTitle: 'Allergene',
    allergensNote: 'Gesetzlich geregelte Allergene in unseren Gerichten sind mit den folgenden Kürzeln gekennzeichnet.',
    lunchHours: 'Mo–Fr · 11.00–14.00',
    lunchToday: 'Mittagsmenü heute',
    lunchWeek: 'Mittagsmenüs dieser Woche',
    today: 'Heute',
    contactTitle: 'Wir freuen uns auf Ihren Besuch!',
    contactSub: 'Rufen Sie uns für eine Tischreservierung an',
    hoursLabel: 'Öffnungszeiten',
    addressLabel: 'Adresse',
    openNow: 'Jetzt geöffnet',
    closedNow: 'Derzeit geschlossen',
    directions: 'Anfahrt',
    award: 'Restaurant Guru 2024 – unter den 100 besten italienischen Restaurants in Slowenien',
  },
} as const;

// Slovenian lives at the base path, other languages under their code.
export const langPath = (lang: Lang) => (lang === 'sl' ? '/' : `/${lang}/`);
