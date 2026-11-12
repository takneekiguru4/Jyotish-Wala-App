/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getPanchangForDate } from '../services/panchangEngine';

export interface TyoharItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  displayDate: string;
  monthNumber: number; // 1 = जनवरी ... 12 = दिसंबर
  monthName: string;
  hindiMaas: string;
  pakshaTithi: string;
  vara: string;
  category: 'प्रमुख महापर्व' | 'एकादशी एवं व्रत' | 'संक्रांति एवं जयंती' | 'शक्ति एवं शिव पर्व';
  shortInfo: string;
  whyCelebrated?: string;
  detailedSignificance?: string;
  historyAndPauranik?: string;
  pujaVidhi?: string;
  vratAndRules?: string;
  kathaOrMantra?: string;
  sankalp?: string;
  doAndDonts?: string;
  daanAndUpay?: string;
  isCustom?: boolean;
}

export const HINDI_MONTH_TABS: { monthNumber: number; label: string; vedicMaas: string }[] = [
  { monthNumber: 0, label: 'संपूर्ण वर्ष (12 महीने)', vedicMaas: 'चैत्र से फाल्गुन' },
  { monthNumber: 1, label: 'जनवरी', vedicMaas: 'पौष – माघ' },
  { monthNumber: 2, label: 'फरवरी', vedicMaas: 'माघ – फाल्गुन' },
  { monthNumber: 3, label: 'मार्च', vedicMaas: 'फाल्गुन – चैत्र' },
  { monthNumber: 4, label: 'अप्रैल', vedicMaas: 'चैत्र – वैशाख' },
  { monthNumber: 5, label: 'मई', vedicMaas: 'वैशाख – ज्येष्ठ' },
  { monthNumber: 6, label: 'जून', vedicMaas: 'ज्येष्ठ – आषाढ़' },
  { monthNumber: 7, label: 'जुलाई', vedicMaas: 'आषाढ़ – श्रावण' },
  { monthNumber: 8, label: 'अगस्त', vedicMaas: 'श्रावण – भाद्रपद' },
  { monthNumber: 9, label: 'सितंबर', vedicMaas: 'भाद्रपद – आश्विन' },
  { monthNumber: 10, label: 'अक्टूबर', vedicMaas: 'आश्विन – कार्तिक' },
  { monthNumber: 11, label: 'नवंबर', vedicMaas: 'कार्तिक – मार्गशीर्ष' },
  { monthNumber: 12, label: 'दिसंबर', vedicMaas: 'मार्गशीर्ष – पौष' }
];

