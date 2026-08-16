export const locales = ["fr", "en", "ln", "sw", "kg"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ln: "Lingála",
  sw: "Kiswahili",
  kg: "Kikongo",
};

// French is the app's source language — every other locale is a best-effort
// AI translation of short UI copy (nav labels, buttons, headlines). These
// have not been reviewed by native speakers and should be before shipping
// to real users, especially the longer marketing paragraphs.
const fr = {
  "nav.categories": "Catégories",
  "nav.products": "Produits",
  "nav.vendors": "Fournisseurs",
  "nav.trust": "Confiance & Sécurité",
  "header.login": "Se connecter",
  "header.becomeVendor": "Devenir Fournisseur",
  "header.dashboard": "Tableau de bord",
  "header.myAccount": "Mon compte",
  "header.signOut": "Se déconnecter",
  "header.welcome": "Bienvenue",

  "footer.copyright": "TEKA. Kinshasa, RDC.",

  "hero.title1": "Le commerce de gros,",
  "hero.titleHighlight": "enfin fiable.",
  "hero.subtitle":
    "Achetez et vendez en gros en toute confiance. Connectez-vous aux meilleurs fournisseurs de la République Démocratique du Congo.",
  "hero.statVendors": "Fournisseurs",
  "hero.statProducts": "Produits",
  "hero.statProvinces": "Provinces",
  "hero.ctaFindProducts": "Trouver des produits",
  "hero.ctaBecomeVendor": "Devenir fournisseur",

  "search.eyebrow": "Recherche rapide",
  "search.title": "Trouvez vos fournisseurs en gros",
  "search.placeholder": "Ex : ciment, riz, huile végétale…",
  "search.trust": "Vérifiés · Sécurisés · MOQ affiché",

  "card.becomeVendorLabel": "Devenir fournisseur",
  "card.becomeVendorTitle": "Vendez en gros",
  "card.escrowLabel": "Paiement séquestré",
  "card.escrowTitle": "Confiance & Sécurité",

  "categories.eyebrow": "Explorez le marché",
  "categories.title": "Catégories de produits",
  "categories.viewAll": "Tout voir",

  "featured.eyebrow": "Sélection du moment",
  "featured.title": "Produits en vedette",
  "featured.viewAll": "Voir tous les produits",

  "security.eyebrow": "Confiance & Sécurité",
  "security.title": "La sécurité avant tout",
  "security.subtitle":
    "TEKA protège l'acheteur et le fournisseur à chaque étape — c'est la base sur laquelle tout le reste repose.",
  "security.pillar1Title": "Fournisseurs vérifiés",
  "security.pillar1Desc":
    "Chaque fournisseur est contrôlé avant de rejoindre TEKA — identité, activité, historique.",
  "security.pillar2Title": "Paiement séquestré",
  "security.pillar2Desc":
    "Vos fonds sont bloqués et ne sont versés au fournisseur qu'une fois la livraison confirmée.",
  "security.pillar3Title": "Support en cas de litige",
  "security.pillar3Desc":
    "Un problème ? Notre équipe intervient pour protéger l'acheteur comme le fournisseur.",
  "security.paymentMethods": "Moyens de paiement acceptés",
  "security.howEscrowWorks": "Comment fonctionne le paiement séquestré ?",

  "vendorCta.title": "Vendez en gros sur TEKA",
  "vendorCta.subtitle":
    "Créez votre boutique gratuitement, publiez vos produits, et recevez des demandes d'acheteurs partout en RDC.",
  "vendorCta.button": "Devenir fournisseur",

  "language.label": "Langue",

  "vendorNav.menu": "Menu",
  "vendorNav.requests": "Demandes de devis",
  "vendorNav.payments": "Paiements",
  "vendorNav.settings": "Paramètres",
  "vendorNav.company": "Votre entreprise",
  "vendorNav.account": "Compte fournisseur",
  "vendorNav.collapseSidebar": "Réduire la barre latérale",
  "vendorNav.expandSidebar": "Ouvrir la barre latérale",
} as const;

export type TranslationKey = keyof typeof fr;

