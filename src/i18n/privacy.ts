import type { Lang } from './index';

export const privacyPath = (lang: Lang) => lang === 'sl' ? '/politika-zasebnosti/' : `/${lang}/politika-zasebnosti/`;

export const privacy = {
  sl: {
    title: 'Politika zasebnosti',
    description: 'Informacije o obdelavi osebnih podatkov, piškotkih in vaših pravicah na spletni strani arborbled.si.',
    controller: 'Upravljavec osebnih podatkov',
    email: 'E-pošta',
    phone: 'Telefon',
    processing: 'Obdelava osebnih podatkov',
    processingText: [
      'Spletna stran arborbled.si uporablja storitve Cloudflare za gostovanje, varnost in analizo obiskanosti.',
      'Ob obisku se lahko obdelujejo tehnični podatki, kot so IP-naslov, podatki o brskalniku in čas obiska. Pravna podlaga za obdelavo, potrebno za delovanje in varnost spletne strani, je zakoniti interes upravljavca (člen 6(1)(f) GDPR).',
      'Podatki se hranijo skladno z roki hrambe ponudnika storitev Cloudflare. Pri obdelavi lahko pride do prenosa podatkov zunaj Evropskega gospodarskega prostora ob uporabi ustreznih zaščitnih ukrepov.',
    ],
    cookies: 'Piškotki',
    cookiesText: 'Spletna stran ne uporablja oglaševalskih ali analitičnih piškotkov.',
    rights: 'Pravice uporabnikov',
    rightsText: 'V skladu z GDPR imate pravico do dostopa, popravka, izbrisa in omejitve obdelave osebnih podatkov ter pravico do ugovora, kadar so za to izpolnjeni zakonski pogoji.',
    contact: 'Za vprašanja ali uveljavljanje pravic nam pišite na',
    complaint: 'Pritožbo lahko vložite pri Informacijskem pooblaščencu RS',
  },
  en: {
    title: 'Privacy policy',
    description: 'Information about personal data processing, cookies and your rights on arborbled.si.',
    controller: 'Data controller',
    email: 'Email',
    phone: 'Phone',
    processing: 'Processing of personal data',
    processingText: [
      'The website arborbled.si uses Cloudflare services for hosting, security and traffic analysis.',
      'When you visit the website, technical data such as your IP address, browser information and the time of your visit may be processed. The legal basis for processing necessary for the operation and security of the website is the legitimate interest of the controller (Article 6(1)(f) GDPR).',
      'Data is retained in accordance with the retention periods of the service provider Cloudflare. Processing may involve transfers of data outside the European Economic Area, subject to appropriate safeguards.',
    ],
    cookies: 'Cookies',
    cookiesText: 'The website does not use advertising or analytics cookies.',
    rights: 'Your rights',
    rightsText: 'Under the GDPR, you have the right to access, rectify, erase and restrict the processing of your personal data, as well as the right to object, where the statutory conditions are met.',
    contact: 'For questions or to exercise your rights, please email us at',
    complaint: 'You may lodge a complaint with the Information Commissioner of the Republic of Slovenia',
  },
  it: {
    title: 'Informativa sulla privacy',
    description: 'Informazioni sul trattamento dei dati personali, sui cookie e sui tuoi diritti su arborbled.si.',
    controller: 'Titolare del trattamento dei dati personali',
    email: 'E-mail',
    phone: 'Telefono',
    processing: 'Trattamento dei dati personali',
    processingText: [
      'Il sito arborbled.si utilizza i servizi di Cloudflare per l’hosting, la sicurezza e l’analisi del traffico.',
      'Durante la visita possono essere trattati dati tecnici, quali l’indirizzo IP, le informazioni sul browser e l’orario della visita. La base giuridica del trattamento necessario al funzionamento e alla sicurezza del sito è il legittimo interesse del titolare (articolo 6, paragrafo 1, lettera f, GDPR).',
      'I dati sono conservati secondo i periodi di conservazione del fornitore di servizi Cloudflare. Il trattamento può comportare il trasferimento dei dati al di fuori dello Spazio economico europeo, con l’applicazione di garanzie adeguate.',
    ],
    cookies: 'Cookie',
    cookiesText: 'Il sito non utilizza cookie pubblicitari o analitici.',
    rights: 'Diritti degli utenti',
    rightsText: 'Ai sensi del GDPR, hai diritto all’accesso, alla rettifica, alla cancellazione e alla limitazione del trattamento dei dati personali, nonché il diritto di opposizione, ove sussistano le condizioni previste dalla legge.',
    contact: 'Per domande o per esercitare i tuoi diritti, scrivici a',
    complaint: 'Puoi presentare un reclamo al Garante per l’informazione della Repubblica di Slovenia (Informacijski pooblaščenec RS)',
  },
  de: {
    title: 'Datenschutzerklärung',
    description: 'Informationen zur Verarbeitung personenbezogener Daten, zu Cookies und zu Ihren Rechten auf arborbled.si.',
    controller: 'Verantwortlicher für die Verarbeitung personenbezogener Daten',
    email: 'E-Mail',
    phone: 'Telefon',
    processing: 'Verarbeitung personenbezogener Daten',
    processingText: [
      'Die Website arborbled.si nutzt die Dienste von Cloudflare für Hosting, Sicherheit und Besucheranalyse.',
      'Beim Besuch können technische Daten wie die IP-Adresse, Browserinformationen und der Zeitpunkt des Besuchs verarbeitet werden. Rechtsgrundlage für die Verarbeitung, die für den Betrieb und die Sicherheit der Website erforderlich ist, ist das berechtigte Interesse des Verantwortlichen (Artikel 6 Absatz 1 Buchstabe f DSGVO).',
      'Die Daten werden entsprechend den Aufbewahrungsfristen des Dienstanbieters Cloudflare gespeichert. Bei der Verarbeitung kann es zu einer Übermittlung von Daten außerhalb des Europäischen Wirtschaftsraums kommen, wobei geeignete Schutzmaßnahmen angewendet werden.',
    ],
    cookies: 'Cookies',
    cookiesText: 'Die Website verwendet keine Werbe- oder Analyse-Cookies.',
    rights: 'Ihre Rechte',
    rightsText: 'Gemäß der DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung personenbezogener Daten sowie das Recht auf Widerspruch, sofern die gesetzlichen Voraussetzungen erfüllt sind.',
    contact: 'Bei Fragen oder zur Ausübung Ihrer Rechte schreiben Sie uns an',
    complaint: 'Sie können eine Beschwerde beim Informationsbeauftragten der Republik Slowenien (Informacijski pooblaščenec RS) einreichen',
  },
} satisfies Record<Lang, {
  title: string;
  description: string;
  controller: string;
  email: string;
  phone: string;
  processing: string;
  processingText: string[];
  cookies: string;
  cookiesText: string;
  rights: string;
  rightsText: string;
  contact: string;
  complaint: string;
}>;