export const ANNUAL_TYOHAR_LIST: TyoharItem[] = [
  // 1. जनवरी (पौष - माघ)
  {
    id: 'ty_jan_1',
    name: 'मकर संक्रांति एवं उत्तरायण महापर्व',
    date: '2026-01-14',
    displayDate: '14 जनवरी 2026',
    monthNumber: 1,
    monthName: 'जनवरी',
    hindiMaas: 'माघ कृष्ण पक्ष',
    pakshaTithi: 'एकादशी / मकर संक्रांति',
    vara: 'बुधवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'सूर्य देव के धनु राशि से मकर राशि में प्रवेश करने और उत्तरायण प्रारंभ होने का पावन पर्व। इस दिन गंगा स्नान, तिल-गुड़ और खिचड़ी दान करने से अक्षय पुण्य की प्राप्ति होती है।'
  },
  {
    id: 'ty_jan_2',
    name: 'षटतिला एकादशी व्रत',
    date: '2026-01-14',
    displayDate: '14 जनवरी 2026',
    monthNumber: 1,
    monthName: 'जनवरी',
    hindiMaas: 'माघ कृष्ण पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'बुधवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'माघ मास की कृष्ण पक्ष एकादशी पर भगवान विष्णु की तिल से छह प्रकार से पूजा, हवन, तर्पण व दान करने से समस्त पापों का नाश एवं बैकुंठ लोक की प्राप्ति होती है।'
  },
  {
    id: 'ty_jan_3',
    name: 'मौनी अमावस्या (माघी अमावस्या)',
    date: '2026-01-18',
    displayDate: '18 जनवरी 2026',
    monthNumber: 1,
    monthName: 'जनवरी',
    hindiMaas: 'माघ कृष्ण पक्ष',
    pakshaTithi: 'अमावस्या तिथि',
    vara: 'रविवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'मौन रहकर आत्मचिंतन करने और प्रयागराज व ऋषिकेश में पवित्र गंगा स्नान का सर्वश्रेष्ठ पर्व। पितरों के तर्पण और तिल दान के लिए यह तिथि अत्यंत फलदायी मानी जाती है।'
  },
  {
    id: 'ty_jan_4',
    name: 'बसंत पंचमी (श्री सरस्वती पूजा)',
    date: '2026-01-23',
    displayDate: '23 जनवरी 2026',
    monthNumber: 1,
    monthName: 'जनवरी',
    hindiMaas: 'माघ शुक्ल पक्ष',
    pakshaTithi: 'पंचमी तिथि',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'विद्या, ज्ञान और संगीत की अधिष्ठात्री देवी मां सरस्वती के प्राकट्य का पावन पर्व। यह दिन विद्यारंभ, गृह प्रवेश और समस्त मांगलिक कार्यों के लिए अबूझ मुहूर्त होता है।'
  },

  // 2. फरवरी (माघ - फाल्गुन)
  {
    id: 'ty_feb_1',
    name: 'माघी पूर्णिमा एवं संत रविदास जयंती',
    date: '2026-02-01',
    displayDate: '01 फरवरी 2026',
    monthNumber: 2,
    monthName: 'फरवरी',
    hindiMaas: 'माघ शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'रविवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'माघ मास के कल्पवास की पूर्णाहुति और पवित्र नदी स्नान का विशेष पर्व। इस दिन भगवान सत्यनारायण की कथा, चंद्रमा को अर्घ्य और अन्न-वस्त्र दान से सुख-समृद्धि बढ़ती है।'
  },
  {
    id: 'ty_feb_2',
    name: 'विजया एकादशी व्रत',
    date: '2026-02-13',
    displayDate: '13 फरवरी 2026',
    monthNumber: 2,
    monthName: 'फरवरी',
    hindiMaas: 'फाल्गुन कृष्ण पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'शुक्रवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'भगवान श्रीराम ने लंका विजय से पूर्व यह एकादशी व्रत किया था। कठिन कार्यों में विजय और शत्रुओं पर सफलता प्राप्त करने के लिए विजया एकादशी व्रत अत्यंत अमोघ है।'
  },
  {
    id: 'ty_feb_3',
    name: 'महाशिवरात्रि महापर्व',
    date: '2026-02-15',
    displayDate: '15 फरवरी 2026',
    monthNumber: 2,
    monthName: 'फरवरी',
    hindiMaas: 'फाल्गुन कृष्ण पक्ष',
    pakshaTithi: 'चतुर्दशी तिथि',
    vara: 'रविवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'भगवान शिव और माता पार्वती के दिव्य विवाह की पावन रात्रि। चारों प्रहर में शिवलिंग का रुद्राभिषेक, बिल्वपत्र अर्पण और पंचाक्षरी मंत्र जाप से मोक्ष व मनोकामना सिद्धि होती है।'
  },
  {
    id: 'ty_feb_4',
    name: 'आमलकी (रंगभरी) एकादशी',
    date: '2026-02-27',
    displayDate: '27 फरवरी 2026',
    monthNumber: 2,
    monthName: 'फरवरी',
    hindiMaas: 'फाल्गुन शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'शुक्रवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'आंवले के वृक्ष के नीचे भगवान विष्णु और शिव-पार्वती की पूजा का विशेष पर्व। काशी और तीर्थ नगरी में इस दिन से अबीर-गुलाल के साथ होली उत्सव प्रारंभ होता है।'
  },

  // 3. मार्च (फाल्गुन - चैत्र)
  {
    id: 'ty_mar_1',
    name: 'होलिका दहन (फाल्गुन पूर्णिमा)',
    date: '2026-03-03',
    displayDate: '03 मार्च 2026',
    monthNumber: 3,
    monthName: 'मार्च',
    hindiMaas: 'फाल्गुन शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'मंगलवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भक्त प्रह्लाद की अटूट भक्ति और अधर्म पर धर्म की विजय का प्रतीक। भद्रा रहित प्रदोष काल में होलिका पूजन एवं दहन करने से घर के समस्त नकारात्मक दोष शांत होते हैं।'
  },
  {
    id: 'ty_mar_2',
    name: 'रंगोत्सव धुलेंडी (होली महापर्व)',
    date: '2026-03-04',
    displayDate: '04 मार्च 2026',
    monthNumber: 3,
    monthName: 'मार्च',
    hindiMaas: 'चैत्र कृष्ण पक्ष',
    pakshaTithi: 'प्रतिपदा तिथि',
    vara: 'बुधवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'प्रेम, भाईचारे और आनंद के रंगों का सनातन महापर्व। इस दिन इष्ट देव और ठाकुर जी के चरणों में गुलाल अर्पित कर परिवार व समाज में सौहार्द मनाया जाता है।'
  },
  {
    id: 'ty_mar_3',
    name: 'चैत्र नवरात्रि प्रारंभ एवं हिंदू नववर्ष (विक्रम संवत 2083)',
    date: '2026-03-19',
    displayDate: '19 मार्च 2026',
    monthNumber: 3,
    monthName: 'मार्च',
    hindiMaas: 'चैत्र शुक्ल पक्ष',
    pakshaTithi: 'प्रतिपदा तिथि',
    vara: 'गुरुवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'सृष्टि के आरंभ दिवस, गुड़ी पड़वा और विक्रम संवत नववर्ष का शुभारंभ। शुभ मुहूर्त में घटस्थापना कर नौ दिनों तक मां दुर्गा के नवस्वरूपों की उपासना की जाती है।'
  },
  {
    id: 'ty_mar_4',
    name: 'रामनवमी महापर्व (श्रीराम जन्मोत्सव)',
    date: '2026-03-27',
    displayDate: '27 मार्च 2026',
    monthNumber: 3,
    monthName: 'मार्च',
    hindiMaas: 'चैत्र शुक्ल पक्ष',
    pakshaTithi: 'नवमी तिथि',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'मर्यादा पुरुषोत्तम भगवान श्रीराम का पावन प्राकट्योत्सव एवं चैत्र नवरात्रि की पूर्णाहुति। मध्याह्न काल में श्रीरामचरितमानस पाठ, कन्या पूजन व हवन से विशेष कृपा मिलती है।'
  },

  // 4. अप्रैल (चैत्र - वैशाख)
  {
    id: 'ty_apr_1',
    name: 'श्री हनुमान जयंती (चैत्र पूर्णिमा)',
    date: '2026-04-02',
    displayDate: '02 अप्रैल 2026',
    monthNumber: 4,
    monthName: 'अप्रैल',
    hindiMaas: 'चैत्र शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'गुरुवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'संकटमोचन पवनपुत्र हनुमान जी का जन्मोत्सव। इस दिन सिंदूर चोला अर्पण, सुंदरकांड व हनुमान चालीसा के पाठ से शनि-मंगल दोष शांत होते हैं और बल-बुद्धि की प्राप्ति होती है।'
  },
  {
    id: 'ty_apr_2',
    name: 'मेष संक्रांति (सौर नववर्ष / बैसाखी)',
    date: '2026-04-14',
    displayDate: '14 अप्रैल 2026',
    monthNumber: 4,
    monthName: 'अप्रैल',
    hindiMaas: 'वैशाख कृष्ण पक्ष',
    pakshaTithi: 'द्वादशी / मेष संक्रांति',
    vara: 'मंगलवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'सूर्य देव के मेष राशि में प्रवेश के साथ सौर नववर्ष और खरमास की समाप्ति। उत्तराखंड में इसे बिखोती पर्व और देशभर में बैसाखी व सत्तू संक्रांति के रूप में मनाया जाता है।'
  },
  {
    id: 'ty_apr_3',
    name: 'अक्षय तृतीया एवं श्री परशुराम जयंती',
    date: '2026-04-19',
    displayDate: '19 अप्रैल 2026',
    monthNumber: 4,
    monthName: 'अप्रैल',
    hindiMaas: 'वैशाख शुक्ल पक्ष',
    pakshaTithi: 'तृतीया तिथि',
    vara: 'रविवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'वर्ष का सर्वश्रेष्ठ स्वयंसिद्ध अबूझ मुहूर्त एवं भगवान परशुराम का प्राकट्य दिवस। इस दिन किया गया जप, दान, स्वर्ण खरीद और शुभ कार्य अक्षय फल प्रदान करता है।'
  },
  {
    id: 'ty_apr_4',
    name: 'मोहिनी एकादशी व्रत',
    date: '2026-04-27',
    displayDate: '27 अप्रैल 2026',
    monthNumber: 4,
    monthName: 'अप्रैल',
    hindiMaas: 'वैशाख शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'सोमवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'समुद्र मंथन के समय भगवान विष्णु द्वारा मोहिनी स्वरूप धारण करने की पावन तिथि। यह व्रत मोह-माया के बंधनों से मुक्ति और पारिवारिक सुख-शांति प्रदान करता है।'
  },

  // 5. मई (वैशाख - ज्येष्ठ)
  {
    id: 'ty_may_1',
    name: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा / पीपल पूर्णिमा)',
    date: '2026-05-01',
    displayDate: '01 मई 2026',
    monthNumber: 5,
    monthName: 'मई',
    hindiMaas: 'वैशाख शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'शुक्रवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'भगवान विष्णु के कूर्म व बुद्ध अवतार की पावन तिथि। इस दिन पवित्र नदी स्नान, पीपल वृक्ष में जल अर्पण और जल से भरे घड़े का दान अत्यंत पुण्यदायी होता है।'
  },
  {
    id: 'ty_may_2',
    name: 'वट सावित्री अमावस्या एवं शनि जयंती',
    date: '2026-05-16',
    displayDate: '16 मई 2026',
    monthNumber: 5,
    monthName: 'मई',
    hindiMaas: 'ज्येष्ठ कृष्ण पक्ष',
    pakshaTithi: 'अमावस्या तिथि',
    vara: 'शनिवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'अखंड सौभाग्य एवं पति की दीर्घायु हेतु सुहागिन महिलाओं द्वारा वट वृक्ष की पूजा। साथ ही न्याय के देवता भगवान शनिदेव के जन्मोत्सव पर तैलाभिषेक और छाया दान किया जाता है।'
  },
  {
    id: 'ty_may_3',
    name: 'गंगा दशहरा महापर्व',
    date: '2026-05-25',
    displayDate: '25 मई 2026',
    monthNumber: 5,
    monthName: 'मई',
    hindiMaas: 'ज्येष्ठ शुक्ल पक्ष',
    pakshaTithi: 'दशमी तिथि',
    vara: 'सोमवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भगीरथ की तपस्या से मां गंगा के पृथ्वी पर अवतरण का पावन महापर्व। ऋषिकेश व हरिद्वार में गंगा स्नान और दीपदान करने से दस प्रकार के पापों का हरण होता है।'
  },
  {
    id: 'ty_may_4',
    name: 'निर्जला एकादशी (भीमसेनी एकादशी)',
    date: '2026-05-27',
    displayDate: '27 मई 2026',
    monthNumber: 5,
    monthName: 'मई',
    hindiMaas: 'ज्येष्ठ शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'बुधवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'वर्ष की समस्त 24 एकादशियों में श्रेष्ठतम व्रत। बिना जल ग्रहण किए भगवान विष्णु की आराधना तथा राहगीरों को शीतल जल, शरबत व घड़ा दान करने से संपूर्ण एकादशियों का फल मिलता है।'
  },

  // 6. जून (ज्येष्ठ - आषाढ़)
  {
    id: 'ty_jun_1',
    name: 'कबीर जयंती एवं ज्येष्ठ पूर्णिमा व्रत',
    date: '2026-06-29',
    displayDate: '29 जून 2026',
    monthNumber: 6,
    monthName: 'जून',
    hindiMaas: 'ज्येष्ठ शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'सोमवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'ज्येष्ठ मास की पूर्णिमा पर तीर्थ स्नान, भगवान लक्ष्मी-नारायण पूजन और संत कबीरदास जयंती मनाई जाती है। चंद्र दोष शांति के लिए रात्रि में चंद्रमा को अर्घ्य दिया जाता है।'
  },
  {
    id: 'ty_jun_2',
    name: 'मिथुन संक्रांति',
    date: '2026-06-15',
    displayDate: '15 जून 2026',
    monthNumber: 6,
    monthName: 'जून',
    hindiMaas: 'आषाढ़ मास',
    pakshaTithi: 'मिथुन संक्रांति',
    vara: 'सोमवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'सूर्य देव के वृषभ राशि से मिथुन राशि में गोचर का पावन दिवस। इस दिन सूर्य उपासना, गायत्री मंत्र जाप और हरी मूंग व वस्त्र दान से आरोग्य प्राप्त होता है।'
  },
  {
    id: 'ty_jun_3',
    name: 'योगिनी एकादशी व्रत',
    date: '2026-06-11',
    displayDate: '11 जून 2026',
    monthNumber: 6,
    monthName: 'जून',
    hindiMaas: 'आषाढ़ कृष्ण पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'गुरुवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'चर्म रोगों से मुक्ति, उत्तम स्वास्थ्य एवं पापों के प्रायश्चित हेतु भगवान श्रीहरि नारायण और पीपल वृक्ष की पूजा का विशेष एकादशी व्रत।'
  },

  // 7. जुलाई (आषाढ़ - श्रावण)
  {
    id: 'ty_jul_1',
    name: 'श्री जगन्नाथ रथयात्रा उत्सव',
    date: '2026-07-16',
    displayDate: '16 जुलाई 2026',
    monthNumber: 7,
    monthName: 'जुलाई',
    hindiMaas: 'आषाढ़ शुक्ल पक्ष',
    pakshaTithi: 'द्वितीया तिथि',
    vara: 'गुरुवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भगवान जगन्नाथ, भाई बलभद्र और बहन सुभद्रा की विश्वप्रसिद्ध रथयात्रा। इस दिन भगवान के रथ दर्शन और नाम संकीर्तन से जन्म-मरण के चक्र से मुक्ति मिलती है।'
  },
  {
    id: 'ty_jul_2',
    name: 'देवशयनी हरिप्रबोधिनी एकादशी (चातुर्मास प्रारंभ)',
    date: '2026-07-25',
    displayDate: '25 जुलाई 2026',
    monthNumber: 7,
    monthName: 'जुलाई',
    hindiMaas: 'आषाढ़ शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'शनिवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'इस तिथि से भगवान विष्णु चार माह के लिए क्षीरसागर में योगनिद्रा में विश्राम करते हैं और चातुर्मास का प्रारंभ होता है। यह समय साधना, जप और सत्संग के लिए समर्पित है।'
  },
  {
    id: 'ty_jul_3',
    name: 'गुरु पूर्णिमा (व्यास पूर्णिमा महापर्व)',
    date: '2026-07-29',
    displayDate: '29 जुलाई 2026',
    monthNumber: 7,
    monthName: 'जुलाई',
    hindiMaas: 'आषाढ़ शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'बुधवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'वेदों के संकलनकर्ता महर्षि वेदव्यास जी का प्राकट्य दिवस। इस दिन अपने आध्यात्मिक गुरु और आचार्यों का पूजन कर आशीर्वाद लेने से ज्ञान व भाग्योदय की प्राप्ति होती है।'
  },
  {
    id: 'ty_jul_4',
    name: 'पवित्र श्रावण (सावन) मास प्रारंभ',
    date: '2026-07-30',
    displayDate: '30 जुलाई 2026',
    monthNumber: 7,
    monthName: 'जुलाई',
    hindiMaas: 'श्रावण कृष्ण पक्ष',
    pakshaTithi: 'प्रतिपदा तिथि',
    vara: 'गुरुवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'भगवान आशुतोष महादेव को समर्पित परम पावन श्रावण मास का आरंभ। पूरे माह शिवलिंग पर गंगाजल, दूध व बिल्वपत्र अर्पित करने और कांवड़ यात्रा का विशेष महत्व है।'
  },

  // 8. अगस्त (श्रावण - भाद्रपद)
  {
    id: 'ty_aug_1',
    name: 'हरियाली तीज व्रत',
    date: '2026-08-15',
    displayDate: '15 अगस्त 2026',
    monthNumber: 8,
    monthName: 'अगस्त',
    hindiMaas: 'श्रावण शुक्ल पक्ष',
    pakshaTithi: 'तृतीया तिथि',
    vara: 'शनिवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'माता पार्वती और भगवान शिव के पुनर्मिलन का पावन पर्व। सुहागिन महिलाएं अखंड सौभाग्य और सुखद दांपत्य जीवन के लिए सोलह श्रृंगार कर शिव-गौरी का पूजन करती हैं।'
  },
  {
    id: 'ty_aug_2',
    name: 'नाग पंचमी पर्व',
    date: '2026-08-17',
    displayDate: '17 अगस्त 2026',
    monthNumber: 8,
    monthName: 'अगस्त',
    hindiMaas: 'श्रावण शुक्ल पक्ष',
    pakshaTithi: 'पंचमी तिथि',
    vara: 'सोमवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'अष्टनागों और भगवान शिव के आभूषण वासुकी नाग के पूजन का पर्व। जन्मकुंडली में कालसर्प दोष और राहु-केतु पीड़ा शांति हेतु इस दिन विशेष रुद्राभिषेक व नाग पूजन किया जाता है।'
  },
  {
    id: 'ty_aug_3',
    name: 'रक्षाबंधन (श्रावणी पूर्णिमा / संस्कृत दिवस)',
    date: '2026-08-28',
    displayDate: '28 अगस्त 2026',
    monthNumber: 8,
    monthName: 'अगस्त',
    hindiMaas: 'श्रावण शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भाई-बहन के पवित्र स्नेह और रक्षा सूत्र का महापर्व। साथ ही वैदिक परंपरा में इस दिन उपाकर्म संस्कार और नवीन यज्ञोपवीत (जनेऊ) धारण करने का विधान है।'
  },

  // 9. सितंबर (भाद्रपद - आश्विन)
  {
    id: 'ty_sep_1',
    name: 'श्रीकृष्ण जन्माष्टमी महापर्व',
    date: '2026-09-04',
    displayDate: '04 सितंबर 2026',
    monthNumber: 9,
    monthName: 'सितंबर',
    hindiMaas: 'भाद्रपद कृष्ण पक्ष',
    pakshaTithi: 'अष्टमी तिथि (रोहिणी नक्षत्र)',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'योगेश्वर भगवान श्रीकृष्ण का मध्यरात्रि जन्मोत्सव। व्रत रखकर रात्रि 12 बजे लड्डू गोपाल का पंचामृत अभिषेक, माखन-मिश्री भोग और संकीर्तन करने से संतान व सुख-समृद्धि मिलती है।'
  },
  {
    id: 'ty_sep_2',
    name: 'हरतालिका तीज एवं श्री गणेश चतुर्थी महोत्सव',
    date: '2026-09-14',
    displayDate: '14 सितंबर 2026',
    monthNumber: 9,
    monthName: 'सितंबर',
    hindiMaas: 'भाद्रपद शुक्ल पक्ष',
    pakshaTithi: 'तृतीया / चतुर्थी तिथि',
    vara: 'सोमवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'प्रथम पूज्य विघ्नहर्ता भगवान श्री गणेश का जन्मोत्सव। घर और पंडालों में गणपति स्थापना कर मोदक व दूर्वा अर्पित करने से समस्त विघ्नों का नाश और रिद्धि-सिद्धि की प्राप्ति होती है।'
  },
  {
    id: 'ty_sep_3',
    name: 'अनंत चतुर्दशी एवं गणेश विसर्जन',
    date: '2026-09-25',
    displayDate: '25 सितंबर 2026',
    monthNumber: 9,
    monthName: 'सितंबर',
    hindiMaas: 'भाद्रपद शुक्ल पक्ष',
    pakshaTithi: 'चतुर्दशी तिथि',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भगवान विष्णु के अनंत स्वरूप का पूजन एवं 14 ग्रंथियों वाला अनंत रक्षा सूत्र बांधने का पर्व। इसी दिन दस दिवसीय गणेश उत्सव का श्रद्धापूर्वक विसर्जन होता है।'
  },
  {
    id: 'ty_sep_4',
    name: 'पितृ पक्ष (महालय श्राद्ध) प्रारंभ',
    date: '2026-09-27',
    displayDate: '27 सितंबर 2026',
    monthNumber: 9,
    monthName: 'सितंबर',
    hindiMaas: 'आश्विन कृष्ण पक्ष',
    pakshaTithi: 'प्रतिपदा तिथि',
    vara: 'रविवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'पूर्वजों और पितरों के प्रति श्रद्धा प्रकट करने के 16 दिवसीय श्राद्ध पक्ष का आरंभ। तर्पण, पिंडदान और ब्राह्मण भोजन कराने से पितृ दोष शांत होता है और वंश वृद्धि का आशीर्वाद मिलता है।'
  },

  // 10. अक्टूबर (आश्विन - कार्तिक)
  {
    id: 'ty_oct_1',
    name: 'सर्वपितृ मोक्ष अमावस्या',
    date: '2026-10-10',
    displayDate: '10 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'आश्विन कृष्ण पक्ष',
    pakshaTithi: 'अमावस्या तिथि',
    vara: 'शनिवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'पितृ पक्ष की अंतिम तिथि जिस दिन ज्ञात-अज्ञात समस्त पितरों का सामूहिक तर्पण व श्राद्ध किया जाता है। सायंकाल पीपल के नीचे दीपक जलाकर पितरों को विदाई दी जाती है।'
  },
  {
    id: 'ty_oct_2',
    name: 'शारदीय नवरात्रि प्रारंभ (कलश स्थापना)',
    date: '2026-10-11',
    displayDate: '11 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'आश्विन शुक्ल पक्ष',
    pakshaTithi: 'प्रतिपदा तिथि',
    vara: 'रविवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'आदिशक्ति मां जगदंबा की आराधना का नौ दिवसीय महापर्व। शुभ मुहूर्त में कलश स्थापना, अखंड ज्योति प्रज्वलन और दुर्गा सप्तशती पाठ से शक्ति, सुख व ऐश्वर्य की प्राप्ति होती है।'
  },
  {
    id: 'ty_oct_3',
    name: 'दुर्गा महाष्टमी एवं महानवमी (कन्या पूजन)',
    date: '2026-10-19',
    displayDate: '19 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'आश्विन शुक्ल पक्ष',
    pakshaTithi: 'अष्टमी / नवमी तिथि',
    vara: 'सोमवार',
    category: 'शक्ति एवं शिव पर्व',
    shortInfo: 'मां महागौरी और मां सिद्धिदात्री की विशेष पूजा, हवन और नव कन्याओं के पाद प्रक्षालन व भोजन का पावन दिवस, जिससे नवरात्रि साधना पूर्ण फलदायी होती है।'
  },
  {
    id: 'ty_oct_4',
    name: 'विजयादशमी (दशहरा महापर्व)',
    date: '2026-10-20',
    displayDate: '20 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'आश्विन शुक्ल पक्ष',
    pakshaTithi: 'दशमी तिथि',
    vara: 'मंगलवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'अधर्म पर धर्म और असत्य पर सत्य की विजय का महापर्व। भगवान श्रीराम द्वारा रावण वध और मां दुर्गा द्वारा महिषासुर मर्दन के उपलक्ष्य में शस्त्र पूजन व शमी वृक्ष पूजन किया जाता है।'
  },
  {
    id: 'ty_oct_5',
    name: 'शरद पूर्णिमा (कोजागरी लक्ष्मी पूजा)',
    date: '2026-10-26',
    displayDate: '26 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'आश्विन शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'सोमवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'चंद्रमा की सोलह कलाओं से अमृत वर्षा की पावन रात्रि। रात्रि में खुले आकाश के नीचे खीर रखकर प्रसाद ग्रहण करने और महालक्ष्मी जागरण से आरोग्य व धन लाभ होता है।'
  },
  {
    id: 'ty_oct_6',
    name: 'करवा चौथ व्रत (संकष्टी चतुर्थी)',
    date: '2026-10-29',
    displayDate: '29 अक्टूबर 2026',
    monthNumber: 10,
    monthName: 'अक्टूबर',
    hindiMaas: 'कार्तिक कृष्ण पक्ष',
    pakshaTithi: 'चतुर्थी तिथि',
    vara: 'गुरुवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'सुहागिन महिलाओं द्वारा पति की लंबी आयु, उत्तम स्वास्थ्य और अखंड सौभाग्य के लिए निर्जला व्रत रखकर करवा माता, शिव परिवार व चंद्रोदय पर चंद्रमा को अर्घ्य देने का पर्व।'
  },

  // 11. नवंबर (कार्तिक - मार्गशीर्ष)
  {
    id: 'ty_nov_1',
    name: 'धनतेरस (धन्वंतरि त्रयोदशी)',
    date: '2026-11-06',
    displayDate: '06 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक कृष्ण पक्ष',
    pakshaTithi: 'त्रयोदशी तिथि',
    vara: 'शुक्रवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'पंच दिवसीय दीपावली महापर्व का शुभारंभ और आयुर्वेद के जनक भगवान धन्वंतरि का प्राकट्य दिवस। इस दिन कुबेर पूजन, यम दीपदान और स्वर्ण-चांदी व पात्र खरीदना अत्यंत शुभ है।'
  },
  {
    id: 'ty_nov_2',
    name: 'दीपावली महापर्व (महालक्ष्मी पूजन)',
    date: '2026-11-08',
    displayDate: '08 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक कृष्ण पक्ष',
    pakshaTithi: 'अमावस्या तिथि',
    vara: 'रविवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भगवान श्रीराम के अयोध्या आगमन और अंधकार पर प्रकाश की विजय का सर्वोच्च सनातन पर्व। प्रदोष व स्थिर लग्न में श्री गणेश-महालक्ष्मी-कुबेर पूजन से वर्षभर सुख-वैभव बना रहता है।'
  },
  {
    id: 'ty_nov_3',
    name: 'गोवर्धन पूजा (अन्नकूट) एवं भाई दूज',
    date: '2026-11-10',
    displayDate: '10 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक शुक्ल पक्ष',
    pakshaTithi: 'प्रतिपदा / द्वितीया तिथि',
    vara: 'मंगलवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'प्रकृति संरक्षण के प्रतीक गिरिराज गोवर्धन और गौ-माता की पूजा कर छप्पन भोग अन्नकूट अर्पित किया जाता है, तथा यम द्वितीया (भाई दूज) पर बहनें भाई को तिलक करती हैं।'
  },
  {
    id: 'ty_nov_4',
    name: 'छठ महापर्व (सूर्य षष्ठी व्रत)',
    date: '2026-11-15',
    displayDate: '15 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक शुक्ल पक्ष',
    pakshaTithi: 'षष्ठी तिथि',
    vara: 'रविवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'प्रत्यक्ष देवता भगवान सूर्य और छठी मैया की कठिन साधना व पवित्रता का चार दिवसीय लोक महापर्व। अस्ताचलगामी एवं उदीयमान सूर्य को अर्घ्य देकर संतान व परिवार के कल्याण की कामना की जाती है।'
  },
  {
    id: 'ty_nov_5',
    name: 'देवउठनी (प्रबोधिनी) एकादशी एवं तुलसी विवाह',
    date: '2026-11-20',
    displayDate: '20 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'शुक्रवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'चार माह की योगनिद्रा के पश्चात भगवान विष्णु के जागरण का पावन पर्व। इसी दिन माता तुलसी और भगवान शालिग्राम का विवाह संपन्न होता है और विवाह आदि मांगलिक कार्य पुनः प्रारंभ होते हैं।'
  },
  {
    id: 'ty_nov_6',
    name: 'कार्तिक पूर्णिमा एवं देव दीपावली महापर्व',
    date: '2026-11-24',
    displayDate: '24 नवंबर 2026',
    monthNumber: 11,
    monthName: 'नवंबर',
    hindiMaas: 'कार्तिक शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'मंगलवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'भगवान शिव द्वारा त्रिपुरासुर वध के उपलक्ष्य में देवताओं द्वारा मनाई जाने वाली देव दीपावली। गंगा घाटों पर लाखों दीपों का दान और कार्तिक स्नान की पूर्णाहुति का अद्भुत पर्व।'
  },

  // 12. दिसंबर (मार्गशीर्ष - पौष)
  {
    id: 'ty_dec_1',
    name: 'उत्पन्ना एकादशी व्रत',
    date: '2026-12-04',
    displayDate: '04 दिसंबर 2026',
    monthNumber: 12,
    monthName: 'दिसंबर',
    hindiMaas: 'मार्गशीर्ष कृष्ण पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'शुक्रवार',
    category: 'एकादशी एवं व्रत',
    shortInfo: 'भगवान विष्णु के अंश से एकादशी माता के प्राकट्य की पावन तिथि। जो श्रद्धालु वार्षिक एकादशी व्रत प्रारंभ करना चाहते हैं, उनके लिए उत्पन्ना एकादशी से व्रत उठाना शास्त्रसम्मत है।'
  },
  {
    id: 'ty_dec_2',
    name: 'धनु संक्रांति एवं खरमास प्रारंभ',
    date: '2026-12-16',
    displayDate: '16 दिसंबर 2026',
    monthNumber: 12,
    monthName: 'दिसंबर',
    hindiMaas: 'मार्गशीर्ष शुक्ल पक्ष',
    pakshaTithi: 'सप्तमी / धनु संक्रांति',
    vara: 'बुधवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'सूर्य देव के बृहस्पति की राशि धनु में प्रवेश करने से धनु संक्रांति और एक माह के खरमास का आरंभ। यह मास भागवत कथा श्रवण, सूर्य आराधना और तीर्थ यात्रा के लिए अत्यंत शुभ है।'
  },
  {
    id: 'ty_dec_3',
    name: 'गीता जयंती एवं मोक्षदा एकादशी महापर्व',
    date: '2026-12-20',
    displayDate: '20 दिसंबर 2026',
    monthNumber: 12,
    monthName: 'दिसंबर',
    hindiMaas: 'मार्गशीर्ष शुक्ल पक्ष',
    pakshaTithi: 'एकादशी तिथि',
    vara: 'रविवार',
    category: 'प्रमुख महापर्व',
    shortInfo: 'कुरुक्षेत्र की रणभूमि में भगवान श्रीकृष्ण द्वारा अर्जुन को श्रीमद्भगवद्गीता का दिव्य उपदेश देने की पावन तिथि। इस दिन गीता पाठ और मोक्षदा एकादशी व्रत से पितरों को मोक्ष प्राप्त होता है।'
  },
  {
    id: 'ty_dec_4',
    name: 'श्री दत्तात्रेय जयंती एवं मार्गशीर्ष पूर्णिमा',
    date: '2026-12-23',
    displayDate: '23 दिसंबर 2026',
    monthNumber: 12,
    monthName: 'दिसंबर',
    hindiMaas: 'मार्गशीर्ष शुक्ल पक्ष',
    pakshaTithi: 'पूर्णिमा तिथि',
    vara: 'बुधवार',
    category: 'संक्रांति एवं जयंती',
    shortInfo: 'त्रिदेवों (ब्रह्मा, विष्णु, महेश) के समन्वित अवतार भगवान श्री दत्तात्रेय का प्राकट्योत्सव। मार्गशीर्ष पूर्णिमा पर स्नान-दान और दत्त बावनी के पाठ से गुरु कृपा व आध्यात्मिक उन्नति मिलती है।'
  }
];