const en: Record<TranslationKey, string> = {
  "nav.categories": "Categories",
  "nav.products": "Products",
  "nav.vendors": "Vendors",
  "nav.trust": "Trust & Safety",
  "header.login": "Log in",
  "header.becomeVendor": "Become a Vendor",
  "header.dashboard": "Dashboard",
  "header.myAccount": "My Account",
  "header.signOut": "Sign out",
  "header.welcome": "Welcome",

  "footer.copyright": "TEKA. Kinshasa, DRC.",

  "hero.title1": "Wholesale trade,",
  "hero.titleHighlight": "finally reliable.",
  "hero.subtitle":
    "Buy and sell wholesale with total confidence. Connect with the best suppliers in the Democratic Republic of Congo.",
  "hero.statVendors": "Vendors",
  "hero.statProducts": "Products",
  "hero.statProvinces": "Provinces",
  "hero.ctaFindProducts": "Find products",
  "hero.ctaBecomeVendor": "Become a vendor",

  "search.eyebrow": "Quick search",
  "search.title": "Find your wholesale suppliers",
  "search.placeholder": "E.g.: cement, rice, cooking oil…",
  "search.trust": "Verified · Secure · MOQ shown",

  "card.becomeVendorLabel": "Become a vendor",
  "card.becomeVendorTitle": "Sell wholesale",
  "card.escrowLabel": "Escrow payment",
  "card.escrowTitle": "Trust & Safety",

  "categories.eyebrow": "Explore the market",
  "categories.title": "Product categories",
  "categories.viewAll": "View all",

  "featured.eyebrow": "Current selection",
  "featured.title": "Featured products",
  "featured.viewAll": "View all products",

  "security.eyebrow": "Trust & Safety",
  "security.title": "Safety first",
  "security.subtitle":
    "TEKA protects both buyer and vendor at every step — that's the foundation everything else is built on.",
  "security.pillar1Title": "Verified vendors",
  "security.pillar1Desc":
    "Every vendor is screened before joining TEKA — identity, activity, history.",
  "security.pillar2Title": "Escrow payment",
  "security.pillar2Desc":
    "Your funds are held and only released to the vendor once delivery is confirmed.",
  "security.pillar3Title": "Dispute support",
  "security.pillar3Desc":
    "A problem? Our team steps in to protect both the buyer and the vendor.",
  "security.paymentMethods": "Accepted payment methods",
  "security.howEscrowWorks": "How does escrow payment work?",

  "vendorCta.title": "Sell wholesale on TEKA",
  "vendorCta.subtitle":
    "Create your shop for free, publish your products, and receive buyer requests from across the DRC.",
  "vendorCta.button": "Become a vendor",

  "language.label": "Language",

  "vendorNav.menu": "Menu",
  "vendorNav.requests": "Quote requests",
  "vendorNav.payments": "Payments",
  "vendorNav.settings": "Settings",
  "vendorNav.company": "Your business",
  "vendorNav.account": "Vendor account",
  "vendorNav.collapseSidebar": "Collapse sidebar",
  "vendorNav.expandSidebar": "Expand sidebar",
};

const ln: Record<TranslationKey, string> = {
  "nav.categories": "Kalasi",
  "nav.products": "Biloko",
  "nav.vendors": "Bateki",
  "nav.trust": "Elikya na Libateli",
  "header.login": "Kokɔta",
  "header.becomeVendor": "Kokóma Moteki",
  "header.dashboard": "Etando ya Mosala",
  "header.myAccount": "Kɔnti na Ngai",
  "header.signOut": "Kobima",
  "header.welcome": "Boyei malamu",

  "footer.copyright": "TEKA. Kinshasa, RDC.",

  "hero.title1": "Mombongo ya monene,",
  "hero.titleHighlight": "elikya sikoyo.",
  "hero.subtitle":
    "Somba mpe teka na monene na elikya nyonso. Kangama na bateki ya malamu koleka na Republiki Demokratiki ya Kongo.",
  "hero.statVendors": "Bateki",
  "hero.statProducts": "Biloko",
  "hero.statProvinces": "Provense",
  "hero.ctaFindProducts": "Luka biloko",
  "hero.ctaBecomeVendor": "Kokóma moteki",

  "search.eyebrow": "Luka noki",
  "search.title": "Luka bateki na yo ya monene",
  "search.placeholder": "Ndakisa : simá, loso, mafuta…",
  "search.trust": "Batalami · Babateli · MOQ emonani",

  "card.becomeVendorLabel": "Kokóma moteki",
  "card.becomeVendorTitle": "Teka na monene",
  "card.escrowLabel": "Mbongo ebombami",
  "card.escrowTitle": "Elikya na Libateli",

  "categories.eyebrow": "Tala zando",
  "categories.title": "Kalasi ya biloko",
  "categories.viewAll": "Tala nyonso",

  "featured.eyebrow": "Eponami lelo",
  "featured.title": "Biloko ya minene",
  "featured.viewAll": "Tala biloko nyonso",

  "security.eyebrow": "Elikya na Libateli",
  "security.title": "Libateli ya liboso",
  "security.subtitle":
    "TEKA ebateli mosombi mpe moteki na etape nyonso — yango nde ebandeli ya makambo nyonso.",
  "security.pillar1Title": "Bateki batalami",
  "security.pillar1Desc":
    "Moteki nyonso atalami liboso ya kokɔta na TEKA — nkombo, mosala, ba istoire na ye.",
  "security.pillar2Title": "Mbongo ebombami",
  "security.pillar2Desc":
    "Mbongo na yo ebombami mpe epesami na moteki kaka soki bomemi ekoki na esika.",
  "security.pillar3Title": "Lisungi soki likambo ebimi",
  "security.pillar3Desc":
    "Likambo moko ebimi? Ekipe na biso eyaka kobatela mosombi ná moteki.",
  "security.paymentMethods": "Ndenge ya kofuta oyo endimami",
  "security.howEscrowWorks": "Ndenge nini mbongo ebombami esalaka?",

  "vendorCta.title": "Teka na monene na TEKA",
  "vendorCta.subtitle":
    "Fungola magazini na yo ofele, tia biloko na yo, mpe zwa ba demandes ya basombi na RDC mobimba.",
  "vendorCta.button": "Kokóma moteki",

  "language.label": "Monɔkɔ",

  "vendorNav.menu": "Menu",
  "vendorNav.requests": "Bosenga ya ntalo",
  "vendorNav.payments": "Bofuti",
  "vendorNav.settings": "Bobongisi",
  "vendorNav.company": "Kompanyi na yo",
  "vendorNav.account": "Kɔnti ya moteki",
  "vendorNav.collapseSidebar": "Kanga bar ya pembeni",
  "vendorNav.expandSidebar": "Fungola bar ya pembeni",
};

