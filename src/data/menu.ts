import type { Lang } from '../i18n';

// Transcribed from public/meni.pdf. Keep in sync when the PDF changes.

type Text = Record<Lang, string>;

export const allergens = {
  V: { sl: 'primerno za vegetarijance', en: 'vegetarian', it: 'vegetariano', de: 'vegetarisch' },
  G: { sl: 'gluten', en: 'gluten', it: 'glutine', de: 'Gluten' },
  J: { sl: 'jajca', en: 'eggs', it: 'uova', de: 'Eier' },
  M: { sl: 'mleko', en: 'milk', it: 'latte', de: 'Milch' },
  R: { sl: 'ribe', en: 'fish', it: 'pesce', de: 'Fisch' },
  O: { sl: 'oreščki', en: 'nuts', it: 'frutta a guscio', de: 'Schalenfrüchte' },
  S: { sl: 'soja', en: 'soya', it: 'soia', de: 'Soja' },
  Se: { sl: 'sezam', en: 'sesame', it: 'sesamo', de: 'Sesam' },
  Go: { sl: 'gorčica', en: 'mustard', it: 'senape', de: 'Senf' },
  Ze: { sl: 'zelena', en: 'celery', it: 'sedano', de: 'Sellerie' },
  SO2: { sl: 'sulfiti', en: 'sulphites', it: 'solfiti', de: 'Sulfite' },
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
    title: { sl: 'Slovenske jedi', en: 'Slovenian dishes', it: 'Cucina slovena', de: 'Slowenische Gerichte' },
    items: [
      {
        name: {
          sl: 'Kranjska klobasa, česnov kruh, gorčica',
          en: 'Carniolan sausage, garlic bread, mustard',
          it: 'Kranjska salsiccia, pane con aglio, senape',
          de: 'Krainer Wurst, Brot mit Knoblauch, Senf',
        },
        price: 19,
        tags: ['G', 'Go', 'S'],
      },
      {
        name: {
          sl: 'Domači ravioli s sirom in špinačo',
          en: 'Homemade ravioli with cheese and spinach',
          it: 'Ravioli con ricotta e spinaci fatti in casa',
          de: 'Hausgemachte Ravioli mit Käse und Spinat',
        },
        price: 19,
        tags: ['V', 'G', 'J', 'M'],
      },
      {
        name: {
          sl: 'Skutni štruklji',
          en: 'Cottage cheese rolls',
          it: 'Struccoli di ricotta',
          de: 'Topfen-Štruklji',
        },
        price: 14,
        tags: ['V', 'G', 'J', 'M'],
      },
      {
        name: {
          sl: 'Skutni štruklji z jurčki',
          en: 'Cottage cheese rolls with porcini',
          it: 'Struccoli di ricotta con funghi porcini',
          de: 'Topfen-Štruklji mit Steinpilzen',
        },
        price: 18,
        tags: ['V', 'G', 'J', 'M', 'Ze'],
      },
      {
        name: {
          sl: 'Polenta z jurčki',
          en: 'Polenta with porcini',
          it: 'Polenta con funghi porcini',
          de: 'Polenta mit Steinpilzen',
        },
        price: 17.5,
        tags: ['V', 'G', 'Ze'],
      },
      {
        name: {
          sl: 'Jelenov golaž z ocvrtki',
          en: 'Venison goulash with croquettes',
          it: 'Gulasch di cervo con crocchette',
          de: 'Hirschgulasch mit Kroketten',
        },
        price: 22,
        tags: ['G', 'J', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Predjedi', en: 'Appetizers', it: 'Antipasti', de: 'Vorspeisen' },
    items: [
      {
        name: { sl: 'Goveji carpaccio', en: 'Beef carpaccio', it: 'Carpaccio di manzo', de: 'Rind-Carpaccio' },
        price: 18,
      },
      {
        name: {
          sl: 'Pršut z olivami',
          en: 'Smoked ham with olives',
          it: 'Prosciutto crudo con olive',
          de: 'Prosciutto mit Oliven',
        },
        price: 18,
        tags: ['M', 'SO2'],
      },
      {
        name: {
          sl: 'Omleta (šunka, sir, gobe)',
          en: 'Omelette (ham, cheese, mushrooms)',
          it: 'Frittatina (prosciutto, formaggio, funghi)',
          de: 'Omelette (Schinken, Käse, Pilze)',
        },
        price: 14,
        tags: ['J', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Juhe', en: 'Soups', it: 'Brodi e zuppe', de: 'Suppen' },
    items: [
      {
        name: {
          sl: 'Goveja juha z rezanci',
          en: 'Beef soup with noodles',
          it: 'Brodo con vermicelli',
          de: 'Rindsuppe mit Nudeln',
        },
        price: 6,
        tags: ['G', 'J', 'Ze'],
      },
      {
        name: { sl: 'Paradižnikova juha', en: 'Tomato soup', it: 'Zuppa di pomodoro', de: 'Tomatensuppe' },
        price: 6,
        tags: ['V'],
      },
      {
        name: { sl: 'Jurčkova juha', en: 'Porcini soup', it: 'Zuppa di porcini', de: 'Steinpilzsuppe' },
        price: 7.5,
        tags: ['Go', 'Ze'],
      },
      {
        name: {
          sl: 'Francoska čebulna juha',
          en: 'French onion soup',
          it: 'Zuppa di cipolla alla francese',
          de: 'Französische Zwiebelsuppe',
        },
        price: 7.5,
        tags: ['G', 'J', 'Ze'],
      },
    ],
  },
  {
    title: { sl: 'Solatni krožniki', en: 'Salad plates', it: 'Insalata', de: 'Salatteller' },
    items: [
      {
        name: { sl: 'Piščanec', en: 'Chicken', it: 'Pollo', de: 'Huhn' },
        desc: {
          sl: 'Listnata solata, paprika, češnjev paradižnik, piščanec, avokado, parmezan',
          en: 'Lettuce, peppers, cherry tomatoes, chicken fillet, avocado, Grana Padano cheese',
          it: 'Lattuga, peperoni, pomodorini, pollo, avocado, parmigiano',
          de: 'Blattsalat, Paprika, Kirschtomaten, Hähnchen, Avocado, Parmesan',
        },
        price: 17,
        tags: ['M'],
      },
      {
        name: { sl: 'Avokado', en: 'Avocado', it: 'Avocado', de: 'Avocado' },
        desc: {
          sl: 'Listnata solata, češnjev paradižnik, rdeča čebula, feta sir, avokado, granatno jabolko',
          en: 'Lettuce, cherry tomatoes, red onion, feta cheese, avocado, pomegranate',
          it: 'Lattuga, pomodorini, cipolla rossa, formaggio feta, avocado, melograno',
          de: 'Blattsalat, Kirschtomaten, rote Zwiebel, Feta-Käse, Avocado, Granatapfel',
        },
        price: 17,
        tags: ['V', 'M'],
      },
      {
        name: { sl: 'Solata Pajk', en: 'Pajk salad', it: 'Insalata Pajk', de: 'Pajk-Salat' },
        desc: {
          sl: 'Listnata solata, bučke na žaru, mocarela, češnjev paradižnik, kruhove kocke',
          en: 'Lettuce, cherry tomatoes, grilled zucchini, mozzarella, croutons',
          it: 'Lattuga, zucchini alla griglia, mozzarella, pomodorini, crostini',
          de: 'Blattsalat, Kirschtomaten, Zucchini am Rost, Mozzarella, Croutons',
        },
        price: 18,
        tags: ['G', 'M'],
      },
    ],
  },
  {
    title: { sl: 'Testenine', en: 'Pasta', it: 'Pasta', de: 'Teigwaren' },
    items: [
      {
        name: {
          sl: 'Rezanci z jurčki',
          en: 'Porcini noodles',
          it: 'Tagliatelle con funghi porcini',
          de: 'Nudeln mit Steinpilzen',
        },
        price: 18.5,
        tags: ['V', 'G', 'J', 'Ze', 'M', 'Go'],
      },
      {
        name: {
          sl: 'Njoki bolognese',
          en: 'Gnocchi bolognese',
          it: 'Gnocchi bolognese',
          de: 'Gnocchi bolognese',
        },
        price: 17,
        tags: ['G', 'J', 'M', 'Ze'],
      },
      {
        name: {
          sl: 'Istrski fuži s panceto in jurčki',
          en: 'Istrian fusi with bacon and porcini',
          it: 'Fusi con pancetta e funghi porcini',
          de: 'Fuži mit Speck und Steinpilzen',
        },
        price: 20,
        tags: ['G', 'J', 'M', 'Ze', 'S'],
        wait: true,
      },
      {
        name: {
          sl: 'Bavette bolognese',
          en: 'Bavette bolognese',
          it: 'Bavette bolognese',
          de: 'Bavette bolognese',
        },
        price: 17,
        tags: ['G', 'Ze', 'J'],
      },
      {
        name: {
          sl: 'Bavette carbonara',
          en: 'Bavette carbonara',
          it: 'Bavette carbonara',
          de: 'Bavette carbonara',
        },
        price: 17,
        tags: ['G', 'J', 'M'],
      },
      {
        name: {
          sl: 'Bavette aglio e olio',
          en: 'Bavette aglio e olio',
          it: 'Bavette aglio e olio',
          de: 'Bavette aglio e olio',
        },
        price: 16,
        tags: ['G'],
      },
      {
        name: {
          sl: 'Bavette s paradižnikovo omako',
          en: 'Bavette with tomato sauce',
          it: 'Bavette con salsa di pomodoro',
          de: 'Bavette mit Tomatensoße',
        },
        price: 16,
        tags: ['G'],
      },
    ],
  },
  {
    title: { sl: 'Rižote', en: 'Risotto', it: 'Risotti', de: 'Risotto' },
    items: [
      {
        name: {
          sl: 'Rižota z jurčki',
          en: 'Porcini risotto',
          it: 'Risotto con funghi porcini',
          de: 'Risotto mit Steinpilzen',
        },
        price: 19.5,
        tags: ['V', 'Ze', 'M'],
      },
      {
        name: {
          sl: 'Rižota z gamberi',
          en: 'Risotto with prawns',
          it: 'Risotto con gamberi',
          de: 'Risotto mit Garnelen',
        },
        price: 23,
        tags: ['R', 'M'],
      },
      {
        name: { sl: 'Rižota Paula', en: 'Risotto Paula', it: 'Risotto Paula', de: 'Risotto Paula' },
        desc: { sl: 'Zelenjava, piščanec', en: 'Vegetables, chicken', it: 'Verdura e pollo', de: 'Gemüse, Hähnchen' },
        price: 19.5,
        tags: ['M', 'Ze'],
      },
    ],
  },
  {
    title: { sl: 'Mesne jedi', en: 'Meat', it: 'Carne', de: 'Fleisch' },
    items: [
      {
        name: {
          sl: 'Ramstek na žaru, sotirana zelenjava, krompirček',
          en: 'Grilled rump steak, sautéed vegetables, potatoes',
          it: 'Bistecca alla griglia, verdure sauté, patate',
          de: 'Rumpsteak vom Grill, gebratenes Gemüse, Kartoffeln',
        },
        price: 31,
        tags: ['Go'],
      },
      {
        name: {
          sl: 'Ramstek z jurčki, krompirček',
          en: 'Rump steak with porcini, potatoes',
          it: 'Bistecca con funghi porcini, patate',
          de: 'Rumpsteak mit Steinpilzen, Kartoffeln',
        },
        price: 32,
        tags: ['Go', 'M', 'Ze', 'G'],
      },
      {
        name: {
          sl: 'Piščančji file na žaru, sotirana zelenjava, krompirček',
          en: 'Grilled chicken fillet, sautéed vegetables, potatoes',
          it: 'Filetto di pollo alla griglia, verdure sauté e patate',
          de: 'Hühnerfilet vom Grill, gebratenes Gemüse, Kartoffeln',
        },
        price: 20,
      },
      {
        name: {
          sl: 'Svinjski medaljoni z jurčki, krompirček',
          en: 'Pork tenderloin with porcini and potatoes',
          it: 'Filetto di maiale con funghi porcini e patate',
          de: 'Schweinemedaillons mit Steinpilzen und Kartoffeln',
        },
        price: 24,
        tags: ['G', 'Ze', 'M', 'Go'],
      },
      {
        name: {
          sl: 'Svinjski / piščančji zrezek po dunajsko, pomfrit',
          en: 'Vienna style pork or chicken cutlet, French fries',
          it: 'Costoletta alla milanese con patate fritte',
          de: 'Wiener Schnitzel (Schwein oder Huhn) mit Pommes frites',
        },
        price: 19,
        tags: ['G', 'J'],
      },
    ],
  },
  {
    title: { sl: 'Ribe', en: 'Fish', it: 'Pesce', de: 'Fisch' },
    items: [
      {
        name: {
          sl: 'File postrvi s sotirano zelenjavo',
          en: 'Trout fillet with sautéed vegetables',
          it: 'Filetto di trota con verdure sauté',
          de: 'Forellenfilet mit gebratenem Gemüse',
        },
        price: 28,
        tags: ['R', 'M'],
      },
    ],
  },
  {
    title: {
      sl: 'Burger & pomfrit',
      en: 'Burger & French fries',
      it: 'Burger & patate fritte',
      de: 'Burger & Pommes frites',
    },
    items: [
      {
        name: { sl: 'Goveji burger', en: 'Beef burger', it: 'Burger di manzo', de: 'Burger vom Rind' },
        desc: {
          sl: 'Solata, paradižnik, čebula, sir',
          en: 'Lettuce, tomato, onion, cheese',
          it: 'Foglia di lattuga, pomodoro, cipolla, formaggio',
          de: 'Blattsalat, Tomaten, Zwiebel, Käse',
        },
        price: 16,
        tags: ['G', 'J', 'M', 'Se', 'Go', 'O', 'Ze', 'S'],
      },
      {
        name: { sl: 'Piščančji burger', en: 'Chicken burger', it: 'Burger di pollo', de: 'Burger vom Huhn' },
        desc: {
          sl: 'Solata, paradižnik, kumara, rdeče zelje',
          en: 'Lettuce, tomato, cucumber, red cabbage',
          it: 'Foglia di lattuga, pomodoro, cetriolo, cavolo rosso',
          de: 'Blattsalat, Tomaten, Gurke, Rotkohl',
        },
        price: 16,
        tags: ['G', 'J', 'Se', 'Go', 'M', 'O', 'Ze'],
      },
      {
        name: {
          sl: 'Vegetarijanski burger',
          en: 'Veggie burger',
          it: 'Burger vegetariano',
          de: 'Veggie-Burger',
        },
        desc: {
          sl: 'Ocvrta mozzarella, avokado, solata, paradižnik, čebula, rdeče zelje',
          en: 'Fried mozzarella cheese, avocado, lettuce, tomato, onion, red cabbage',
          it: 'Mozzarella fritta, foglia di lattuga, pomodoro, avocado, cipolla, cavolo rosso',
          de: 'Gebackener Mozzarella, Avocado, Blattsalat, Tomaten, Zwiebel, Rotkohl',
        },
        price: 16,
        tags: ['V', 'G', 'J', 'M', 'Se', 'O', 'Ze', 'Go'],
      },
    ],
  },
  {
    title: { sl: 'Priloge', en: 'Side dishes', it: 'Contorni', de: 'Beilagen' },
    items: [
      { name: { sl: 'Pomfrit', en: 'French fries', it: 'Patate fritte', de: 'Pommes frites' }, price: 5.5 },
      {
        name: { sl: 'Pečen krompir', en: 'Fried potatoes', it: 'Patate arrosto', de: 'Gebratene Kartoffeln' },
        price: 5.5,
      },
      { name: { sl: 'Riž', en: 'Rice', it: 'Riso', de: 'Reis' }, price: 5.5 },
      {
        name: { sl: 'Solata iz bifeja', en: 'Buffet salad', it: 'Buffet di insalate', de: 'Buffetsalat' },
        price: 7.5,
      },
      {
        name: {
          sl: 'Štručka s česnom',
          en: 'Loaf of garlic bread',
          it: 'Pane del forno con aglio',
          de: 'Brot aus dem Steinofen mit Knoblauch',
        },
        price: 3.5,
        tags: ['G'],
      },
      { name: { sl: 'Kruh', en: 'Bread', it: 'Pane', de: 'Brot' }, price: 3, tags: ['G'] },
    ],
  },
  {
    title: { sl: 'Hišne sladice', en: 'Homemade desserts', it: 'Dolci fatti in casa', de: 'Hausgemachte Nachspeisen' },
    items: [
      {
        name: {
          sl: 'Sladki skutni štruklji',
          en: 'Sweet cottage cheese rolls',
          it: 'Struccoli di ricotta dolci',
          de: 'Süße Topfen-Štruklji',
        },
        price: 9.5,
        tags: ['V', 'G', 'J', 'M', 'O'],
      },
      {
        name: {
          sl: 'Čokoladni sufle, sladoled',
          en: 'Chocolate soufflé, ice cream',
          it: 'Soufflé al cioccolato, gelato',
          de: 'Schokoladensoufflé, Eis',
        },
        price: 9,
        tags: ['G', 'J', 'M', 'SO2', 'O'],
        wait: true,
      },
      {
        name: {
          sl: 'Domači vaflji',
          en: 'Homemade waffles',
          it: 'Waffle fatti in casa',
          de: 'Hausgemachte Waffeln',
        },
        desc: {
          sl: 'Z banano in Nutelo ali z javorjevim sirupom',
          en: 'With banana and Nutella or with maple syrup',
          it: "Con banana e Nutella o con sciroppo d'acero",
          de: 'Mit Banane und Nutella oder mit Ahornsirup',
        },
        price: 8,
        tags: ['V', 'G', 'J', 'M', 'O', 'S'],
      },
    ],
  },
];