const HINDI_WEEKDAYS = [
  'रविवार',
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार'
];

const HINDI_MONTH_NAMES_BY_NUM: Record<number, string> = {
  1: 'जनवरी',
  2: 'फरवरी',
  3: 'मार्च',
  4: 'अप्रैल',
  5: 'मई',
  6: 'जून',
  7: 'जुलाई',
  8: 'अगस्त',
  9: 'सितंबर',
  10: 'अक्टूबर',
  11: 'नवंबर',
  12: 'दिसंबर'
};

/**
 * Generates the festival list for any requested Gregorian year (e.g., 2024, 2025, 2026, 2027, 2028...).
 * Fixed solar festivals stay on their solar dates, while lunar tithi festivals shift according to the
 * Vedic lunar cycle (~11 days per year, wrapped within the lunar month window).
 */
export function getTyoharListForYear(year: number): TyoharItem[] {
  if (!year || Number.isNaN(year) || year === 2026) {
    return ANNUAL_TYOHAR_LIST;
  }

  const yearDiff = year - 2026;
  // Metonic 19-year lunar shift approximation in days (-11 days/year with +30 day Adhik Maas every ~3 years)
  const rawShift = Math.round(yearDiff * -10.875);
  const netShift = ((rawShift % 30) + 30) % 30;
  const cyclicShift = netShift > 15 ? netShift - 30 : netShift;

  return ANNUAL_TYOHAR_LIST.map((item) => {
    const parts = item.date.split('-').map(Number);
    const baseMonth = parts[1] || 1;
    const baseDay = parts[2] || 1;

    // Solar Sankranti festivals stay near fixed solar calendar dates
    const isFixedSolar =
      item.id === 'ty_jan_2' ||
      item.id === 'ty_jan_3' ||
      item.id === 'ty_apr_2';

    const targetDate = new Date(Date.UTC(year, baseMonth - 1, baseDay, 12, 0, 0));
    if (!isFixedSolar) {
      targetDate.setUTCDate(targetDate.getUTCDate() + cyclicShift);
      // Keep inside target year
      if (targetDate.getUTCFullYear() < year) {
        targetDate.setUTCDate(targetDate.getUTCDate() + 29);
      } else if (targetDate.getUTCFullYear() > year) {
        targetDate.setUTCDate(targetDate.getUTCDate() - 29);
      }
    }

    const mNum = targetDate.getUTCMonth() + 1;
    const dNum = targetDate.getUTCDate();
    const wDay = HINDI_WEEKDAYS[targetDate.getUTCDay()] || item.vara;
    const mName = HINDI_MONTH_NAMES_BY_NUM[mNum] || item.monthName;
    const isoDate = `${year}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;

    return {
      ...item,
      id: `${item.id}_${year}`,
      date: isoDate,
      displayDate: `${dNum} ${mName} ${year}`,
      monthNumber: mNum,
      monthName: mName,
      vara: wDay
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

// --- ADMIN CUSTOMIZATION, PANCHANG API META BUILDER & DETAILED FESTIVAL CONTENT ---

const TYOHAR_STORAGE_KEY = 'jw_tyohar_overrides_v1';

interface TyoharStorageState {
  customOrUpdated: Record<string, TyoharItem>;
  deletedIds: string[];
}

function loadTyoharStorage(): TyoharStorageState {
  try {
    const raw = localStorage.getItem(TYOHAR_STORAGE_KEY);
    if (!raw) return { customOrUpdated: {}, deletedIds: [] };
    const parsed = JSON.parse(raw);
    return {
      customOrUpdated: parsed.customOrUpdated || {},
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : []
    };
  } catch {
    return { customOrUpdated: {}, deletedIds: [] };
  }
}

function saveTyoharStorage(state: TyoharStorageState): void {
  try {
    localStorage.setItem(TYOHAR_STORAGE_KEY, JSON.stringify(state));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('jyotishwala_tyohar_changed'));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function getBaseTyoharId(id: string): string {
  return id.replace(/_\d{4}$/, '');
}

/**
 * Automatically computes Month, Vedic Maas, Paksha, Tithi, and Vara from the Panchang Engine/API
 * for any given YYYY-MM-DD date so the Admin or App gets accurate astronomical data automatically.
 */
export function buildTyoharMetaFromDate(isoDate: string): {
  displayDate: string;
  monthNumber: number;
  monthName: string;
  hindiMaas: string;
  pakshaTithi: string;
  vara: string;
} {
  const parts = isoDate.split('-').map(Number);
  const yr = parts[0] || new Date().getFullYear();
  const mNum = parts[1] || 1;
  const dNum = parts[2] || 1;
  const mName = HINDI_MONTH_NAMES_BY_NUM[mNum] || 'जनवरी';
  const panchang = getPanchangForDate(isoDate);

  return {
    displayDate: `${String(dNum).padStart(2, '0')} ${mName} ${yr}`,
    monthNumber: mNum,
    monthName: mName,
    hindiMaas: `${panchang.samvat.maahPurnimant} ${panchang.tithi.paksha}`,
    pakshaTithi: `${panchang.tithi.name} (${panchang.tithi.endTime} तक)`,
    vara: panchang.vara.name
  };
}

/**
 * Returns the complete festival list for a given year merged with Admin additions, edits, and deletions.
 */
export function getManagedTyoharListForYear(year: number): TyoharItem[] {
  const baseList = getTyoharListForYear(year);
  const { customOrUpdated, deletedIds } = loadTyoharStorage();
  const deletedSet = new Set(deletedIds);

  const merged: TyoharItem[] = [];
  const handledBaseIds = new Set<string>();

  for (const item of baseList) {
    const baseId = getBaseTyoharId(item.id);
    if (
      deletedSet.has(item.id) ||
      deletedSet.has(baseId) ||
      deletedSet.has(item.date) ||
      deletedSet.has(item.name)
    ) {
      continue;
    }
    const itemMmDd = item.date.slice(5);
    const override =
      customOrUpdated[item.id] ||
      customOrUpdated[baseId] ||
      Object.values(customOrUpdated).find(
        (c) =>
          c &&
          (c.date === item.date ||
            c.name === item.name ||
            (c.date && c.date.slice(5) === itemMmDd && c.name === item.name))
      );
    if (override) {
      handledBaseIds.add(baseId);
      handledBaseIds.add(item.id);
      handledBaseIds.add(override.id);
      const overrideYear = Number((override.date || item.date).split('-')[0]);
      if (overrideYear === year) {
        merged.push({ ...item, ...override, id: item.id });
      } else {
        merged.push({
          ...item,
          name: override.name || item.name,
          category: override.category || item.category,
          shortInfo: override.shortInfo || item.shortInfo,
          whyCelebrated: override.whyCelebrated,
          detailedSignificance: override.detailedSignificance || override.whyCelebrated,
          historyAndPauranik: override.historyAndPauranik,
          pujaVidhi: override.pujaVidhi,
          vratAndRules: override.vratAndRules,
          kathaOrMantra: override.kathaOrMantra,
          sankalp: override.sankalp,
          doAndDonts: override.doAndDonts,
          daanAndUpay: override.daanAndUpay
        });
      }
    } else {
      merged.push(item);
    }
  }

  // Add custom festivals added by Admin that belong to this year
  for (const [key, customItem] of Object.entries(customOrUpdated)) {
    if (!customItem || !customItem.date) continue;
    if (
      handledBaseIds.has(key) ||
      handledBaseIds.has(customItem.id) ||
      handledBaseIds.has(getBaseTyoharId(key))
    ) {
      continue;
    }
    if (
      deletedSet.has(key) ||
      deletedSet.has(customItem.id) ||
      deletedSet.has(customItem.date) ||
      deletedSet.has(customItem.name)
    ) {
      continue;
    }
    const itemYear = Number(customItem.date.split('-')[0]);
    if (itemYear === year) {
      merged.push(customItem);
    }
  }

  return merged.sort((a, b) => a.date.localeCompare(b.date));
}

export function saveTyoharItem(item: TyoharItem): void {
  const state = loadTyoharStorage();
  const baseId = getBaseTyoharId(item.id);
  const storageKey = item.isCustom ? item.id : baseId;
  state.customOrUpdated[storageKey] = {
    ...item,
    id: storageKey
  };
  state.deletedIds = state.deletedIds.filter(
    (id) => id !== item.id && id !== baseId && id !== item.date && id !== item.name
  );
  saveTyoharStorage(state);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_tyohar_changed'));
  }
}

export function deleteTyoharItem(id: string): void {
  const state = loadTyoharStorage();
  const baseId = getBaseTyoharId(id);
  delete state.customOrUpdated[id];
  delete state.customOrUpdated[baseId];
  if (!state.deletedIds.includes(baseId)) {
    state.deletedIds.push(baseId);
  }
  if (!state.deletedIds.includes(id)) {
    state.deletedIds.push(id);
  }
  saveTyoharStorage(state);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_tyohar_changed'));
  }
}

export function resetTyoharOverrides(): void {
  saveTyoharStorage({ customOrUpdated: {}, deletedIds: [] });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_tyohar_changed'));
  }
}

export function syncTyoharFromWp(
  wpItems: Partial<TyoharItem>[],
  wpDeletedIds: string[] = []
): void {
  const deletedSet = new Set<string>(
    Array.isArray(wpDeletedIds)
      ? wpDeletedIds.map((d) => String(d).trim()).filter(Boolean)
      : []
  );

  const nextCustomOrUpdated: Record<string, TyoharItem> = {};

  if (Array.isArray(wpItems)) {
    for (const raw of wpItems) {
      if (!raw || !raw.name || !raw.date) continue;
      const isoDate = String(raw.date).trim();
      const meta = buildTyoharMetaFromDate(isoDate);
      const validCategories: TyoharItem['category'][] = [
        'प्रमुख महापर्व',
        'एकादशी एवं व्रत',
        'संक्रांति एवं जयंती',
        'शक्ति एवं शिव पर्व'
      ];
      const cat = validCategories.includes(raw.category as TyoharItem['category'])
        ? (raw.category as TyoharItem['category'])
        : 'प्रमुख महापर्व';

      const id = String(raw.id || `tyo_${isoDate}`).trim();
      const item: TyoharItem = {
        id,
        name: String(raw.name).trim(),
        date: isoDate,
        displayDate: raw.displayDate || meta.displayDate,
        monthNumber: Number(raw.monthNumber) || meta.monthNumber,
        monthName: raw.monthName || meta.monthName,
        hindiMaas: raw.hindiMaas || meta.hindiMaas,
        pakshaTithi: raw.pakshaTithi || meta.pakshaTithi,
        vara: raw.vara || meta.vara,
        category: cat,
        shortInfo: String(raw.shortInfo || '').trim(),
        whyCelebrated: raw.whyCelebrated || raw.detailedSignificance || '',
        detailedSignificance: raw.detailedSignificance || raw.whyCelebrated || '',
        historyAndPauranik: raw.historyAndPauranik || '',
        pujaVidhi: raw.pujaVidhi || '',
        vratAndRules: raw.vratAndRules || '',
        kathaOrMantra: raw.kathaOrMantra || '',
        sankalp: raw.sankalp || '',
        doAndDonts: raw.doAndDonts || '',
        daanAndUpay: raw.daanAndUpay || '',
        isCustom: true
      };
      if (!deletedSet.has(id) && !deletedSet.has(isoDate) && !deletedSet.has(item.name)) {
        nextCustomOrUpdated[id] = item;
      }
    }
  }

  saveTyoharStorage({
    customOrUpdated: nextCustomOrUpdated,
    deletedIds: Array.from(deletedSet)
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_tyohar_changed'));
  }
}

/**
 * Returns complete detailed sections (Significance/Why celebrated, Puja Vidhi, Mantra/Katha + additional Vedic fields)
 * for any festival — using Admin's custom detailed content when present, or generating
 * rich authentic Shastriya details based on the festival's Panchang Tithi & Category.
 */
export function getTyoharDetailedSections(fest: TyoharItem): {
  detailedSignificance: string;
  pujaVidhi: string;
  kathaOrMantra: string;
  historyAndPauranik?: string;
  vratAndRules?: string;
  sankalp?: string;
  doAndDonts?: string;
  daanAndUpay?: string;
} {
  let defaultSignificance = `${fest.name} सनातन वैदिक परंपरा का अत्यंत पावन पर्व है, जो ${fest.hindiMaas} में ${fest.pakshaTithi} (${fest.vara}) के शुभ संयोग में मनाया जाता है। ${fest.shortInfo} शास्त्रों के अनुसार इस पावन तिथि पर श्रद्धापूर्वक व्रत, देव-आराधना एवं दान-पुण्य करने से साधक के जन्म-जन्मांतर के कष्टों का निवारण होता है और घर-परिवार में सुख, शांति, आरोग्य तथा ऐश्वर्य की वृद्धि होती है।`;

  let defaultPujaVidhi = `1. प्रातः ब्रह्म मुहूर्त में उठकर पवित्र नदी या शुद्ध जल में गंगाजल मिलाकर स्नान करें और स्वच्छ वस्त्र धारण करें।\n2. पूजा स्थल को शुद्ध कर दीप प्रज्वलित करें तथा हाथ में जल, अक्षत और पुष्प लेकर "${fest.hindiMaas}, ${fest.pakshaTithi}, ${fest.vara}" का उच्चारण करते हुए व्रत या पूजन का वैदिक संकल्प लें।\n3. इष्ट देव का षोडशोपचार या पंचोपचार पूजन (चंदन, अक्षत, पुष्प, धूप, दीप एवं नैवेद्य) करें।\n4. सायंकाल आरती के पश्चात प्रसाद वितरण करें और सामर्थ्यानुसार अन्न, वस्त्र या दक्षिणा का दान करें।`;

  let defaultMantra = `• विशेष उपासना मंत्र: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥"\n• धार्मिक फलश्रुति: इस पावन पर्व पर निश्छल भाव से की गई उपासना से नवग्रहों की अनुकूलता, मानसिक शांति एवं अक्षय पुण्य फल की प्राप्ति होती है।`;

  if (fest.category === 'एकादशी एवं व्रत') {
    defaultSignificance = `${fest.name} भगवान श्री हरि विष्णु को समर्पित सर्वश्रेष्ठ व्रतों में से एक है। पद्म पुराण एवं स्कंद पुराण के अनुसार ${fest.hindiMaas} की ${fest.pakshaTithi} को यह व्रत रखने से मनुष्य के समस्त ज्ञात-अज्ञात पाप नष्ट हो जाते हैं और अंत में मोक्ष (बैकुंठ धाम) की प्राप्ति होती है। ${fest.shortInfo} चंद्रमा की कलाओं का मन और शरीर पर सीधा प्रभाव पड़ता है, इसलिए एकादशी एवं व्रत तिथियों पर उपवास रखने से आध्यात्मिक एकाग्रता और सात्विक ऊर्जा का संचार होता है।`;
    defaultPujaVidhi = `1. दशमी की रात्रि से ही सात्विक नियम का पालन करें और एकादशी के दिन प्रातः स्नान कर पीतांबर धारण करें।\n2. भगवान श्री लक्ष्मीनारायण की प्रतिमा या शालिग्राम शिला का पंचामृत एवं शुद्ध जल से अभिषेक करें।\n3. पीले पुष्प, तुलसी दल, केसर चंदन, ऋतुफल एवं मिष्ठान्न अर्पित करें तथा एकादशी व्रत कथा का श्रवण करें।\n4. दिनभर निराहार या फलाहार रहकर रात्रि में हरि-कीर्तन करें और अगले दिन द्वादशी को शुभ मुहूर्त में ब्राह्मण भोजन व दान के पश्चात व्रत का पारण करें।`;
    defaultMantra = `• मूल मंत्र: "ॐ नमो भगवते वासुदेवाय नमः" (108 बार रुद्राक्ष या तुलसी माला से जप)\n• स्तोत्र पाठ: श्री विष्णु सहस्रनाम स्तोत्र एवं गजेंद्र मोक्ष का पाठ विशेष फलदायी है।`;
  } else if (fest.category === 'शक्ति एवं शिव पर्व') {
    defaultSignificance = `${fest.name} भगवान देवाधिदेव महादेव एवं आदिशक्ति जगदंबा की कृपा प्राप्त करने का महान आध्यात्मिक पर्व है। ${fest.shortInfo} शिव पुराण एवं देवी भागवत के अनुसार ${fest.hindiMaas} की ${fest.pakshaTithi} (${fest.vara}) को की गई शिव-शक्ति उपासना से अकाल मृत्यु का भय समाप्त होता है, असाध्य रोगों से मुक्ति मिलती है तथा साधक की समस्त मनोकामनाएं पूर्ण होती हैं।`;
    defaultPujaVidhi = `1. प्रातः या प्रदोष काल में स्नान कर भगवान शिव एवं माता पार्वती / दुर्गा की विधिपूर्वक पूजा प्रारंभ करें।\n2. शिवलिंग पर शुद्ध जल, कच्चा दूध, दही, शहद, घी, शर्करा (पंचामृत), बिल्वपत्र, धतूरा एवं भस्म अर्पित करें।\n3. शक्ति पर्व होने पर माता को लाल चुनरी, सिंदूर, गुड़हल का पुष्प, लौंग-इलायची एवं नैवेद्य अर्पित करें।\n4. धूप-दीप जलाकर शिव चालीसा, रुद्राष्टकम या दुर्गा सप्तशती के मंत्रों का पाठ करें।`;
    defaultMantra = `• महामृत्युंजय एवं शिव मंत्र: "ॐ नमः शिवाय" तथा "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥"\n• शक्ति मंत्र: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥"`;
  } else if (fest.category === 'संक्रांति एवं जयंती') {
    defaultSignificance = `${fest.name} खगोलीय परिवर्तन, सूर्य उपासना एवं दिव्य अवतारों के प्राकट्य से जुड़ा पुण्यदायी पर्व है। ${fest.shortInfo} धर्मशास्त्रों में संक्रांति एवं जयंती तिथियों को पवित्र तीर्थ स्नान, पितृ तर्पण, गौ-सेवा, अन्नदान और गुरु-आराधना के लिए अक्षय फल देने वाला बताया गया है। इस दिन किया गया थोड़ा सा भी दान और जप सहस्र गुना फल प्रदान करता है।`;
    defaultPujaVidhi = `1. सूर्योदय से पूर्व पवित्र तीर्थ या गंगाजल मिश्रित जल से स्नान करें।\n2. तांबे के लोटे में जल, लाल चंदन, अक्षत और लाल पुष्प डालकर भगवान सूर्यदेव को अर्घ्य प्रदान करें।\n3. अपने आराध्य देव या अवतार स्वरूप का पूजन कर उनके चरित्र एवं पावन कथा का पाठ करें।\n4. तिल, गुड़, अन्न, वस्त्र, घी एवं धार्मिक पुस्तकों का सुपात्र को दान करें।`;
    defaultMantra = `• सूर्य एवं महामंत्र: "ॐ घृणि सूर्याय नमः" तथा "ॐ श्री गुरवे नमः"\n• विशेष नियम: इस पावन तिथि पर सात्विक आहार ग्रहण करें एवं गोमाता को हरा चारा या गुड़-रोटी खिलाएं।`;
  }

  const sig =
    (fest.whyCelebrated && fest.whyCelebrated.trim()) ||
    (fest.detailedSignificance && fest.detailedSignificance.trim()) ||
    defaultSignificance;

  return {
    detailedSignificance: sig,
    pujaVidhi:
      fest.pujaVidhi && fest.pujaVidhi.trim()
        ? fest.pujaVidhi.trim()
        : defaultPujaVidhi,
    kathaOrMantra:
      fest.kathaOrMantra && fest.kathaOrMantra.trim()
        ? fest.kathaOrMantra.trim()
        : defaultMantra,
    historyAndPauranik: fest.historyAndPauranik?.trim() || undefined,
    vratAndRules: fest.vratAndRules?.trim() || undefined,
    sankalp: fest.sankalp?.trim() || undefined,
    doAndDonts: fest.doAndDonts?.trim() || undefined,
    daanAndUpay: fest.daanAndUpay?.trim() || undefined
  };
}