const sw: Record<TranslationKey, string> = {
  "nav.categories": "Aina za bidhaa",
  "nav.products": "Bidhaa",
  "nav.vendors": "Wauzaji",
  "nav.trust": "Uaminifu na Usalama",
  "header.login": "Ingia",
  "header.becomeVendor": "Kuwa Muuzaji",
  "header.dashboard": "Dashibodi",
  "header.myAccount": "Akaunti Yangu",
  "header.signOut": "Toka",
  "header.welcome": "Karibu",

  "footer.copyright": "TEKA. Kinshasa, DRC.",

  "hero.title1": "Biashara ya jumla,",
  "hero.titleHighlight": "sasa ya kuaminika.",
  "hero.subtitle":
    "Nunua na uza kwa jumla kwa uhakika kamili. Ungana na wauzaji bora wa Jamhuri ya Kidemokrasia ya Kongo.",
  "hero.statVendors": "Wauzaji",
  "hero.statProducts": "Bidhaa",
  "hero.statProvinces": "Mikoa",
  "hero.ctaFindProducts": "Tafuta bidhaa",
  "hero.ctaBecomeVendor": "Kuwa muuzaji",

  "search.eyebrow": "Utafutaji wa haraka",
  "search.title": "Tafuta wauzaji wako wa jumla",
  "search.placeholder": "Mfano : saruji, mchele, mafuta…",
  "search.trust": "Wamethibitishwa · Salama · MOQ inaonyeshwa",

  "card.becomeVendorLabel": "Kuwa muuzaji",
  "card.becomeVendorTitle": "Uza kwa jumla",
  "card.escrowLabel": "Malipo salama",
  "card.escrowTitle": "Uaminifu na Usalama",

  "categories.eyebrow": "Chunguza soko",
  "categories.title": "Aina za bidhaa",
  "categories.viewAll": "Ona zote",

  "featured.eyebrow": "Uteuzi wa sasa",
  "featured.title": "Bidhaa maarufu",
  "featured.viewAll": "Ona bidhaa zote",

  "security.eyebrow": "Uaminifu na Usalama",
  "security.title": "Usalama kwanza",
  "security.subtitle":
    "TEKA inalinda mnunuzi na muuzaji katika kila hatua — hii ndiyo msingi wa kila kitu kingine.",
  "security.pillar1Title": "Wauzaji waliothibitishwa",
  "security.pillar1Desc":
    "Kila muuzaji anakaguliwa kabla ya kujiunga na TEKA — kitambulisho, shughuli, historia.",
  "security.pillar2Title": "Malipo salama",
  "security.pillar2Desc":
    "Fedha zako zinabaki salama na hulipwa kwa muuzaji tu baada ya utoaji kuthibitishwa.",
  "security.pillar3Title": "Msaada wa migogoro",
  "security.pillar3Desc":
    "Kuna tatizo? Timu yetu inaingilia kati kulinda mnunuzi na muuzaji.",
  "security.paymentMethods": "Njia za malipo zinazokubaliwa",
  "security.howEscrowWorks": "Malipo salama yanafanya kazi vipi?",

  "vendorCta.title": "Uza kwa jumla kwenye TEKA",
  "vendorCta.subtitle":
    "Fungua duka lako bure, chapisha bidhaa zako, na upate maombi ya wanunuzi kote DRC.",
  "vendorCta.button": "Kuwa muuzaji",

  "language.label": "Lugha",

  "vendorNav.menu": "Menyu",
  "vendorNav.requests": "Maombi ya bei",
  "vendorNav.payments": "Malipo",
  "vendorNav.settings": "Mipangilio",
  "vendorNav.company": "Biashara yako",
  "vendorNav.account": "Akaunti ya muuzaji",
  "vendorNav.collapseSidebar": "Kunja upau wa pembeni",
  "vendorNav.expandSidebar": "Panua upau wa pembeni",
};

