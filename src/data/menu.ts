import type { Lang } from './site';

// Transcribed from public/meni.pdf. Keep in sync when the PDF changes.

type Text = Record<Lang, string>;

export const allergens = {
  V: { sl: 'primerno za vegetarijance', en: 'vegetarian' },
  G: { sl: 'gluten', en: 'gluten' },
  J: { sl: 'jajca', en: 'eggs' },
  M: { sl: 'mleko', en: 'milk' },
  R: { sl: 'ribe', en: 'fish' },
  O: { sl: 'oreščki', en: 'nuts' },
  S: { sl: 'soja', en: 'soya' },
  Se: { sl: 'sezam', en: 'sesame' },
  Go: { sl: 'gorčica', en: 'mustard' },
  Ze: { sl: 'zelena', en: 'celery' },
  SO2: { sl: 'sulfiti', en: 'sulphites' },
} satisfies Record<string, Text>;

type Tag = keyof typeof allergens;

export interface MenuItem {
  name: Text;
  desc?: Text;
  price: number;
  tags?: Tag[];
  // Prepared to order, takes about 15 minutes.
  wait?: boolean;
}

export interface MenuSection {
  title: Text;
  items: MenuItem[];
}

export const menu: MenuSection[] = [
  {
    title: { sl: 'Slovenske jedi', en: 'Slovenian dishes' },
    items: [
      {
        name: { sl: 'Kranjska klobasa, česnov kruh, gorčica', en: 'Carniolan sausage, garlic bread, mustard' },
        price: 19,
        tags: ['G', 'Go', 'S'],
      },
      {
        name: { sl: 'Domači ravioli s sirom in špinačo', en: 'Homemade ravioli with cheese and spinach' },
        price: 19,
        tags: ['V', 'G', 'J', 'M'],
      },
      {
        name: { sl: 'Skutni štruklji', en: 'Cottage cheese rolls' },
        price: 14,
        tags: ['V', 'G', 'J', 'M'],
      },
      {
        name: { sl: 'Skutni štruklji z jurčki', en: 'Cottage cheese rolls with porcini' },
        price: 18,
        tags: ['V', 'G', 'J', 'M', 'Ze'],
      },
      {
        name: { sl: 'Polenta z jurčki', en: 'Polenta with porcini' },
        price: 17.5,
        tags: ['V', 'G', 'Ze'],
      },
      {
        name: { sl: 'Jelenov golaž z ocvrtki', en: 'Venison goulash with croquettes' },
        price: 22,
        tags: ['G', 'J', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Predjedi', en: 'Appetizers' },
    items: [
      { name: { sl: 'Goveji carpaccio', en: 'Beef carpaccio' }, price: 18 },
      {
        name: { sl: 'Pršut z olivami', en: 'Smoked ham with olives' },
        price: 18,
        tags: ['M', 'SO2'],
      },
      {
        name: { sl: 'Omleta (šunka, sir, gobe)', en: 'Omelette (ham, cheese, mushrooms)' },
        price: 14,
        tags: ['J', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Juhe', en: 'Soups' },
    items: [
      {
        name: { sl: 'Goveja juha z rezanci', en: 'Beef soup with noodles' },
        price: 6,
        tags: ['G', 'J', 'Ze'],
      },
      { name: { sl: 'Paradižnikova juha', en: 'Tomato soup' }, price: 6, tags: ['V'] },
      { name: { sl: 'Jurčkova juha', en: 'Porcini soup' }, price: 7.5, tags: ['Go', 'Ze'] },
      {
        name: { sl: 'Francoska čebulna juha', en: 'French onion soup' },
        price: 7.5,
        tags: ['G', 'J', 'Ze'],
      },
    ],
  },
  {
    title: { sl: 'Solatni krožniki', en: 'Salad plates' },
    items: [
      {
        name: { sl: 'Piščanec', en: 'Chicken' },
        desc: {
          sl: 'Listnata solata, paprika, češnjev paradižnik, piščanec, avokado, parmezan',
          en: 'Lettuce, peppers, cherry tomatoes, chicken fillet, avocado, Grana Padano cheese',
        },
        price: 17,
        tags: ['M'],
      },
      {
        name: { sl: 'Avokado', en: 'Avocado' },
        desc: {
          sl: 'Listnata solata, češnjev paradižnik, rdeča čebula, feta sir, avokado, granatno jabolko',
          en: 'Lettuce, cherry tomatoes, red onion, feta cheese, avocado, pomegranate',
        },
        price: 17,
        tags: ['V', 'M'],
      },
      {
        name: { sl: 'Solata Pajk', en: 'Pajk salad' },
        desc: {
          sl: 'Listnata solata, bučke na žaru, mocarela, češnjev paradižnik, kruhove kocke',
          en: 'Lettuce, cherry tomatoes, grilled zucchini, mozzarella, croutons',
        },
        price: 18,
        tags: ['G', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Testenine', en: 'Pasta' },
    items: [
      {
        name: { sl: 'Rezanci z jurčki', en: 'Porcini noodles' },
        price: 18.5,
        tags: ['V', 'G', 'J', 'Ze', 'M', 'Go'],
      },
      {
        name: { sl: 'Njoki bolognese', en: 'Gnocchi bolognese' },
        price: 17,
        tags: ['G', 'J', 'M', 'Ze'],
      },
      {
        name: { sl: 'Istrski fuži s panceto in jurčki', en: 'Istrian fusi with bacon and porcini' },
        price: 20,
        tags: ['G', 'J', 'M', 'Ze', 'S'],
        wait: true,
      },
      { name: { sl: 'Bavette bolognese', en: 'Bavette bolognese' }, price: 17, tags: ['G', 'Ze', 'J'] },
      { name: { sl: 'Bavette carbonara', en: 'Bavette carbonara' }, price: 17, tags: ['G', 'J', 'M'] },
      { name: { sl: 'Bavette aglio e olio', en: 'Bavette aglio e olio' }, price: 16, tags: ['G'] },
      {
        name: { sl: 'Bavette s paradižnikovo omako', en: 'Bavette with tomato sauce' },
        price: 16,
        tags: ['G'],
      },
    ],
  },
  {
    title: { sl: 'Rižote', en: 'Risotto' },
    items: [
      {
        name: { sl: 'Rižota z jurčki', en: 'Porcini risotto' },
        price: 19.5,
        tags: ['V', 'Ze', 'M'],
      },
      { name: { sl: 'Rižota z gamberi', en: 'Risotto with prawns' }, price: 23, tags: ['R', 'M'] },
      {
        name: { sl: 'Rižota Paula', en: 'Risotto Paula' },
        desc: { sl: 'Zelenjava, piščanec', en: 'Vegetables, chicken' },
        price: 19.5,
        tags: ['M', 'Ze'],
      },
    ],
  },
  {
    title: { sl: 'Mesne jedi', en: 'Meat' },
    items: [
      {
        name: {
          sl: 'Ramstek na žaru, sotirana zelenjava, krompirček',
          en: 'Grilled rump steak, sautéed vegetables, potatoes',
        },
        price: 31,
        tags: ['Go'],
      },
      {
        name: { sl: 'Ramstek z jurčki, krompirček', en: 'Rump steak with porcini, potatoes' },
        price: 32,
        tags: ['Go', 'M', 'Ze', 'G'],
      },
      {
        name: {
          sl: 'Piščančji file na žaru, sotirana zelenjava, krompirček',
          en: 'Grilled chicken fillet, sautéed vegetables, potatoes',
        },
        price: 20,
      },
      {
        name: {
          sl: 'Svinjski medaljoni z jurčki, krompirček',
          en: 'Pork tenderloin with porcini and potatoes',
        },
        price: 24,
        tags: ['G', 'Ze', 'M', 'Go'],
      },
      {
        name: {
          sl: 'Svinjski / piščančji zrezek po dunajsko, pomfrit',
          en: 'Vienna style pork or chicken cutlet, French fries',
        },
        price: 19,
        tags: ['G', 'J'],
      },
    ],
  },
  {
    title: { sl: 'Ribe', en: 'Fish' },
    items: [
      {
        name: { sl: 'File postrvi s sotirano zelenjavo', en: 'Trout fillet with sautéed vegetables' },
        price: 28,
        tags: ['R', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Burger & pomfrit', en: 'Burger & French fries' },
    items: [
      {
        name: { sl: 'Goveji burger', en: 'Beef burger' },
        desc: { sl: 'Solata, paradižnik, čebula, sir', en: 'Lettuce, tomato, onion, cheese' },
        price: 16,
        tags: ['G', 'J', 'M', 'Se', 'Go', 'O', 'Ze', 'S'],
      },
      {
        name: { sl: 'Piščančji burger', en: 'Chicken burger' },
        desc: {
          sl: 'Solata, paradižnik, kumara, rdeče zelje',
          en: 'Lettuce, tomato, cucumber, red cabbage',
        },
        price: 16,
        tags: ['G', 'J', 'Se', 'Go', 'M', 'O', 'Ze'],
      },
      {
        name: { sl: 'Vegetarijanski burger', en: 'Veggie burger' },
        desc: {
          sl: 'Ocvrta mozzarella, avokado, solata, paradižnik, čebula, rdeče zelje',
          en: 'Fried mozzarella cheese, avocado, lettuce, tomato, onion, red cabbage',
        },
        price: 16,
        tags: ['V', 'G', 'J', 'M', 'Se', 'O', 'Ze', 'Go'],
      },
    ],
  },
  {
    title: { sl: 'Priloge', en: 'Side dishes' },
    items: [
      { name: { sl: 'Pomfrit', en: 'French fries' }, price: 5.5 },
      { name: { sl: 'Pečen krompir', en: 'Fried potatoes' }, price: 5.5 },
      { name: { sl: 'Riž', en: 'Rice' }, price: 5.5 },
      { name: { sl: 'Solata iz bifeja', en: 'Buffet salad' }, price: 7.5 },
      { name: { sl: 'Štručka s česnom', en: 'Loaf of garlic bread' }, price: 3.5, tags: ['G'] },
      { name: { sl: 'Kruh', en: 'Bread' }, price: 3, tags: ['G'] },
    ],
  },
  {
    title: { sl: 'Hišne sladice', en: 'Homemade desserts' },
    items: [
      {
        name: { sl: 'Sladki skutni štruklji', en: 'Sweet cottage cheese rolls' },
        price: 9.5,
        tags: ['V', 'G', 'J', 'M', 'O'],
      },
      {
        name: { sl: 'Čokoladni sufle, sladoled', en: 'Chocolate soufflé, ice cream' },
        price: 9,
        tags: ['G', 'J', 'M', 'SO2', 'O'],
        wait: true,
      },
      {
        name: { sl: 'Domači vaflji', en: 'Homemade waffles' },
        desc: {
          sl: 'Z banano in Nutelo ali z javorjevim sirupom',
          en: 'With banana and Nutella or with maple syrup',
        },
        price: 8,
        tags: ['V', 'G', 'J', 'M', 'O', 'S'],
      },
    ],
  },
];