const kg: Record<TranslationKey, string> = {
  "nav.categories": "Zindambu",
  "nav.products": "Bima",
  "nav.vendors": "Batekisi",
  "nav.trust": "Luyalu ye Lukebo",
  "header.login": "Kota",
  "header.becomeVendor": "Kuma Ntekisi",
  "header.dashboard": "Meza ya Kisalu",
  "header.myAccount": "Konti Yame",
  "header.signOut": "Basika",
  "header.welcome": "Kuiza kuandi",

  "footer.copyright": "TEKA. Kinshasa, RDC.",

  "hero.title1": "Malonda ya nene,",
  "hero.titleHighlight": "ya kieleka bubu.",
  "hero.subtitle":
    "Sumba ye teka na nene na luyalu yonso. Wizana ye batekisi ya mbote ya Republiki ya Kidemokrasi ya Kongo.",
  "hero.statVendors": "Batekisi",
  "hero.statProducts": "Bima",
  "hero.statProvinces": "Mikanda",
  "hero.ctaFindProducts": "Tomba bima",
  "hero.ctaBecomeVendor": "Kuma ntekisi",

  "search.eyebrow": "Tomba nswalu",
  "search.title": "Tomba batekisi na nge ya nene",
  "search.placeholder": "Mbandu : simá, loso, mafuta…",
  "search.trust": "Bamonwa · Bakebolo · MOQ ya monika",

  "card.becomeVendorLabel": "Kuma ntekisi",
  "card.becomeVendorTitle": "Teka na nene",
  "card.escrowLabel": "Mbongo ya kebolo",
  "card.escrowTitle": "Luyalu ye Lukebo",

  "categories.eyebrow": "Tala zando",
  "categories.title": "Zindambu za bima",
  "categories.viewAll": "Tala yawonso",

  "featured.eyebrow": "Bansolo ya bubu",
  "featured.title": "Bima ya nene",
  "featured.viewAll": "Tala bima yawonso",

  "security.eyebrow": "Luyalu ye Lukebo",
  "security.title": "Lukebo na ntete",
  "security.subtitle":
    "TEKA ikebanga nsumbi ye ntekisi na konso lubalu — yawu i fondasio ya mambu mankaka.",
  "security.pillar1Title": "Batekisi bamonwa",
  "security.pillar1Desc":
    "Konso ntekisi ikuzikwanga na ntwala ya kota na TEKA — nkumbu, kisalu, ye masolo maandi.",
  "security.pillar2Title": "Mbongo ya kebolo",
  "security.pillar2Desc":
    "Mbongo na nge ikebolo ye ilutulu kwa ntekisi kakana ntwala ya lutumu kutwadisibua.",
  "security.pillar3Title": "Lusadisu na tsi ya mambu",
  "security.pillar3Desc":
    "Diambu mosi dibwidi? Kipani kieto kikwizanga mu kebila nsumbi ye ntekisi.",
  "security.paymentMethods": "Mitindu ya mfutu miyikwama",
  "security.howEscrowWorks": "Mbongo ya kebolo isalanga buevi?",

  "vendorCta.title": "Teka na nene kuna TEKA",
  "vendorCta.subtitle":
    "Fungula lukalu na nge yina lufweni, tula bima na nge, ye baka malombi ma basumbi na RDC yawonso.",
  "vendorCta.button": "Kuma ntekisi",

  "language.label": "Ndinga",

  "vendorNav.menu": "Menu",
  "vendorNav.requests": "Malombi ma ntalu",
  "vendorNav.payments": "Mfutu",
  "vendorNav.settings": "Bulongi",
  "vendorNav.company": "Kisalu kiaku",
  "vendorNav.account": "Konti ya ntekisi",
  "vendorNav.collapseSidebar": "Kanga barre ya lubakala",
  "vendorNav.expandSidebar": "Fungula barre ya lubakala",
};

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  fr,
  en,
  ln,
  sw,
  kg,
};
