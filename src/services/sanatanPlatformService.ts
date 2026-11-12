/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * JyotishWala — Centralized Sanatan Dharma Platform Service Layer
 * Connects Frontend Modules to WordPress Backend Plugin REST API (`/wp-json/jyotishwala/v1/*`)
 * with offline-friendly caching, Personal Library bookmarks, reading history,
 * Sanskrit learning progress, Yajman Puja bookings, Pandit registration/dashboard,
 * Support tickets, and the complete Admin Feature Registry & Plugin Integration Manifest.
 */

import { getWpApiBaseUrl } from './wpApiClient';

// ============================================================================
// 1. KNOWLEDGE SECTION (ज्ञान विभाग — 7 DEPARTMENTS)
// ============================================================================

export type GyanDepartmentId =
  | 'veda'
  | 'upanishad'
  | 'gita'
  | 'purana'
  | 'itihasa'
  | 'darshana'
  | 'dainik_dharma';

export interface GyanContentItem {
  id: string;
  department: GyanDepartmentId;
  departmentLabelHi: string;
  departmentLabelEn: string;
  category: string;
  subcategory?: string;
  titleHi: string;
  titleEn: string;
  chapterOrSection?: string;
  sanskritText: string;
  transliteration?: string;
  meaningHi: string;
  meaningEn?: string;
  commentaryHi: string;
  sourceReference: string;
  tags: string[];
  displayOrder: number;
}

export const GYAN_DEPARTMENTS: Array<{
  id: GyanDepartmentId;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subcategories: string[];
}> = [
  {
    id: 'veda',
    titleHi: '१. वेद विभाग (चतुर्वेद)',
    titleEn: '1. Vedas (Four Vedas)',
    subtitleHi: 'ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद, वैदिक सूक्त, मंत्र एवं वैदिक दर्शन',
    subcategories: ['ऋग्वेद', 'यजुर्वेद', 'सामवेद', 'अथर्ववेद', 'वैदिक सूक्त', 'वैदिक मंत्र', 'वैदिक दर्शन', 'वैदिक कर्मकांड']
  },
  {
    id: 'upanishad',
    titleHi: '२. उपनिषद विभाग (वेदान्त)',
    titleEn: '2. Upanishads',
    subtitleHi: 'ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, छान्दोग्य एवं बृहदारण्यक उपनिषद',
    subcategories: ['प्रमुख उपनिषद (एकादश)', 'अन्य उपनिषद', 'भाष्य एवं व्याख्या', 'अध्यायवार अध्ययन']
  },
  {
    id: 'gita',
    titleHi: '३. श्रीमद्भगवद्गीता (१८ अध्याय)',
    titleEn: '3. Shrimad Bhagavad Gita',
    subtitleHi: 'समस्त १८ अध्यायों का सार, प्रमुख श्लोक, संस्कृत मूल पाठ, हिंदी-अंग्रेजी अर्थ एवं भाष्य',
    subcategories: ['अध्याय १-६ (कर्मयोग प्रभाग)', 'अध्याय ७-१२ (भक्तियोग प्रभाग)', 'अध्याय १३-१८ (ज्ञानयोग प्रभाग)', 'प्रमुख गीता श्लोक']
  },
  {
    id: 'purana',
    titleHi: '४. अष्टादश महापुराण',
    titleEn: '4. Puranas',
    subtitleHi: 'श्रीमद्भागवत, विष्णु, शिव, देवी भागवत, मार्कण्डेय, स्कंद एवं अन्य प्रमुख पुराण',
    subcategories: ['श्रीमद्भागवत महापुराण', 'विष्णु पुराण', 'शिव महापुराण', 'श्रीमद्देवी भागवत', 'मार्कण्डेय पुराण', 'स्कंद पुराण', 'अष्टादश पुराण सूची']
  },
  {
    id: 'itihasa',
    titleHi: '५. इतिहास (रामायण एवं महाभारत)',
    titleEn: '5. Itihasa (Ramayana & Mahabharata)',
    subtitleHi: 'वाल्मीकि रामायण, महाभारत, विदुर नीति, प्रमुख प्रसंग, पात्र, शिक्षाएँ एवं श्लोक',
    subcategories: ['वाल्मीकि रामायण', 'महाभारत', 'प्रमुख प्रसंग एवं पात्र', 'विदुर नीति एवं शिक्षाएँ']
  },
  {
    id: 'darshana',
    titleHi: '६. भारतीय दर्शन (षड्दर्शन व वेदान्त)',
    titleEn: '6. Indian Philosophy (Darshana)',
    subtitleHi: 'न्याय, वैशेषिक, सांख्य, योग, पूर्व मीमांसा, अद्वैत, विशिष्टाद्वैत एवं द्वैत वेदान्त',
    subcategories: ['न्याय एवं वैशेषिक', 'सांख्य एवं योग दर्शन', 'पूर्व मीमांसा', 'अद्वैत वेदान्त', 'विशिष्टाद्वैत एवं द्वैत']
  },
  {
    id: 'dainik_dharma',
    titleHi: '७. दैनिक सनातन धर्म एवं संस्कार',
    titleEn: '7. Daily Sanatan Dharma & Sanskaras',
    subtitleHi: 'नित्य कर्म, त्रिकाल संध्या, आचार-धर्म, षोडश (१६) संस्कार, व्रत एवं धार्मिक नियम',
    subcategories: ['नित्य कर्म एवं प्रातः स्मरण', 'त्रिकाल संध्या विधि', 'षोडश (१६) संस्कार', 'आचार, व्रत एवं धार्मिक नियम']
  }
];

export const INITIAL_GYAN_ITEMS: GyanContentItem[] = [
  // 10.1 VEDA
  {
    id: 'veda_rig_1',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'ऋग्वेद',
    subcategory: 'प्रथम मण्डल — अग्नि सूक्त',
    titleHi: 'ऋग्वेद प्रथम सूक्त — अग्निमीळे पुरोहितम्',
    titleEn: 'Rigveda 1.1.1 — Agnim Ile Purohitam',
    chapterOrSection: 'मण्डल १, सूक्त १, मंत्र १',
    sanskritText: 'ॐ अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्। होतारं रत्नधातमम्॥',
    transliteration: 'Oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam, hotāraṃ ratnadhātamam.',
    meaningHi: 'मैं यज्ञ के पुरोहित (अग्रगामी), दिव्य प्रकाशमान, अनुकूल समय पर यज्ञ संपन्न कराने वाले ऋत्विज्, देवों का आवाहन करने वाले होता और सर्वश्रेष्ठ रत्नों (कल्याणकारी फलों) को धारण करने वाले अग्निदेव की स्तुति करता हूँ।',
    meaningEn: 'I laud Agni, the foremost high priest of the sacred sacrifice, the divine ministrant, the invoker who bestows the highest spiritual treasures.',
    commentaryHi: 'यह संपूर्ण वेद वाङ्मय और ऋग्वेद संहिता का सर्वप्रथम मंत्र है। महर्षि मधुच्छन्दा वैश्वामित्र इसके द्रष्टा ऋषि हैं तथा छन्द गायत्री है। इसमें परमेश्वर के तेजःस्वरूप अग्नि की वंदना की गई है।',
    sourceReference: 'ऋग्वेद संहिता १.१.१ (ऋषि: मधुच्छन्दा वैश्वामित्र, देवता: अग्नि, छन्द: गायत्री)',
    tags: ['ऋग्वेद', 'अग्नि सूक्त', 'वैदिक मंत्र'],
    displayOrder: 1
  },
  {
    id: 'veda_rig_sangachhadhwam',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'ऋग्वेद',
    subcategory: 'दशम मण्डल — संज्ञान सूक्त',
    titleHi: 'संज्ञान सूक्त — संगच्छध्वं संवदध्वम् (वैदिक एकता मंत्र)',
    titleEn: 'Rigveda 10.191.2 — Sangachhadhwam Samvadadhwam',
    chapterOrSection: 'मण्डल १०, सूक्त १९१, मंत्र २-४',
    sanskritText: 'संगच्छध्वं संवदध्वं सं वो मनांसि जानताम्।\nदेवा भागं यथा पूर्वे सञ्जानाना उपासते॥\nसमानी व आकूतिः समाना हृदयानि वः।\nसमानमस्तु वो मनो यथा वः सुसहासति॥',
    transliteration: 'Saṃgacchadhvaṃ saṃvadadhvaṃ saṃ vo manāṃsi jānatām, devā bhāgaṃ yathā pūrve sañjānānā upāsate.',
    meaningHi: 'हे मनुष्यों! तुम सब एक साथ कदम मिलाकर चलो, एक स्वर में प्रेमपूर्वक बोलो और तुम्हारे मन एक समान ज्ञान से युक्त हों। जिस प्रकार प्राचीन काल के ज्ञानी देवताओं ने एकमत होकर अपने कर्तव्य भाग को स्वीकार किया, वैसे ही तुम्हारे संकल्प, हृदय और मन एक समान हों ताकि तुम्हारा संगठन अटूट रहे।',
    meaningEn: 'Walk together in harmony, speak in unison, let your minds be of one accord, just as the ancient deities unitedly accepted their sacred duties. May your intentions, hearts, and minds be united.',
    commentaryHi: 'ऋग्वेद का यह अंतिम सूक्त (संज्ञान सूक्त) विश्व-बंधुत्व, पारिवारिक सामंजस्य और राष्ट्र-एकता का सर्वोच्च वैदिक उद्घोष है।',
    sourceReference: 'ऋग्वेद संहिता १०.१९१.२-४ (ऋषि: संवनन आंगिरस)',
    tags: ['ऋग्वेद', 'संज्ञान सूक्त', 'वैदिक दर्शन'],
    displayOrder: 2
  },
  {
    id: 'veda_yajur_shanti',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'यजुर्वेद',
    subcategory: 'शुक्ल यजुर्वेद — शांति पाठ',
    titleHi: 'यजुर्वेद सार्वभौम शांति मंत्र — द्यौः शान्तिरन्तरिक्षं शान्तिः',
    titleEn: 'Yajurveda 36.17 — Universal Vedic Peace Invocation',
    chapterOrSection: 'शुक्ल यजुर्वेद अध्याय ३६, मंत्र १७',
    sanskritText: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः।\nवनस्पतयः शान्तिर्विश्वे देवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि॥\nॐ शान्तिः शान्तिः शान्तिः॥',
    meaningHi: 'द्युलोक (आकाश) शांत हो, अंतरिक्ष शांत हो, पृथ्वी शांत हो, जल शांत हो, समस्त औषधियां शांत और कल्याणकारी हों, वनस्पतियां शांत हों, विश्वेदेवा शांत हों, परब्रह्म शांत हो, संपूर्ण चराचर जगत शांत हो; वह परम शांति मुझे प्राप्त हो। आध्यात्मिक, आधिभौतिक और आधिदैविक तीनों ताप शांत हों।',
    meaningEn: 'May peace radiate in the celestial realm, in space, on earth, in waters, in medicinal herbs, in plants, among all deities, and in Brahman. May that supreme peace abide in us.',
    commentaryHi: 'प्रत्येक वैदिक कर्मकांड, यज्ञ और पूजा के आरंभ व समापन में इस महामंत्र का पाठ ब्रह्मांडीय संतुलन और पर्यावरण-शांति हेतु किया जाता है।',
    sourceReference: 'शुक्ल यजुर्वेद वाजसनेयी संहिता ३६.१७',
    tags: ['यजुर्वेद', 'शांति पाठ', 'वैदिक कर्मकांड'],
    displayOrder: 3
  },
  {
    id: 'veda_sama_gana',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'सामवेद',
    subcategory: 'पवमान पर्व — उपासना',
    titleHi: 'सामवेद — अग्न आ याहि वीतये (प्रथम सामगान)',
    titleEn: 'Samaveda 1.1.1 — Agna Aa Yahi Vitaye',
    chapterOrSection: 'आर्चिक पर्व १, प्रपाठक १, दशति १',
    sanskritText: 'ॐ अग्न आ याहि वीतये गृणानो हव्यदातये।\nनि होता सत्सि बर्हिषि॥',
    meaningHi: 'हे स्तुति किए जाने योग्य अग्निदेव! आप हमारे हविष्य (यज्ञीय आहुति) को स्वीकार करने और देवताओं तक पहुँचाने के लिए पधारें तथा यज्ञवेदी के पवित्र कुशासन पर होता के रूप में विराजमान हों।',
    meaningEn: 'O Agni, come forth to accept our sacred oblations, praised by our hymns; sit down as the invoking priest upon the sacred grass.',
    commentaryHi: 'सामवेद भारतीय शास्त्रीय संगीत (सप्त स्वर — सा, रे, ग, म, प, ध, नि) और भक्ति उपासना का मूल स्रोत है। श्रीमद्भगवद्गीता (१०.२२) में भगवान श्रीकृष्ण ने कहा है: "वेदानां सामवेदोऽस्मि"।',
    sourceReference: 'सामवेद संहिता १.१.१ (ऋषि: भरद्वाज बार्हस्पत्य)',
    tags: ['सामवेद', 'सामगान', 'उपासना'],
    displayOrder: 4
  },
  {
    id: 'veda_atharva_bhumi',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'अथर्ववेद',
    subcategory: 'पृथ्वी सूक्त (भूमि सूक्त)',
    titleHi: 'अथर्ववेद भूमि सूक्त — माता भूमिः पुत्रोऽहं पृथिव्याः',
    titleEn: 'Atharvaveda 12.1.12 — Mata Bhumih Putro Aham Prithivyah',
    chapterOrSection: 'काण्ड १२, सूक्त १, मंत्र १ एवं १२',
    sanskritText: 'सत्यं बृहदृतमुग्रं दीक्षा तपो ब्रह्म यज्ञः पृथिवीं धारयन्ति।\nसा नो भूतस्य भव्यस्य पत्न्युरुं लोकं पृथिवी नः कृणोतु॥\nमाता भूमिः पुत्रोऽहं पृथिव्याः पर्जन्यः पिता स उ नः पिपर्तु॥',
    meaningHi: 'महान सत्य, अटल ऋत (प्राकृतिक नियम), पराक्रम, दीक्षा, तप, ब्रह्मज्ञान और यज्ञ—ये सात तत्व पृथ्वी को धारण करते हैं। यह भूमि मेरी माता है और मैं पृथ्वी का पुत्र हूँ; मेघ (पर्जन्य) हमारे पिता हैं, वे हमारा पोषण करें।',
    meaningEn: 'Great truth, cosmic order, consecration, austerity, spiritual knowledge, and sacrifice sustain the Earth. The Earth is my mother, and I am her son; may the nourishing rain-cloud protect us.',
    commentaryHi: 'महर्षि अथर्वा द्वारा दृष्ट ६३ मंत्रों का भूमि सूक्त मातृभूमि के प्रति श्रद्धा, पर्यावरण संरक्षण और राष्ट्रधर्म का अद्वितीय वैदिक दस्तावेज है।',
    sourceReference: 'अथर्ववेद संहिता १२.१.१ एवं १२.१.१२ (ऋषि: अथर्वा)',
    tags: ['अथर्ववेद', 'भूमि सूक्त', 'राष्ट्रधर्म'],
    displayOrder: 5
  },
  {
    id: 'veda_sukta_purusha',
    department: 'veda',
    departmentLabelHi: 'वेद विभाग',
    departmentLabelEn: 'Vedas',
    category: 'वैदिक सूक्त',
    subcategory: 'पुरुष सूक्त',
    titleHi: 'पुरुष सूक्त — सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्',
    titleEn: 'Purusha Sukta — Sahasrashirsha Purushah',
    chapterOrSection: 'ऋग्वेद १०.९० / यजुर्वेद ३१.१-१६',
    sanskritText: 'ॐ सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्।\nस भूमिं विश्वतो वृत्वाऽत्यतिष्ठद्दशाङ्गुलम्॥\nपुरुष एवेदं सर्वं यद्भूतं यच्च भव्यम्।\nउतामृतत्वस्येशानो यदन्नेनातिरोहति॥',
    meaningHi: 'विराट भगवान पुरुष सहस्रों (अनंत) सिर वाले, सहस्रों नेत्र वाले और सहस्रों चरण वाले हैं। वे संपूर्ण ब्रह्मांड को सब ओर से व्याप्त करके भी उससे परे स्थित हैं। जो कुछ भूतकाल में हुआ, जो वर्तमान में है और जो भविष्य में होगा—वह सब यह विराट पुरुष ही है।',
    meaningEn: 'The Cosmic Supreme Person has infinite heads, eyes, and feet. Pervading the entire universe on all sides, He transcends it. All that existed in the past, exists now, and will exist in the future is indeed this Supreme Purusha.',
    commentaryHi: 'भगवान विष्णु और शिव के अभिषेक तथा षोडशोपचार पूजन में पुरुष सूक्त के १६ मंत्रों से आवाहन से लेकर विसर्जन तक के प्रत्येक उपचार का समर्पण किया जाता है।',
    sourceReference: 'ऋग्वेद १०.९०.१-२ / शुक्ल यजुर्वेद अध्याय ३१',
    tags: ['पुरुष सूक्त', 'वैदिक सूक्त', 'अभिषेक'],
    displayOrder: 6
  },

  // 10.2 UPANISHAD
  {
    id: 'upanishad_isha_1',
    department: 'upanishad',
    departmentLabelHi: 'उपनिषद विभाग',
    departmentLabelEn: 'Upanishads',
    category: 'प्रमुख उपनिषद (एकादश)',
    subcategory: 'ईशावास्योपनिषद',
    titleHi: 'ईशावास्योपनिषद — ईशावास्यमिदं सर्वम् (प्रथम मंत्र एवं शांति पाठ)',
    titleEn: 'Isha Upanishad Verse 1 — Ishavasyam Idam Sarvam',
    chapterOrSection: 'शुक्ल यजुर्वेद अध्याय ४०, मंत्र १',
    sanskritText: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते॥\nईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥',
    meaningHi: 'वह परब्रह्म पूर्ण है और यह दृश्य जगत भी पूर्ण है; उस पूर्ण से ही यह पूर्ण प्रकट हुआ है। पूर्ण में से पूर्ण निकाल लेने पर भी पूर्ण ही शेष रहता है। इस गतिशील ब्रह्मांड में जो कुछ भी चराचर जगत है, वह सब ईश्वर से व्याप्त है। अतः त्यागभाव से उसका उपभोग करो, किसी के धन का लोभ मत करो।',
    meaningEn: 'That Supreme Brahman is infinite, and this universe is also whole. All that exists in this changing universe is pervaded by the Lord. Renounce attachment and enjoy responsibly; do not covet anyone’s wealth.',
    commentaryHi: 'आदि शंकराचार्य के भाष्य के अनुसार यह मंत्र संहिता के अंत में स्थित होने के कारण प्रत्यक्ष रूप से ज्ञान और निष्काम कर्म के समन्वय का उपदेश देता है।',
    sourceReference: 'ईशावास्योपनिषद मंत्र १ (शुक्ल यजुर्वेद संहिता अध्याय ४०)',
    tags: ['ईशावास्योपनिषद', 'वेदान्त', 'शांति मंत्र'],
    displayOrder: 7
  },
  {
    id: 'upanishad_katha_arise',
    department: 'upanishad',
    departmentLabelHi: 'उपनिषद विभाग',
    departmentLabelEn: 'Upanishads',
    category: 'प्रमुख उपनिषद (एकादश)',
    subcategory: 'कठोपनिषद',
    titleHi: 'कठोपनिषद — उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत',
    titleEn: 'Katha Upanishad 1.3.14 — Arise, Awake and Realize the Truth',
    chapterOrSection: 'अध्याय १, वल्ली ३, मंत्र १४',
    sanskritText: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।\nक्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति॥',
    meaningHi: 'हे मनुष्यों! उठो, अज्ञान की निद्रा से जागो और श्रेष्ठ तत्त्वदर्शी आचार्यों के पास जाकर उस परम आत्मज्ञान को जानो। ज्ञानीजन कहते हैं कि वह आत्म-साक्षात्कार का मार्ग छुरे की तीक्ष्ण धार के समान अत्यंत सूक्ष्म और दुर्गम है।',
    meaningEn: 'Arise! Awake! Approach the great illumined teachers and realize that Supreme Truth. Like the sharp edge of a razor is that path, difficult to tread, say the wise sages.',
    commentaryHi: 'यमराज और बालक नचिकेता के संवाद पर आधारित कठोपनिषद आत्मा की अमरता और रथ-रूपक (शरीर रथ है, आत्मा रथी है, बुद्धि सारथि है और मन लगाम है) का विशद निरूपण करता है।',
    sourceReference: 'कठोपनिषद १.३.१४ (कृष्ण यजुर्वेद कठ शाखा)',
    tags: ['कठोपनिषद', 'नचिकेता संवाद', 'आत्मज्ञान'],
    displayOrder: 8
  },
  {
    id: 'upanishad_mundaka_satyameva',
    department: 'upanishad',
    departmentLabelHi: 'उपनिषद विभाग',
    departmentLabelEn: 'Upanishads',
    category: 'प्रमुख उपनिषद (एकादश)',
    subcategory: 'मुण्डकोपनिषद',
    titleHi: 'मुण्डकोपनिषद — सत्यमेव जयते नानृतम्',
    titleEn: 'Mundaka Upanishad 3.1.6 — Satyameva Jayate Nanritam',
    chapterOrSection: 'मुण्डक ३, खण्ड १, मंत्र ६',
    sanskritText: 'सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः।\nयेनाक्रमन्त्यृषयो ह्याप्तकामा यत्र तत्सत्यस्य परमं निधानम्॥',
    meaningHi: 'सत्य की ही विजय होती है, असत्य की कदापि नहीं। सत्य से ही वह दिव्य देवयान मार्ग विस्तृत होता है, जिस पर चलकर कामना-रहित महर्षिगण उस परम सत्यस्वरूप परमात्मा के सर्वोच्च धाम को प्राप्त करते हैं।',
    meaningEn: 'Truth alone triumphs, never falsehood. Through truth the divine path is spread out, by which the sages whose desires are fulfilled ascend to the supreme abode of Truth.',
    commentaryHi: 'अथर्ववेदीय मुण्डकोपनिषद का यह मंत्र भारत के राष्ट्रीय आदर्श वाक्य "सत्यमेव जयते" का मूल स्रोत है। इसमें परा और अपरा विद्या का भेद स्पष्ट किया गया है।',
    sourceReference: 'मुण्डकोपनिषद ३.१.६ (अथर्ववेद शौनक शाखा)',
    tags: ['मुण्डकोपनिषद', 'सत्यमेव जयते', 'अथर्ववेद'],
    displayOrder: 9
  },
  {
    id: 'upanishad_brihad_asato',
    department: 'upanishad',
    departmentLabelHi: 'उपनिषद विभाग',
    departmentLabelEn: 'Upanishads',
    category: 'प्रमुख उपनिषद (एकादश)',
    subcategory: 'बृहदारण्यकोपनिषद',
    titleHi: 'बृहदारण्यकोपनिषद — असतो मा सद्गमय (पवमान प्रार्थना)',
    titleEn: 'Brihadaranyaka Upanishad 1.3.28 — Asato Ma Sadgamaya',
    chapterOrSection: 'अध्याय १, ब्राह्मण ३, मंत्र २८',
    sanskritText: 'ॐ असतो मा सद्गमय।\nतमसो मा ज्योतिर्गमय।\nमृत्योर्माऽमृतं गमय॥',
    meaningHi: 'हे परमात्मा! मुझे असत्य (अस्तित्वहीन अज्ञान) से सत्य (शाश्वत ब्रह्म) की ओर ले चलो। मुझे अज्ञान के अंधकार से ज्ञान के दिव्य प्रकाश की ओर ले चलो। मुझे मृत्यु (जन्म-मरण के चक्र) से अमरत्व (मोक्ष) की ओर ले चलो।',
    meaningEn: 'Lead me from the unreal to the Real. Lead me from darkness to Light. Lead me from death to Immortality.',
    commentaryHi: 'महर्षि याज्ञवल्क्य द्वारा उपदिष्ट बृहदारण्यकोपनिषद सबसे विशाल उपनिषद है, जिसमें मैत्रेयी-याज्ञवल्क्य संवाद और "अहं ब्रह्मास्मि" महावाक्य निहित है।',
    sourceReference: 'बृहदारण्यकोपनिषद १.३.२८ (शुक्ल यजुर्वेद शतपथ ब्राह्मण)',
    tags: ['बृहदारण्यकोपनिषद', 'पवमान मंत्र', 'महावाक्य'],
    displayOrder: 10
  },

  // 10.3 SHRIMAD BHAGAVAD GITA
  {
    id: 'gita_overview_18',
    department: 'gita',
    departmentLabelHi: 'श्रीमद्भगवद्गीता',
    departmentLabelEn: 'Shrimad Bhagavad Gita',
    category: 'अध्याय १-६ (कर्मयोग प्रभाग)',
    subcategory: 'अष्टादश अध्याय परिचय (७०० श्लोक)',
    titleHi: 'श्रीमद्भगवद्गीता के समस्त १८ अध्यायों एवं ७०० श्लोकों की शास्त्रीय संरचना',
    titleEn: 'Complete Structure of All 18 Chapters & 700 Verses of Bhagavad Gita',
    chapterOrSection: 'महाभारत भीष्मपर्व (अध्याय २५ से ४२)',
    sanskritText: 'सर्वोपनिषदो गावो दोग्धा गोपालनन्दनः।\nपार्थो वत्सः सुधीर्भोक्ता दुग्धं गीतामृतं महत्॥',
    meaningHi: 'समस्त उपनिषद गौ के समान हैं, गोपालनंदन भगवान श्रीकृष्ण दुहने वाले हैं, अर्जुन बछड़ा है, शुद्ध बुद्धिवाले श्रेष्ठ साधक इसके भोक्ता हैं और महान गीता-रूपी अमृत ही इसका दिव्य दुग्ध है।\n\n• अध्याय १: अर्जुनविषादयोग (४७ श्लोक)\n• अध्याय २: सांख्ययोग (७२ श्लोक)\n• अध्याय ३: कर्मयोग (४३ श्लोक)\n• अध्याय ४: ज्ञानकर्मसंन्यासयोग (४२ श्लोक)\n• अध्याय ५: कर्मसंन्यासयोग (२९ श्लोक)\n• अध्याय ६: आत्मसंयमयोग / ध्यानयोग (४७ श्लोक)\n• अध्याय ७: ज्ञानविज्ञानयोग (३० श्लोक)\n• अध्याय ८: अक्षरब्रह्मयोग (२८ श्लोक)\n• अध्याय ९: राजविद्याराजगुह्ययोग (३४ श्लोक)\n• अध्याय १०: विभूतियोग (४२ श्लोक)\n• अध्याय ११: विश्वरूपदर्शनयोग (५५ श्लोक)\n• अध्याय १२: भक्तियोग (२० श्लोक)\n• अध्याय १३: क्षेत्रक्षेत्रज्ञविभागयोग (३४ श्लोक)\n• अध्याय १४: गुणत्रयविभागयोग (२७ श्लोक)\n• अध्याय १५: पुरुषोत्तमयोग (२० श्लोक)\n• अध्याय १६: दैवासुरसम्पद्विभागयोग (२४ श्लोक)\n• अध्याय १७: श्रद्धात्रयविभागयोग (२८ श्लोक)\n• अध्याय १८: मोक्षसंन्यासयोग (७८ श्लोक) — कुल ७०० श्लोक।',
    meaningEn: 'All the Upanishads are the cows, Lord Krishna is the milker, Arjuna is the calf, men of purified intellect are the drinkers, and the supreme nectar of the Gita is the milk. Total: 18 Chapters, 700 Verses.',
    commentaryHi: 'महर्षि कृष्णद्वैपायन वेदव्यास रचित महाभारत के भीष्मपर्व के अंतर्गत श्रीमद्भगवद्गीता प्रस्थानत्रयी (उपनिषद, ब्रह्मसूत्र, गीता) का हृदय स्तंभ है।',
    sourceReference: 'गीता ध्यानम् श्लोक ४ एवं महाभारत भीष्मपर्व',
    tags: ['भगवद्गीता', '१८ अध्याय', '७०० श्लोक'],
    displayOrder: 11
  },
  {
    id: 'gita_ch2_v20',
    department: 'gita',
    departmentLabelHi: 'श्रीमद्भगवद्गीता',
    departmentLabelEn: 'Shrimad Bhagavad Gita',
    category: 'अध्याय १-६ (कर्मयोग प्रभाग)',
    subcategory: 'अध्याय २ — सांख्ययोग',
    titleHi: 'आत्मा की अमरता — न जायते म्रियते वा कदाचित् (अध्याय २, श्लोक २०)',
    titleEn: 'Immortality of the Soul — Bhagavad Gita 2.20',
    chapterOrSection: 'अध्याय २ (सांख्ययोग), श्लोक २०',
    sanskritText: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥',
    transliteration: 'Na jāyate mriyate vā kadācin nāyaṃ bhūtvā bhavitā vā na bhūyaḥ, ajo nityaḥ śāśvato \'yaṃ purāṇo na hanyate hanyamāne śarīre.',
    meaningHi: 'यह आत्मा न तो कभी जन्म लेता है और न ही कभी मरता है; और न यह उत्पन्न होकर फिर होने वाला ही है। यह अजन्मा, नित्य, सनातन और पुरातन है; शरीर के मारे जाने पर भी यह आत्मा नहीं मारा जाता।',
    meaningEn: 'The soul is never born nor does it ever die; nor having once existed, does it ever cease to be. Unborn, eternal, changeless, and primeval, the soul is not slain when the body is slain.',
    commentaryHi: 'सांख्ययोग के इस श्लोक में भगवान श्रीकृष्ण देह और देही (आत्मा) का नित्य विवेक स्पष्ट करते हुए शोक-मोह का नाश करते हैं।',
    sourceReference: 'श्रीमद्भगवद्गीता २.२०',
    tags: ['सांख्ययोग', 'आत्मा', 'अध्याय २'],
    displayOrder: 12
  },
  {
    id: 'gita_ch2_v47',
    department: 'gita',
    departmentLabelHi: 'श्रीमद्भगवद्गीता',
    departmentLabelEn: 'Shrimad Bhagavad Gita',
    category: 'अध्याय १-६ (कर्मयोग प्रभाग)',
    subcategory: 'अध्याय २ — सांख्ययोग',
    titleHi: 'निष्काम कर्मयोग — कर्मण्येवाधिकारस्ते मा फलेषु कदाचन (अध्याय २, श्लोक ४७)',
    titleEn: 'Nishkama Karma Yoga — Bhagavad Gita 2.47',
    chapterOrSection: 'अध्याय २ (सांख्ययोग), श्लोक ४७',
    sanskritText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    meaningHi: 'तेरा केवल कर्तव्य-कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए तू कर्मों के फल का हेतु मत बन और न ही तेरी कर्म न करने (अकर्मण्यता) में आसक्ति हो।',
    meaningEn: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, nor be attached to inaction.',
    commentaryHi: 'यह श्लोक गीता के कर्मयोग दर्शन का मूल आधार है—कर्तव्य के प्रति पूर्ण निष्ठा रखते हुए फल की आसक्ति का त्याग ही चित्तशुद्धि का मार्ग है।',
    sourceReference: 'श्रीमद्भगवद्गीता २.४७',
    tags: ['कर्मयोग', 'गीता श्लोक', 'अध्याय २'],
    displayOrder: 13
  },
  {
    id: 'gita_ch9_v22',
    department: 'gita',
    departmentLabelHi: 'श्रीमद्भगवद्गीता',
    departmentLabelEn: 'Shrimad Bhagavad Gita',
    category: 'अध्याय ७-१२ (भक्तियोग प्रभाग)',
    subcategory: 'अध्याय ९ — राजविद्याराजगुह्ययोग',
    titleHi: 'अनन्य भक्ति व योगक्षेम — अनन्याश्चिन्तयन्तो माम् (अध्याय ९, श्लोक २२)',
    titleEn: 'Divine Assurance of Yoga-Kshema — Bhagavad Gita 9.22',
    chapterOrSection: 'अध्याय ९ (राजविद्याराजगुह्ययोग), श्लोक २२',
    sanskritText: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    meaningHi: 'जो अनन्य प्रेमी भक्त मुझ परमेश्वर को निरंतर चिंतन करते हुए निष्काम भाव से भजते हैं, उन नित्ययुक्त साधकों का योग (अप्राप्त की प्राप्ति) और क्षेम (प्राप्त की रक्षा) मैं स्वयं वहन करता हूँ।',
    meaningEn: 'To those steadfast devotees who worship Me with exclusive devotion, meditating on My transcendental form, I personally carry what they lack and preserve what they have.',
    commentaryHi: 'भक्तियोग प्रभाग का यह सर्वोच्च आश्वासन श्लोक है, जहाँ भगवान स्वयं अपने अनन्य भक्त के आध्यात्मिक व लौकिक संरक्षण का भार लेते हैं।',
    sourceReference: 'श्रीमद्भगवद्गीता ९.२२',
    tags: ['भक्तियोग', 'योगक्षेम', 'अध्याय ९'],
    displayOrder: 14
  },
  {
    id: 'gita_ch15_v1',
    department: 'gita',
    departmentLabelHi: 'श्रीमद्भगवद्गीता',
    departmentLabelEn: 'Shrimad Bhagavad Gita',
    category: 'अध्याय १३-१८ (ज्ञानयोग प्रभाग)',
    subcategory: 'अध्याय १५ — पुरुषोत्तमयोग',
    titleHi: 'संसार वृक्ष और वैराग्य — ऊर्ध्वमूलमधःशाखम् (अध्याय १५, श्लोक १)',
    titleEn: 'The Eternal Ashvattha Tree — Bhagavad Gita 15.1',
    chapterOrSection: 'अध्याय १५ (पुरुषोत्तमयोग), श्लोक १',
    sanskritText: 'श्रीभगवानुवाच —\nऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम्।\nछन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित्॥',
    meaningHi: 'भगवान श्रीकृष्ण ने कहा: आदिपुरुष परमात्मा रूपी ऊपर को मूल (जड़) वाले और नीचे की ओर शाखाओं वाले इस संसार-रूपी पीपल के वृक्ष को अविनाशी कहते हैं। वेद जिसके पत्ते हैं, जो पुरुष इस संसार-वृक्ष को तत्त्व से जानता है, वही वास्तव में वेद का ज्ञाता (वेदवित्) है।',
    meaningEn: 'The Supreme Lord said: They speak of an imperishable Ashvattha tree with its roots above in the Supreme Being and its branches below in the material cosmos, whose leaves are the Vedic hymns. One who knows it truly knows the Vedas.',
    commentaryHi: 'पुरुषोत्तमयोग में क्षर, अक्षर और पुरुषोत्तम परमात्मा के स्वरूप का विशद निरूपण किया गया है।',
    sourceReference: 'श्रीमद्भगवद्गीता १५.१',
    tags: ['पुरुषोत्तमयोग', 'ज्ञानयोग', 'अध्याय १५'],
    displayOrder: 15
  },

  // 10.4 PURANA
  {
    id: 'purana_bhagavata_1',
    department: 'purana',
    departmentLabelHi: 'पुराण विभाग',
    departmentLabelEn: 'Puranas',
    category: 'श्रीमद्भागवत महापुराण',
    subcategory: 'प्रथम स्कन्ध — मंगलाचरण',
    titleHi: 'श्रीमद्भागवत महापुराण — सत्यं परं धीमहि (१२ स्कन्ध, १८,००० श्लोक)',
    titleEn: 'Shrimad Bhagavata Mahapurana 1.1.1 — Satyam Param Dhimahi',
    chapterOrSection: 'प्रथम स्कन्ध, अध्याय १, श्लोक १-३',
    sanskritText: 'जन्माद्यस्य यतोऽन्वयादितरतः चार्थेष्वभिज्ञः स्वराट्\nतेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरयः।\nतेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा\nधाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि॥',
    meaningHi: 'जिनसे इस सृष्टि की उत्पत्ति, स्थिति और प्रलय होते हैं, जो समस्त पदार्थों में व्यापक और सर्वज्ञ हैं, जिन्होंने आदिकवि ब्रह्माजी के हृदय में वेदज्ञान प्रकाशित किया और जो अपने स्वयंप्रकाश तेज से माया का सदा निवारण करते हैं—उस परम सत्य स्वरूप भगवान श्रीकृष्ण का हम ध्यान करते हैं।',
    meaningEn: 'We meditate upon that Supreme Truth from whom the creation, sustenance, and dissolution of this universe proceed, who is omniscient, self-effulgent, and who imparted Vedic wisdom into the heart of Brahma.',
    commentaryHi: 'महर्षि वेदव्यास प्रणीत श्रीमद्भागवत महापुराण में १२ स्कन्ध, ३३५ अध्याय और १८,००० श्लोक हैं। यह निगमकल्पतरु (वेद रूपी कल्पवृक्ष) का पका हुआ मधुर फल माना जाता है।',
    sourceReference: 'श्रीमद्भागवत महापुराण १.१.१',
    tags: ['भागवत पुराण', 'मंगलाचरण', 'महापुराण'],
    displayOrder: 16
  },
  {
    id: 'purana_18_list',
    department: 'purana',
    departmentLabelHi: 'पुराण विभाग',
    departmentLabelEn: 'Puranas',
    category: 'अष्टादश पुराण सूची',
    subcategory: 'महर्षि वेदव्यास प्रणीत १८ महापुराण',
    titleHi: 'अष्टादश (१८) महापुराणों का शास्त्रीय श्लोक एवं वर्गीकरण',
    titleEn: 'Classical Verse & Classification of the 18 Mahapuranas',
    chapterOrSection: 'देवी भागवत महापुराण १.३.२',
    sanskritText: 'मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम्।\nअनापलिङ्गकूस्कानि पुराणानि प्रचक्षते॥',
    meaningHi: 'महर्षि वेदव्यास द्वारा रचित १८ महापुराणों का स्मरण सूत्र:\n• "म" द्वय (२): १. मत्स्य पुराण, २. मार्कण्डेय पुराण\n• "भ" द्वय (२): ३. भविष्य पुराण, ४. श्रीमद्भागवत महापुराण\n• "ब्र" त्रय (३): ५. ब्रह्म पुराण, ६. ब्रह्माण्ड पुराण, ७. ब्रह्मवैवर्त पुराण\n• "व" चतुष्टय (४): ८. विष्णु पुराण, ९. वामन पुराण, १०. वराह पुराण, ११. वायु (शिव) महापुराण\n• "अ-ना-प-लिं-ग-कू-स्का" (७): १२. अग्नि पुराण, १३. नारद पुराण, १४. पद्म पुराण, १५. लिंग पुराण, १६. गरुड़ पुराण, १७. कूर्म पुराण, १८. स्कंद पुराण (सबसे विशाल — ८१,१०० श्लोक)।',
    meaningEn: 'Mnemonic verse for the 18 Mahapuranas: Matsya, Markandeya, Bhavishya, Bhagavata, Brahma, Brahmanda, Brahmavaivarta, Vishnu, Vamana, Varaha, Vayu/Shiva, Agni, Narada, Padma, Linga, Garuda, Kurma, and Skanda Purana.',
    commentaryHi: 'पुराण के पाँच लक्षण (पञ्चलक्षणम्) हैं: सर्ग (सृष्टि), प्रतिसर्ग (प्रलय व पुनः सृष्टि), वंश (देव-ऋषि वंशावली), मन्वन्तर (१४ मनुओं का काल) और वंशानुचरित (सूर्यवंश-चंद्रवंश का इतिहास)।',
    sourceReference: 'श्रीमद्देवी भागवत महापुराण १.३.२ एवं अमरकोश',
    tags: ['१८ पुराण', 'विष्णु पुराण', 'शिव पुराण', 'स्कंद पुराण'],
    displayOrder: 17
  },

  // 10.5 ITIHASA
  {
    id: 'itihasa_ramayana_1',
    department: 'itihasa',
    departmentLabelHi: 'इतिहास विभाग',
    departmentLabelEn: 'Itihasa',
    category: 'वाल्मीकि रामायण',
    subcategory: 'बालकाण्ड — मर्यादा पुरुषोत्तम श्रीराम',
    titleHi: 'श्रीमद्वाल्मीकि रामायण — को न्वस्मिन् सांप्रतं लोके गुणवान् (सप्त काण्ड)',
    titleEn: 'Valmiki Ramayana 1.1.2 — Inquiry on the Ideal Righteous Person',
    chapterOrSection: 'बालकाण्ड, प्रथम सर्ग (संक्षिप्त रामायण)',
    sanskritText: 'तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम्।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम्॥\nको न्वस्मिन् सांप्रतं लोके गुणवान् कश्च वीर्यवान्।\nधर्मज्ञश्च कृतज्ञश्च सत्यवाक्यो दृढव्रतः॥',
    meaningHi: 'तप और स्वाध्याय में निरंतर लीन रहने वाले मुनिश्रेष्ठ महर्षि वाल्मीकि ने वाणी के मर्मज्ञ देवर्षि नारद से पूछा: "इस समय संसार में कौन ऐसा महापुरुष है जो संपूर्ण सद्गुणों से युक्त, परम पराक्रमी, धर्म का ज्ञाता, कृतज्ञ, सत्यवादी और दृढ़ प्रतिज्ञा वाला है?" देवर्षि नारद ने उत्तर दिया—इक्ष्वाकुवंश में उत्पन्न मर्यादा पुरुषोत्तम श्रीराम ही ऐसे महापुरुष हैं।\n\n• सप्त काण्ड: १. बालकाण्ड, २. अयोध्याकाण्ड, ३. अरण्यकाण्ड, ४. किष्किन्धाकाण्ड, ५. सुन्दरकाण्ड, ६. युद्धकाण्ड (लंकाकाण्ड), ७. उत्तरकाण्ड (२४,००० श्लोक — चतुर्विंशतिसाहस्री संहिता)।',
    meaningEn: 'Sage Valmiki asked Devarshi Narada: Who in this world today is virtuous, heroic, knower of Dharma, grateful, truthful in speech, and firm in vows? Narada replied: Lord Shri Rama of the Ikshvaku dynasty.',
    commentaryHi: 'रामायण आदिकाव्य है और महर्षि वाल्मीकि आदिकवि हैं। इसमें २४,००० श्लोक हैं तथा प्रत्येक १००० श्लोक का प्रथम अक्षर गायत्री मंत्र के २४ अक्षरों का निर्माण करता है।',
    sourceReference: 'श्रीमद्वाल्मीकि रामायण, बालकाण्ड १.१-२',
    tags: ['रामायण', 'वाल्मीकि', 'श्रीराम', 'सुन्दरकाण्ड'],
    displayOrder: 18
  },
  {
    id: 'itihasa_mahabharata_dharma',
    department: 'itihasa',
    departmentLabelHi: 'इतिहास विभाग',
    departmentLabelEn: 'Itihasa',
    category: 'महाभारत',
    subcategory: 'अष्टादश पर्व एवं धर्म शिक्षा',
    titleHi: 'महाभारत (शतसाहस्री संहिता) — यतो धर्मस्ततो जयः एवं भारत सावित्री',
    titleEn: 'Mahabharata — Yato Dharmas Tato Jayah & Bharata Savitri',
    chapterOrSection: 'भीष्मपर्व एवं स्वर्गारोहणपर्व ५.६२',
    sanskritText: 'यतो कृष्णस्ततो धर्मो यतो धर्मस्ततो जयः॥\nऊर्ध्वबाहुर्विरौम्येष न च कित् शृणोति मे।\nधर्मादर्थश्च कामश्च स किमर्थं न सेव्यते॥\nन जातु कामान्न भयान्न लोभाद् धर्मं त्यजेज्जीवितस्यापि हेतोः।\nनित्यो धर्मः सुखदुःखे त्वनित्ये जीवो नित्यो हेतुरस्य त्वनित्यः॥',
    meaningHi: 'जहाँ भगवान श्रीकृष्ण हैं वहीं धर्म है, और जहाँ धर्म है वहीं निश्चित विजय है। महर्षि वेदव्यास दोनों भुजाएँ उठाकर पुकारते हैं: "धर्म से ही पवित्र अर्थ और काम की सिद्धि होती है, फिर लोग उस धर्म का सेवन क्यों नहीं करते? कामना से, भय से, लोभ से अथवा प्राणों की रक्षा के लिए भी धर्म का त्याग कभी नहीं करना चाहिए, क्योंकि धर्म नित्य है और सुख-दुःख अनित्य हैं।"',
    meaningEn: 'Where Krishna is, there is Dharma; where Dharma is, there is victory. Never abandon Dharma out of desire, fear, greed, or even for the sake of life itself; for Dharma is eternal while pleasure and pain are transient.',
    commentaryHi: '१,००,००० श्लोकों वाला महाभारत विश्व का सबसे बड़ा ग्रंथ और "पंचम वेद" है, जो १८ पर्वों (आदिपर्व से स्वर्गारोहणपर्व तक) में विभाजित है।',
    sourceReference: 'महाभारत स्वर्गारोहणपर्व ५.६२-६३ (भारत सावित्री)',
    tags: ['महाभारत', 'विदुर नीति', 'धर्म शिक्षा'],
    displayOrder: 19
  },

  // 10.6 BHARATIYA DARSHANA
  {
    id: 'darshana_yoga_1',
    department: 'darshana',
    departmentLabelHi: 'भारतीय दर्शन',
    departmentLabelEn: 'Indian Philosophy',
    category: 'सांख्य एवं योग दर्शन',
    subcategory: 'महर्षि पतंजलि योगसूत्र (समाधिपाद)',
    titleHi: 'योग दर्शन — अथ योगानुशासनम्, योगश्चित्तवृत्तिनिरोधः',
    titleEn: 'Patanjali Yoga Sutras 1.1-1.3 — Yoga Chitta Vritti Nirodhah',
    chapterOrSection: 'समाधिपाद, सूत्र १-३ (अष्टांग योग)',
    sanskritText: 'अथ योगानुशासनम्॥ १॥\nयोगश्चित्तवृत्तिनिरोधः॥ २॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम्॥ ३॥\nयमनियमासनप्राणायामप्रत्याहारधारणाध्यानसमाधयोऽष्टावङ्गानि॥ (साधनपाद २.२९)',
    meaningHi: '१. अब योग के अनुशासन (शास्त्रीय उपदेश) का आरंभ किया जाता है।\n२. चित्त (मन, बुद्धि, अहंकार) की वृत्तियों का पूर्णतः निरोध (शांत व एकाग्र होना) ही योग है।\n३. उस अवस्था में द्रष्टा (आत्मा) अपने वास्तविक शुद्ध स्वरूप में प्रतिष्ठित हो जाता है।\n• अष्टांग योग के ८ अंग: १. यम (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह), २. नियम (शौच, संतोष, तप, स्वाध्याय, ईश्वरप्रणिधान), ३. आसन, ४. प्राणायाम, ५. प्रत्याहार, ६. धारणा, ७. ध्यान, ८. समाधि।',
    meaningEn: '1. Now begins the authoritative exposition of Yoga. 2. Yoga is the cessation of the fluctuations of the mind-stuff (Chitta). 3. Then the Seer (Atman) abides in its own true nature.',
    commentaryHi: 'महर्षि पतंजलि प्रणीत योगसूत्र १९५ सूत्रों में समाधिपाद, साधनपाद, विभूतिपाद और कैवल्यपाद के माध्यम से मानव चेतना के सर्वोच्च उत्थान का विज्ञान प्रस्तुत करता है।',
    sourceReference: 'पातञ्जल योगदर्शनम् १.१-३ एवं २.२९ (व्यास भाष्य सहित)',
    tags: ['योग दर्शन', 'पतंजलि', 'अष्टांग योग', 'षड्दर्शन'],
    displayOrder: 20
  },
  {
    id: 'darshana_vedanta_advaita',
    department: 'darshana',
    departmentLabelHi: 'भारतीय दर्शन',
    departmentLabelEn: 'Indian Philosophy',
    category: 'अद्वैत वेदान्त',
    subcategory: 'ब्रह्मसूत्र एवं चतुर्महावाक्य',
    titleHi: 'वेदान्त दर्शन — अथातो ब्रह्मजिज्ञासा एवं चार वैदिक महावाक्य',
    titleEn: 'Vedanta Darshana — Brahma Sutras & Four Mahavakyas',
    chapterOrSection: 'ब्रह्मसूत्र १.१.१-२ एवं वेदान्त सार',
    sanskritText: 'अथातो ब्रह्मजिज्ञासा॥ १॥ जन्माद्यस्य यतः॥ २॥\nब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः॥\nचतुर्महावाक्यानि —\n१. प्रज्ञानं ब्रह्म (ऐतरेयोपनिषद ३.३ - ऋग्वेद)\n२. अहं ब्रह्मास्मि (बृहदारण्यकोपनिषद १.४.१० - यजुर्वेद)\n३. तत्त्वमसि (छान्दोग्योपनिषद ६.८.७ - सामवेद)\n४. अयमात्मा ब्रह्म (माण्डूक्योपनिषद १.२ - अथर्ववेद)',
    meaningHi: 'अब इसके पश्चात (साधन-चतुष्टय संपन्न होने पर) परब्रह्म को जानने की जिज्ञासा करनी चाहिए। जिस परब्रह्म से इस जगत की उत्पत्ति, स्थिति और लय होता है, वही ब्रह्म सत्य है और जीवात्मा तात्त्विक रूप से ब्रह्म से अभिन्न है। इसके साथ ही रामानुजाचार्य का विशिष्टाद्वैत (चित्-अचित् विशिष्ट ब्रह्म) और मध्वाचार्य का द्वैत दर्शन (भगवान विष्णु की सर्वोपरिता व पंचभेद) वेदान्त की गौरवशाली परंपराएं हैं।',
    meaningEn: 'Now, therefore, the inquiry into Brahman. Brahman is that from which the origin, sustenance, and dissolution of this universe proceed. The four Mahavakyas proclaim the unity of Pure Consciousness and the Self.',
    commentaryHi: 'भारतीय षड्दर्शन के ६ आस्तिक स्तंभ हैं: १. न्याय (महर्षि गौतम), २. वैशेषिक (महर्षि कणाद), ३. सांख्य (महर्षि कपिल), ४. योग (महर्षि पतंजलि), ५. पूर्व मीमांसा (महर्षि जैमिनि), ६. उत्तर मीमांसा / वेदान्त (महर्षि बादरायण वेदव्यास)।',
    sourceReference: 'ब्रह्मसूत्र १.१.१-२ एवं शांकर-रामानुज-मध्व भाष्य',
    tags: ['वेदान्त', 'अद्वैत', 'विशिष्टाद्वैत', 'द्वैत', 'महावाक्य'],
    displayOrder: 21
  },

  // 10.7 DAINIK SANATAN DHARMA
  {
    id: 'dainik_pratah_smaran',
    department: 'dainik_dharma',
    departmentLabelHi: 'दैनिक सनातन धर्म',
    departmentLabelEn: 'Daily Sanatan Dharma',
    category: 'नित्य कर्म एवं प्रातः स्मरण',
    subcategory: 'करदर्शन, भूमिवंदना एवं स्नान मंत्र',
    titleHi: 'प्रातःकालीन नित्य कर्म — करदर्शन, भूमि स्पर्श एवं सप्तनदी स्नान मंत्र',
    titleEn: 'Daily Morning Vedic Routine — Karadarshana, Bhumi Vandana & Snana Mantra',
    chapterOrSection: 'नित्य कर्म पूजा प्रकाश (धर्मसिंधु एवं आचारमयूख)',
    sanskritText: '१. करदर्शन मंत्र:\nकराग्रे वसते लक्ष्मीः करमध्ये सरस्वती।\nकरमूले तु गोविन्दः प्रभाते करदर्शनम्॥\n\n२. भूमि स्पर्श क्षमा मंत्र:\nसमुद्रवसने देवि पर्वतस्तनमण्डले।\nविष्णुपत्नि नमस्तुभ्यं पादस्पर्शं क्षमस्व मे॥\n\n३. पवित्र स्नान मंत्र:\nगङ्गे च यमुने चैव गोदावरि सरस्वति।\nनर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु॥',
    meaningHi: '१. प्रातः जागते ही दोनों हथेलियों का दर्शन करें: हाथ के अग्रभाग में माँ लक्ष्मी, मध्य में माँ सरस्वती और मूल में भगवान गोविंद का निवास है (अर्थात् पुरुषार्थ से ही लक्ष्मी, विद्या और धर्म सिद्ध होते हैं)।\n२. धरती पर पैर रखने से पूर्व भूमि देवी को प्रणाम कर पाद-स्पर्श के लिए क्षमा मांगें।\n३. स्नान करते समय जल में सप्त पवित्र नदियों (गंगा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिंधु, कावेरी) का आवाहन करें।',
    meaningEn: '1. Upon waking, behold both palms where Lakshmi, Saraswati, and Govinda reside. 2. Bow to Mother Earth before stepping on the ground. 3. Invoke the seven sacred rivers into the bathing water.',
    commentaryHi: 'सनातन आचार-संहिता के अनुसार ब्रह्ममुहूर्त (सूर्योदय से ९६ मिनट पूर्व) में जागरण, करदर्शन, शौच-स्नान, तिलक धारण और संध्या-गायत्री उपासना गृहस्थ और साधक के नित्य कर्तव्य हैं।',
    sourceReference: 'आचारमयूख एवं नित्यकर्म पूजा प्रकाश',
    tags: ['नित्य कर्म', 'करदर्शन', 'स्नान मंत्र', 'दैनिक धर्म'],
    displayOrder: 22
  },
  {
    id: 'dainik_shodasha_sanskara',
    department: 'dainik_dharma',
    departmentLabelHi: 'दैनिक सनातन धर्म',
    departmentLabelEn: 'Daily Sanatan Dharma',
    category: 'षोडश (१६) संस्कार',
    subcategory: 'वैदिक गृह्यसूत्र आधारित १६ संस्कार',
    titleHi: 'सनातन धर्म के षोडश (१६) संस्कार — गर्भाधान से अंत्येष्टि तक',
    titleEn: 'The 16 Vedic Sanskaras (Sacraments of Human Life)',
    chapterOrSection: 'पारस्कर गृह्यसूत्र एवं मनुस्मृति',
    sanskritText: 'गर्भाधानं पुंसवनं सीमन्तो जातकर्म च।\nनामक्रिया निष्क्रमोऽन्नप्राशनं वपनक्रिया॥\nकर्णवेधो व्रतादेशो वेदारम्भः क्रियाविधिः।\nकेशान्तः स्नानमुद्वाहो विवाहाग्निपरिग्रहः।\nत्रेताग्निसंग्रहश्चैव संस्काराः षोडश स्मृताः॥',
    meaningHi: 'मानव जीवन को सुसंस्कृत, तेजस्वी और दिव्य बनाने वाले १६ वैदिक संस्कार:\n१. गर्भाधान संस्कार (उत्तम संतान संकल्प)\n२. पुंसवन संस्कार (गर्भस्थ शिशु के शारीरिक-मानसिक विकास हेतु — तृतीय मास)\n३. सीमन्तोन्नयन संस्कार (गर्भिणी की प्रसन्नता व सौभाग्य रक्षा — चतुर्थ/षष्ठ/अष्टम मास)\n४. जातकर्म संस्कार (शिशु जन्म के तुरंत पश्चात मधु-घृत प्राशन व आयुष्य मंत्र)\n५. नामकरण संस्कार (जन्म के ११वें या १२वें दिन नक्षत्र चरण अनुसार नामकरण)\n६. निष्क्रमण संस्कार (चतुर्थ मास में शिशु को सूर्य व चंद्र दर्शन कराना)\n७. अन्नप्राशन संस्कार (षष्ठ मास में प्रथम बार शुद्ध अन्न/खीर चटाना)\n८. चूड़ाकर्म / मुंडन संस्कार (प्रथम, तृतीय या पंचम वर्ष में केश मुंडन)\n९. कर्णवेध संस्कार (आरोग्य व श्रवण शक्ति हेतु कान छेदन)\n१०. विद्यारम्भ / अक्षरारम्भ संस्कार (पंचम वर्ष में गणेश-सरस्वती पूजन कर अक्षर लेखन)\n११. उपनयन / यज्ञोपवीत संस्कार (गायत्री मंत्र दीक्षा व ब्रह्मचर्य आश्रम प्रवेश)\n१२. वेदारम्भ संस्कार (गुरुकुल में वेद व शास्त्र अध्ययन आरंभ)\n१३. केशान्त / गोदान संस्कार (१६वें वर्ष में विद्या पूर्णता से पूर्व संस्कार)\n१४. समावर्तन / दीक्षान्त संस्कार (शिक्षा पूर्ण कर गुरुकुल से गृहस्थ जीवन की ओर प्रस्थान)\n१५. विवाह संस्कार (धर्म, अर्थ, काम और संतान परंपरा हेतु पाणिग्रहण व सप्तपदी)\n१६. अंत्येष्टि संस्कार (देह त्याग के पश्चात वैदिक मंत्रों से पंचतत्व में विलीन करने की अंतिम क्रिया)।',
    meaningEn: 'The 16 Vedic Sanskaras purify and sanctify every stage of human life from conception (Garbhadhana), birth (Jatakarma), naming (Namakarana), first solid food (Annaprashana), sacred thread (Upanayana), marriage (Vivaha), to final rites (Antyeshti).',
    commentaryHi: 'संस्कार का अर्थ है—"दोषमार्जन एवं गुणाधान" अर्थात् व्यक्ति के स्वभाव के दोषों को दूर कर उसमें दैवीय गुणों का आधान करना।',
    sourceReference: 'पारस्कर गृह्यसूत्र एवं व्यास स्मृति १.१३-१५',
    tags: ['षोडश संस्कार', '१६ संस्कार', 'गृह्यसूत्र', 'सनातन धर्म'],
    displayOrder: 23
  }
];

// ============================================================================
// 2. PUJA AND KARMAKAND (पूजा एवं कर्मकांड — 19 CATEGORIES)
// ============================================================================

export interface PujaVidhiItem {
  id: string;
  category: string;
  titleHi: string;
  titleEn: string;
  duration: string;
  introductionHi: string;
  significanceHi: string;
  preparationHi: string[];
  samagriList: string[];
  sankalpaMantra: string;
  steps: Array<{
    stepNo: number;
    titleHi: string;
    instructionHi: string;
    sanskritMantra: string;
    meaningHi: string;
  }>;
  aartiHi: string;
  conclusionHi: string;
  relatedPujaIds: string[];
}

export const PUJA_CATEGORIES: string[] = [
  'दैनिक पूजा',
  'गणेश पूजा',
  'लक्ष्मी पूजा',
  'विष्णु पूजा',
  'शिव पूजा',
  'देवी पूजा',
  'नवग्रह पूजा',
  'रुद्राभिषेक',
  'सत्यनारायण पूजा',
  'गृह प्रवेश',
  'विवाह संस्कार',
  'उपनयन',
  'नामकरण',
  'अन्नप्राशन',
  'मुंडन',
  'श्राद्ध कर्म',
  'तर्पण',
  'पितृ कर्म',
  'अन्य वैदिक कर्मकांड'
];

export const INITIAL_PUJA_VIDHIS: PujaVidhiItem[] = [
  {
    id: 'puja_ganesh_shodashopachara',
    category: 'गणेश पूजा',
    titleHi: 'श्री महागणपति षोडशोपचार पूजन विधि',
    titleEn: 'Shri Mahaganapati Shodashopachara Puja Vidhi',
    duration: '३०-४५ मिनट',
    introductionHi: 'सनातन वैदिक परंपरा में किसी भी शुभ कार्य, अनुष्ठान, पर्व अथवा दैनिक देवपूजन के आरंभ में प्रथम पूज्य विघ्नहर्ता भगवान श्री गणेश का पूजन अनिवार्य है।',
    significanceHi: 'भगवान श्री गणेश बुद्धि, सिद्धि, विवेक और मंगल के अधिष्ठाता हैं। उनके पूजन से समस्त कार्य निर्विघ्न संपन्न होते हैं और घर में ऋद्धि-सिद्धि का वास होता है।',
    preparationHi: [
      'स्नान कर स्वच्छ धुले हुए वस्त्र धारण करें एवं पूर्व या उत्तर की ओर मुख करके आसन पर बैठें।',
      'पूजा चौकी पर लाल या पीला वस्त्र बिछाकर अक्षत की ढेरी (अष्टदल कमल) पर श्री गणेश प्रतिमा या सुपारी-गणेश स्थापित करें।',
      'दाहिनी ओर घी का दीपक तथा बाईं ओर तेल का दीपक प्रज्वलित करें।'
    ],
    samagriList: [
      'ताम्र कलश, शुद्ध जल, गंगाजल, आचमनी व पंचपात्र',
      'रोली, कुमकुम, सिन्दूर, चंदन व अखंडित अक्षत (चावल)',
      'दूर्वा दल (२१ गांठों वाली हरी दूब), लाल गुड़हल के पुष्प व माला',
      'मोदक अथवा लड्डू का नैवेद्य, ऋतुफल, पान, सुपारी, लौंग-इलायची',
      'यज्ञोपवीत (जनेऊ), कलावा (मौली), धूपबत्ती, घी का दीपक एवं कर्पूर'
    ],
    sankalpaMantra: 'ॐ विष्णुर्विष्णुर्विष्णुः अद्य शुभपुण्यतिथौ मम सपरिवारस्य सकलविघ्ननिवारणपूर्वकं सर्वकार्यसिद्ध्यर्थं श्रीमन्महागणपतिप्रीत्यर्थं षोडशोपचारपूजनं करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'पवित्रीकरण एवं आचमन',
        instructionHi: 'बाएं हाथ में जल लेकर दाहिने हाथ से अपने ऊपर व पूजा सामग्री पर छिड़कें, तत्पश्चात तीन बार आचमन करें।',
        sanskritMantra: 'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत् पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥',
        meaningHi: 'कोई व्यक्ति पवित्र हो या अपवित्र, किसी भी अवस्था में हो, कमलनयन भगवान विष्णु का स्मरण करने मात्र से वह भीतर और बाहर दोनों से शुद्ध हो जाता है।'
      },
      {
        stepNo: 2,
        titleHi: 'श्री गणेश ध्यान एवं आवाहन',
        instructionHi: 'हाथ में अक्षत और लाल पुष्प लेकर भगवान श्री गणेश का ध्यान व आवाहन करें।',
        sanskritMantra: 'गजाननं भूतगणादिसेवितं कपित्थजम्बूफलचारुभक्षणम्।\nउमासुतं शोकविनाशकारकं नमामि विघ्नेश्वरपादपङ्कजम्॥\nॐ भूर्भुवः स्वः सिद्धिबुद्धिसहिताय गणपतये नमः, गणपतिमावाहयामि स्थापयामि।',
        meaningHi: 'गज के समान मुख वाले, भूतगणों द्वारा सेवित, कैथ और जामुन के फल का रुचिपूर्वक भक्षण करने वाले, माता पार्वती के पुत्र और शोक का नाश करने वाले विघ्नेश्वर श्री गणेश के चरणकमलों में मैं प्रणाम करता हूँ।'
      },
      {
        stepNo: 3,
        titleHi: 'पंचामृत स्नान एवं सिन्दूर-दूर्वा अर्पण',
        instructionHi: 'जल व पंचामृत (दूध, दही, घी, मधु, शर्करा) से स्नान कराकर शुद्ध जल अर्पित करें, जनेऊ पहनाएं, सिन्दूर और २१ दूर्वा दल चढ़ाएं।',
        sanskritMantra: 'ॐ गणानां त्वा गणपतिं हवामहे प्रियाणां त्वा प्रियपतिं हवामहे निधीनां त्वा निधिपतिं हवामहे वसो मम। आहमजानी गर्भधमा त्वमजासि गर्भधम्॥\nॐ गं गणपतये नमः, सिन्दूरं समर्पयामि, दूर्वाङ्कुरान् समर्पयामि।',
        meaningHi: 'हे गणों के अधिपति, प्रियजनों के स्वामी और निधियों के रक्षक गणपति देव! हम आपका आवाहन करते हैं; आपको सिन्दूर और पवित्र दूर्वा दल समर्पित हैं।'
      },
      {
        stepNo: 4,
        titleHi: 'धूप, दीप एवं मोदक नैवेद्य अर्पण',
        instructionHi: 'सुगंधित धूप व घी का दीप दिखाएं तथा मोदक/लड्डू, ऋतुफल और ताम्बूल (पान-सुपारी) व दक्षिणा अर्पित करें।',
        sanskritMantra: 'ॐ प्राणाय स्वाहा, अपानाय स्वाहा, व्यानाय स्वाहा, उदानाय स्वाहा, समानाय स्वाहा। श्री महागणपतये मोदक-नैवेद्यं समर्पयामि।',
        meaningHi: 'पाँचों प्राणों के माध्यम से भगवान श्री महागणपति को यह सुमधुर मोदक नैवेद्य समर्पित है।'
      }
    ],
    aartiHi: 'जय गणेश जय गणेश जय गणेश देवा, माता जाकी पार्वती पिता महादेवा॥\nएकदन्त दयावन्त चार भुजा धारी, माथे पर तिलक सोहे मूसे की सवारी॥\nपान चढ़े फूल चढ़े और चढ़े मेवा, लड्डुअन का भोग लगे सन्त करें सेवा॥',
    conclusionHi: 'अंत में कर्पूर आरती के पश्चात हाथ में पुष्प लेकर प्रदक्षिणा व मंत्रपुष्पांजलि अर्पित करें तथा "आवाहनं न जानामि न जानामि विसर्जनम्..." बोलकर क्षमा प्रार्थना करें।',
    relatedPujaIds: ['puja_rudrabhishek', 'puja_satyanarayan', 'puja_lakshmi']
  },
  {
    id: 'puja_rudrabhishek',
    category: 'रुद्राभिषेक',
    titleHi: 'भगवान शिव महारुद्राभिषेक एवं पार्थिव शिव पूजन विधि',
    titleEn: 'Shiva Maharudrabhishek & Lingarchana Vidhi',
    duration: '६०-९० मिनट',
    introductionHi: 'अभिषेकप्रियः शिवः — देवाधिदेव महादेव को अभिषेक अत्यंत प्रिय है। शुक्ल यजुर्वेद के रुष्टाध्यायी (नमक-चमक) अथवा पंचाक्षर/महामृत्युंजय मंत्र द्वारा शिवलिंग का अभिषेक "रुद्राभिषेक" कहलाता है।',
    significanceHi: 'ग्रह दोष शांति, अकाल मृत्यु भय निवारण, रोग मुक्ति, उत्तम संतान, धन-समृद्धि एवं मोक्ष प्राप्ति के लिए रुद्राभिषेक अमोघ वैदिक अनुष्ठान है। (जल से वृष्टि, कुशोदक से रोग शांति, गोदुग्ध से संतान सुख, गन्ने के रस से लक्ष्मी प्राप्ति एवं मधु-घृत से ऐश्वर्य वृद्धि होती है)।',
    preparationHi: [
      'शिवालय में अथवा घर पर नर्मदेश्वर/पारद/पार्थिव शिवलिंग को उत्तर दिशा की ओर जलहरी का मुख रखते हुए स्थापित करें।',
      'श्रद्धालु स्वयं उत्तराभिमुख या पूर्वाभिमुख होकर बैठें।',
      'शृंगी (अभिषेक पात्र) या ताम्र/रजत पात्र में अभिषेक द्रव्य तैयार रखें (दूध के लिए तांबे का पात्र प्रयोग न करें—चांदी, पीतल या मिट्टी का पात्र लें)।'
    ],
    samagriList: [
      'गंगाजल मिश्रित शुद्ध जल, गाय का कच्चा दूध, दही, घी, शहद, शर्करा एवं गन्ने का रस',
      'बिल्वपत्र (३ या ५ दल वाले अखंडित बेलपत्र — चिकना भाग शिवलिंग को स्पर्श करे)',
      'भस्म (त्रिपुण्ड्र हेतु), श्वेत चंदन, अक्षत (बिना टूटे चावल), शमी पत्र, धतूरा, आक (मदार) के पुष्प',
      'भांग, बेर, ऋतुफल, नैवेद्य, जनेऊ, धूप, घी का दीपक एवं कर्पूर'
    ],
    sankalpaMantra: 'ॐ अद्य शुभपुण्यतिथौ मम सपरिवारस्य सकलग्रहदोषनिवारणार्थं आयुरारोग्यैश्वर्याभिवृद्ध्यर्थं श्रीसाम्बसदाशिवप्रीत्यर्थं रुद्राभिषेकपूजनं करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'गणेश-गौरी एवं कलश पूजन',
        instructionHi: 'सर्वप्रथम भगवान श्री गणेश, माता पार्वती (गौरी), नंदीश्वर और वरुण कलश का पूजन करें।',
        sanskritMantra: 'ॐ गौरीपद्माशचीमेधासावित्रीविजयाजयाः। देवसेना स्वधा स्वाहा मातरो लोकमातरः॥ ॐ साम्बसदाशिवाय नमः।',
        meaningHi: 'माता गौरी और भगवान सदाशिव को प्रणाम कर हम अभिषेक अनुष्ठान का आरंभ करते हैं।'
      },
      {
        stepNo: 2,
        titleHi: 'शिव ध्यान एवं पंचामृत अभिषेक',
        instructionHi: 'शिवलिंग पर पतली अविरल जलधारा एवं पंचामृत से अभिषेक करते हुए रुद्र सूक्त या पंचाक्षर मंत्र का पाठ करें।',
        sanskritMantra: 'ॐ नमः शम्भवाय च मयोभवाय च नमः शङ्कराय च मयस्कराय च नमः शिवाय च शिवतराय च॥\nकर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्। सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥',
        meaningHi: 'कल्याण और सुख के मूल स्रोत, शं (आनंद) करने वाले भगवान शंकर और परम मंगलकारी शिव को बारंबार नमस्कार है।'
      },
      {
        stepNo: 3,
        titleHi: 'भस्म त्रिपुण्ड्र एवं बिल्वपत्र अर्पण',
        instructionHi: 'शुद्ध जल से स्नान के पश्चात वस्त्र से पोंछकर चंदन व भस्म का त्रिपुण्ड्र लगाएं तथा उल्टा (चिकना भाग नीचे) बेलपत्र अर्पित करें।',
        sanskritMantra: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रयायुधम्।\nत्रिजन्मपापसंहारं बिल्वपत्रं शिवार्पणम्॥',
        meaningHi: 'तीन दलों वाला, सत्त्व-रज-तम तीनों गुणों का प्रतीक, त्रिनेत्रधारी शिव को प्रिय और तीन जन्मों के पापों का संहार करने वाला यह बिल्वपत्र भगवान शिव को समर्पित है।'
      }
    ],
    aartiHi: 'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा। ब्रह्मा विष्णु सदाशिव अर्द्धांगी धारा॥ ॐ जय शिव ओंकारा॥',
    conclusionHi: 'अभिषेक के अंत में महामृत्युंजय मंत्र की १०८ आहुति या जप कर कर्पूर आरती, भस्म धारण एवं शिव क्षमापन स्तोत्र का पाठ करें।',
    relatedPujaIds: ['puja_ganesh_shodashopachara', 'puja_navagraha', 'puja_satyanarayan']
  },
  {
    id: 'puja_satyanarayan',
    category: 'सत्यनारायण पूजा',
    titleHi: 'श्री सत्यनारायण व्रत कथा एवं षोडशोपचार पूजन विधि',
    titleEn: 'Shri Satyanarayan Vrat Katha & Puja Vidhi',
    duration: '६०-७५ मिनट',
    introductionHi: 'स्कंद पुराण के रेवाखंड में वर्णित भगवान श्री सत्यनारायण (सत्यस्वरूप श्री हरि विष्णु) का पूजन पूर्णिमा, एकादशी, संक्रांति अथवा किसी भी मनोकामना सिद्धि व मांगलिक अवसर पर किया जाता है।',
    significanceHi: 'सत्य को ही नारायण मानकर की जाने वाली यह पूजा पारिवारिक सुख-शांति, क्लेश निवारण, व्यापार-उन्नति और संतान कल्याण प्रदान करती है।',
    preparationHi: [
      'पूजा मंडप के चारों कोनों पर केले के खंभे (कदली स्तंभ) लगाएं।',
      'चौकी पर पीला वस्त्र बिछाकर मध्य में अष्टदल कमल पर कलश और उस पर शालिग्राम/श्री सत्यनारायण चित्रपट स्थापित करें।',
      'नवग्रह, पंचलोकपाल, गणपति-अंबिका की सुपारी स्थापित करें।'
    ],
    samagriList: [
      'सवाया प्रसाद (गेहूं के आटे या सूजी का घी-शर्करा युक्त पंजीरी/शीरा), पंचामृत, केले के फल, तुलसी दल',
      'पीले पुष्प, पीला वस्त्र, रोली, हल्दी, चंदन, अक्षत, पान, सुपारी, जनेऊ, कलावा, नारियल, आम्रपल्लव व कलश'
    ],
    sankalpaMantra: 'ॐ अद्य शुभपुण्यतिथौ मम सपरिवारस्य सकलमनोरथसिद्ध्यर्थं श्रीसत्यनारायणदेवताप्रीत्यर्थं सांगोपांगपूजनं कथाश्रवणं च करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'गणेश-अंबिका, वरुण कलश एवं नवग्रह पूजन',
        instructionHi: 'सर्वप्रथम गौरी-गणेश, वरुण कलश, षोडश मातृका और नवग्रह मण्डल का विधिवत पूजन करें।',
        sanskritMantra: 'ॐ ब्रह्मा मुरारिस्त्रिपुरांतकारी भानुः शशी भूमिसुतो बुधश्च। गुरुश्च शुक्रः शनिराहुकेतवः सर्वे ग्रहाः शान्तिकरा भवन्तु॥',
        meaningHi: 'ब्रह्मा, विष्णु, शिव तथा सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु—सभी नवग्रह हमारे लिए परम शांतिदायक हों।'
      },
      {
        stepNo: 2,
        titleHi: 'श्री सत्यनारायण षोडशोपचार पूजन एवं तुलसी अर्पण',
        instructionHi: 'भगवान शालिग्राम/सत्यनारायण को पंचामृत स्नान, पीताम्बर वस्त्र, पीले पुष्प, तुलसी मंजरी और सवाया शीरा नैवेद्य अर्पित करें।',
        sanskritMantra: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
        meaningHi: 'शेषनाग की शैया पर शयन करने वाले, कमलनाभ, लक्ष्मीपति और संसार के भय को हरने वाले सर्वलोकनाथ भगवान विष्णु को मैं वंदन करता हूँ।'
      },
      {
        stepNo: 3,
        titleHi: 'पञ्च अध्याय कथा श्रवण एवं हवन-आरती',
        instructionHi: 'स्कंद पुराणोक्त श्री सत्यनारायण व्रत कथा के पांचों अध्यायों का श्रद्धापूर्वक श्रवण करें, प्रत्येक अध्याय के अंत में शंखध्वनि कर पुष्प अर्पित करें।',
        sanskritMantra: 'ॐ नमो भगवते वासुदेवाय॥ सत्यव्रतं सत्यपरं त्रिसत्यं सत्यस्य योनिं निहितं च सत्ये।',
        meaningHi: 'सत्यव्रतधारी, सत्यपरायण और सत्य में प्रतिष्ठित भगवान श्री वासुदेव को नमन है।'
      }
    ],
    aartiHi: 'ॐ जय लक्ष्मी रमणा, स्वामी जय लक्ष्मी रमणा। सत्यनारायण स्वामी जन-पातक हरणा॥ ॐ जय लक्ष्मी रमणा॥',
    conclusionHi: 'आरती के पश्चात चरणामृत (तुलसी युक्त पंचामृत) और पंजीरी प्रसाद सभी श्रद्धालुओं में वितरित करें तथा ब्राह्मण को दक्षिणा व सीधा दान करें।',
    relatedPujaIds: ['puja_lakshmi', 'puja_griha_pravesh', 'puja_ganesh_shodashopachara']
  },
  {
    id: 'puja_lakshmi',
    category: 'लक्ष्मी पूजा',
    titleHi: 'श्री महालक्ष्मी-कुबेर एवं अष्टलक्ष्मी पूजन विधि',
    titleEn: 'Shri Mahalakshmi & Kubera Puja Vidhi',
    duration: '४५ मिनट',
    introductionHi: 'धन, ऐश्वर्य, सौभाग्य और व्यापार वृद्धि की अधिष्ठात्री भगवती महालक्ष्मी का पूजन दीपावली, शुक्रवार, शरद पूर्णिमा एवं धनतेरस पर विशेष रूप से किया जाता है।',
    significanceHi: 'श्रीसूक्त के १६ वैदिक मंत्रों एवं कमलगट्टे/गुलाब पुष्पों से महालक्ष्मी का अर्चन करने से अलक्ष्मी (दरिद्रता व ऋण) का नाश होता है और स्थायी सुख-समृद्धि प्राप्त होती है।',
    preparationHi: [
      'पूजा स्थान को गोमय या गंगाजल से शुद्ध कर रंगोली व स्वस्तिक बनाएं।',
      'चौकी पर लाल रेशमी वस्त्र बिछाकर श्री गणेश के दाहिनी ओर माता महालक्ष्मी को स्थापित करें।',
      'चांदी के सिक्के, श्रीयंत्र, कौड़ी व कमलगट्टे को थाल में रखें।'
    ],
    samagriList: [
      'कमल के पुष्प, गुलाब की पंखुड़ियां, कमलगट्टे के दाने, पीली कौड़ी, साबुत धनिया, खील-बताशे',
      'गाय का घी, पंचामृत, केसरिया खीर का भोग, अनार, श्रीफल (नारियल), सिन्दूर, रोली व अष्टगंध'
    ],
    sankalpaMantra: 'ॐ अद्य शुभपुण्यतिथौ मम गृहे चिरस्थायि-लक्ष्मीनिवासार्थं ऋणदरिद्रतानाशार्थं श्रीमहालक्ष्मीप्रीत्यर्थं श्रीसूक्तविधानेन पूजनं करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'श्री गणेश एवं कलश पूजन के पश्चात महालक्ष्मी आवाहन',
        instructionHi: 'हाथ में कमल पुष्प व अक्षत लेकर भगवती महालक्ष्मी और अष्टलक्ष्मी (आदि, धन, धान्य, गज, संतान, वीर, विजय, ऐश्वर्य लक्ष्मी) का आवाहन करें।',
        sanskritMantra: 'ॐ हिरण्यवर्णां हरिणीं सुवर्णरौप्यस्रजाम्। चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥',
        meaningHi: 'हे जातवेदा अग्निदेव! सुवर्ण के समान कांति वाली, सोने-चांदी की माला धारण करने वाली और चंद्रमा के समान शीतल-आनंदमयी भगवती लक्ष्मी का मेरे घर में आवाहन करें।'
      },
      {
        stepNo: 2,
        titleHi: 'श्रीयंत्र एवं कुबेर पूजन',
        instructionHi: 'श्रीयंत्र व चांदी के सिक्कों का पंचामृत से अभिषेक कर कुमकुम, अक्षत और कमल पुष्प चढ़ाएं तथा धनपति कुबेर का स्मरण करें।',
        sanskritMantra: 'ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा॥',
        meaningHi: 'यक्षराज, विश्रवा-पुत्र और धन-धान्य के अधिपति कुबेर देव हमें अखंड धन-धान्य एवं समृद्धि प्रदान करें।'
      }
    ],
    aartiHi: 'ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता। तुमको निशिदिन सेवत, हर विष्णु विधाता॥',
    conclusionHi: 'पूजन के उपरांत कनकधारा स्तोत्र एवं श्रीसूक्त का पाठ करें तथा घर के मुख्य द्वार व देवालय में घी के दीपक प्रज्वलित करें।',
    relatedPujaIds: ['puja_ganesh_shodashopachara', 'puja_satyanarayan', 'puja_griha_pravesh']
  },
  {
    id: 'puja_griha_pravesh',
    category: 'गृह प्रवेश',
    titleHi: 'वास्तु शांति एवं नूतन गृह प्रवेश वैदिक पूजन विधि',
    titleEn: 'Vastu Shanti & Griha Pravesh Vedic Puja Vidhi',
    duration: '९०-१२० मिनट',
    introductionHi: 'नवीन भवन निर्माण या जीर्णोद्धार के पश्चात शुभ मुहूर्त में द्वार पूजन, कलश यात्रा, वास्तु पुरुष मण्डल पूजन, नवग्रह हवन और गोदुग्ध उबालने की वैदिक विधि को गृह प्रवेश संस्कार कहते हैं।',
    significanceHi: 'भवन निर्माण के समय भूमि खनन आदि से हुए दोषों तथा वास्तु दोषों के निवारण और घर में सुख, आरोग्य व सकारात्मक ऊर्जा की प्रतिष्ठा हेतु वास्तु शांति अनिवार्य है।',
    preparationHi: [
      'मुख्य द्वार पर आम्रपल्लव व गेंदे के फूलों का तोरण (बंदनवार) बांधें तथा दोनों ओर पूर्ण कलश व केले के स्तंभ लगाएं।',
      'द्वार के दोनों ओर रोली-सिन्दूर से शुभ-लाभ और स्वस्तिक अंकित करें।',
      'यजमान दंपति सिर पर मंगल कलश और भगवान का चित्रपट लेकर दाहिना पैर आगे रखते हुए शंखध्वनि के साथ प्रवेश करें।'
    ],
    samagriList: [
      'ताम्र कलश, नारियल, आम के पत्ते, पंचरत्न, सप्तमृत्तिका, सप्तधान्य, सर्वौषधि',
      'वास्तु पुरुष प्रतिमा (चांदी या तांबे की), हवन कुंड, आम की समिधा, हवन सामग्री, शुद्ध घी, काले तिल, जौ',
      'नए पात्र में गाय का दूध (रसोई में प्रथम बार उबालने हेतु), गुड़, चावल व पीली सरसों'
    ],
    sankalpaMantra: 'ॐ अद्य शुभमुहूर्ते नूतनगृहे सकलवास्तुदोषशमनार्थं सुखशान्तिसमृद्धिप्राप्त्यर्थं वास्तुमण्डलपूजनं हवनं च करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'द्वार पूजन एवं मंगल कलश प्रवेश',
        instructionHi: 'मुख्य द्वार की चौखट (देहली) का हल्दी, कुमकुम, अक्षत व पुष्प से पूजन कर कलश सहित गृह में प्रवेश करें।',
        sanskritMantra: 'ॐ वास्तोष्पते प्रति जानीह्यस्मान् स्वावेशो अनमीवो भवा नः।\nयत्त्वेमहे प्रति तन्नो जुषस्व शं नो भव द्विपदे शं चतुष्पदे॥ (ऋग्वेद ७.५४.१)',
        meaningHi: 'हे वास्तुपति देव! आप हमें अपने आश्रित जानें, हमारे इस भवन को रोगरहित और शुभ प्रवेश वाला बनाएं। हमारे परिवार के समस्त प्राणियों का कल्याण करें।'
      },
      {
        stepNo: 2,
        titleHi: 'वास्तु मण्डल, नवग्रह पूजन एवं रसोई में दुग्ध उबालना',
        instructionHi: 'ईशान कोण में कलश स्थापित कर वास्तु देव व नवग्रह पूजन करें, रसोई में नए चूल्हे की पूजा कर दूध उबालें और खीर बनाकर भगवान को भोग लगाएं।',
        sanskritMantra: 'ॐ वास्तुपुरुषाय नमः, भूमिदेव्यै नमः, क्षेत्रपालाय नमः।',
        meaningHi: 'वास्तुपुरुष, भूमि देवी और क्षेत्रपाल देवता को हमारा सादर प्रणाम है।'
      }
    ],
    aartiHi: 'आरती कीजै श्री रघुवर जी की, वास्तु देव संग गौरी-गणपति की॥',
    conclusionHi: 'हवन में पूर्णाहुति के पश्चात रक्षासूत्र बांधें, ब्राह्मण भोज एवं कन्या पूजन कर सभी परिजनों को प्रसाद वितरित करें।',
    relatedPujaIds: ['puja_navagraha', 'puja_satyanarayan', 'puja_ganesh_shodashopachara']
  },
  {
    id: 'puja_navagraha',
    category: 'नवग्रह पूजा',
    titleHi: 'नवग्रह मण्डल शांति पूजन एवं तर्पण-हवन विधि',
    titleEn: 'Navagraha Shanti Mandala Puja & Havan Vidhi',
    duration: '६० मिनट',
    introductionHi: 'जन्मकुंडली में प्रतिकूल ग्रह दशा, गोचर पीड़ा अथवा किसी भी महापूजा में नवग्रह मण्डल (सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु) का आवाहन व शांति पूजन किया जाता है।',
    significanceHi: 'नवग्रहों की समिधाओं (आक, पलाश, खैर, अपामार्ग, पीपल, गूलर, शमी, दूर्वा, कुशा) से आहुति देने पर ग्रह जनित कष्ट शांत होते हैं और भाग्य का उदय होता है।',
    preparationHi: [
      'चौकी पर नवग्रह यंत्र अथवा नौ कोष्ठकों में ग्रहों के रंग के अनुसार अनाज (गेहूं, चावल, मसूर, मूंग, चना दाल, सफेद राजमा, काले तिल, उड़द, कुलथी) की ढेरियां बनाएं।',
      'मध्य में सूर्य एवं चारों दिशाओं में क्रमानुसार अन्य ८ ग्रहों की सुपारी स्थापित करें।'
    ],
    samagriList: [
      'नवग्रह समिधा (९ प्रकार की पवित्र लकड़ियां), नवधान्य (९ प्रकार के अनाज), पंचरत्न',
      'लाल, सफेद, पीला, हरा, नीला व काला वस्त्र टुकड़ा, घी, हवन सामग्री, तिल, जौ, गुग्गुल'
    ],
    sankalpaMantra: 'ॐ अद्य मम जन्मराशि-जन्मनक्षत्रवशात् प्रतिकूलग्रहपीड़ानिवारणार्थं नवग्रहशान्तिपूजनं करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'नवग्रह मण्डल आवाहन एवं पूजन',
        instructionHi: 'सूर्य से लेकर केतु तक प्रत्येक ग्रह का उनके वैदिक/लौकिक मंत्र से आवाहन कर गंध, अक्षत, पुष्प व नैवेद्य अर्पित करें।',
        sanskritMantra: 'ॐ आ कृष्णेन रजसा वर्तमानो निवेशयन्नमृतं मर्त्यं च। हिरण्ययेन सविता रथेना देवो याति भुवनानि पश्यन्॥ (सूर्याय नमः)',
        meaningHi: 'स्वर्णमय रथ पर आरूढ़ होकर समस्त लोकों को प्रकाशित करते हुए भगवान सूर्य नारायण पधारते हैं।'
      }
    ],
    aartiHi: 'जय कश्यप नन्दन, ॐ जय अदिति नन्दन। त्रिभुवन तिमिर निकन्दन, भक्त हृदय चन्दन॥',
    conclusionHi: 'पूजन के पश्चात प्रत्येक ग्रह के मंत्र से १०८ या २८ आहुतियां प्रदान करें और ग्रहों से संबंधित वस्तुओं का दान करें।',
    relatedPujaIds: ['puja_rudrabhishek', 'puja_griha_pravesh']
  },
  {
    id: 'puja_pitru_tarpan',
    category: 'तर्पण',
    titleHi: 'पितृ तर्पण एवं श्राद्ध कर्म की शास्त्रीय विधि',
    titleEn: 'Pitru Tarpan & Shraddha Karma Vedic Procedure',
    duration: '३०-४५ मिनट',
    introductionHi: 'देवता, ऋषि और अपने पूर्वजों (पितरों) की तृप्ति के लिए कुशा, काले तिल, जौ, अक्षत और जल से जो श्रद्धायुक्त जलांजलि अर्पित की जाती है, उसे "तर्पण" एवं "श्राद्ध" (श्रद्धया इदं श्राद्धम्) कहते हैं।',
    significanceHi: 'पितृपक्ष, अमावस्या तथा पूर्वजों की पुण्यतिथि पर तर्पण व श्राद्ध करने से पितृ दोष का शमन होता है और वंश-वृद्धि, आयु, बल व सौभाग्य का आशीर्वाद मिलता है।',
    preparationHi: [
      'पवित्र नदी तट पर अथवा घर में ताम्र या रजत पात्र में शुद्ध जल, गंगाजल, कच्चा दूध, काले तिल, जौ और श्वेत पुष्प मिलाएं।',
      'अनामिका उंगली में कुशा की पवित्री धारण करें।'
    ],
    samagriList: [
      'काले तिल (पितृ तर्पण हेतु), सफेद चावल (देव तर्पण हेतु), जौ (ऋषि तर्पण हेतु)',
      'कुशा (दर्भ), ताम्र पात्र, गंगाजल, गाय का कच्चा दूध, चंदन, सफेद पुष्प एवं जनेऊ'
    ],
    sankalpaMantra: 'ॐ अद्य शुभपुण्यतिथौ देव-ऋषि-मनुष्य-पितृतर्पणं करिष्ये।',
    steps: [
      {
        stepNo: 1,
        titleHi: 'देव तर्पण (पूर्वाभिमुख — सव्य जनेऊ, अंगुलियों के अग्रभाग से)',
        instructionHi: 'पूर्व दिशा की ओर मुख कर जनेऊ को बाएं कंधे पर (सव्य) रखें और अक्षत-जल से ब्रह्मादि देवताओं को एक-एक अंजलि दें।',
        sanskritMantra: 'ॐ ब्रह्मा तृप्यताम्। ॐ विष्णुस्तृप्यताम्। ॐ रुद्रस्तृप्यताम्। ॐ प्रजापतिस्तृप्यताम्।',
        meaningHi: 'ब्रह्मा, विष्णु, रुद्र और प्रजापति देवता हमारे द्वारा अर्पित इस जलांजलि से तृप्त हों।'
      },
      {
        stepNo: 2,
        titleHi: 'पितृ तर्पण (दक्षिणाभिमुख — अपसव्य जनेऊ, पितृतीर्थ/अंगूठे व तर्जनी के मध्य से)',
        instructionHi: 'दक्षिण दिशा की ओर मुख कर जनेऊ को दाएं कंधे पर (अपसव्य) रखें, बायां घुटना मोड़कर बैठें और काले तिल व कुशा से अंगूठे के सहारे (पितृतीर्थ से) तीन-तीन अंजलि अपने पूर्वजों का गोत्र व नाम लेकर अर्पित करें।',
        sanskritMantra: 'ॐ देवताभ्यः पितृभ्यश्च महायोगिभ्य एव च।\nनमः स्वधायै स्वाहायै नित्यमेव नमो नमः॥\n[गोत्र] गोत्रे अस्मत्पिता [नाम] शर्मा वसुरूपस्तृप्यताम् इदं तिलोदकं तस्मै स्वधा नमः।',
        meaningHi: 'समस्त देवताओं, पितरों, महायोगियों तथा स्वधा और स्वाहा देवी को हमारा नित्य प्रणाम है; हमारे पूर्वज इस तिलोदक से तृप्त हों।'
      }
    ],
    aartiHi: 'पितरेश्वर की आरती, श्रद्धा सुमन चढ़ाय। कुल के तारणहार हैं, चरणन शीश नवाय॥',
    conclusionHi: 'अंत में सूर्य भगवान को अर्घ्य दें, पंचबलि (गोबलि, श्वानबलि, काकबलि, देवादिबलि, पिपीलिकाबलि) निकालें और सुपात्र ब्राह्मण को भोजन व दक्षिणा कराएं।',
    relatedPujaIds: ['puja_satyanarayan', 'puja_rudrabhishek']
  }
];

// ============================================================================
// 3. MANTRA, STOTRA AND SHLOKA LIBRARY (15 CATEGORIES)
// ============================================================================

export interface MantraLibraryItem {
  id: string;
  category: string;
  titleHi: string;
  titleEn: string;
  deityHi: string;
  sanskritText: string;
  transliteration?: string;
  meaningHi: string;
  meaningEn?: string;
  benefitsHi: string;
  sourceReference: string;
  audioUrl?: string; // Strictly optional: audio player only shown if non-empty real URL exists
}

export const MANTRA_LIBRARY_CATEGORIES: string[] = [
  'वैदिक मंत्र',
  'गायत्री मंत्र',
  'महामृत्युंजय मंत्र',
  'नवग्रह मंत्र',
  'बीज मंत्र',
  'देवी मंत्र',
  'शिव मंत्र',
  'विष्णु मंत्र',
  'गणेश मंत्र',
  'स्तोत्र',
  'कवच',
  'सूक्त',
  'आरती',
  'संस्कृत सुभाषित',
  'प्रमुख श्लोक'
];

export const INITIAL_MANTRA_LIBRARY: MantraLibraryItem[] = [
  {
    id: 'ml_gayatri_1',
    category: 'गायत्री मंत्र',
    titleHi: 'वेदमाता सावित्री गायत्री महामंत्र',
    titleEn: 'Savitri Gayatri Mahamantra',
    deityHi: 'माँ वेदमाता गायत्री / सविता देव',
    sanskritText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    transliteration: 'Oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt.',
    meaningHi: 'उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा को हम अपनी अंतरात्मा में धारण करें; वह परमात्मा हमारी बुद्धि को सन्मार्ग में प्रेरित करे।',
    meaningEn: 'We meditate on the divine effulgence of the Supreme Creator Savitur; may He illuminate our intellect along the path of righteousness.',
    benefitsHi: 'प्रज्ञा, मेधा, आत्मबल की वृद्धि एवं समस्त पापों का विनाश।',
    sourceReference: 'ऋग्वेद ३.६२.१० / यजुर्वेद ३६.३ / सामवेद १४६२'
  },
  {
    id: 'ml_mahamrityunjaya_1',
    category: 'महामृत्युंजय मंत्र',
    titleHi: 'त्र्यम्बक महामृत्युंजय संजीवनी मंत्र (संपूर्ण संपुटित)',
    titleEn: 'Tryambaka Mahamrityunjaya Mantra',
    deityHi: 'भगवान मृत्युंजय महादेव',
    sanskritText: 'ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥ ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ॥',
    meaningHi: 'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो विश्व का पोषण करने वाले हैं। जिस प्रकार पका हुआ खरबूजा बेल के बंधन से स्वतः मुक्त हो जाता है, उसी प्रकार हम मृत्यु और रोग के बंधन से मुक्त होकर अमरत्व को प्राप्त करें।',
    meaningEn: 'We worship the three-eyed Lord Shiva who nourishes all beings; may He liberate us from the bondage of mortality and disease into immortality.',
    benefitsHi: 'अकाल मृत्यु निवारण, दीर्घायु, गंभीर रोग से रक्षा एवं अरिष्ट शांति।',
    sourceReference: 'ऋग्वेद ७.५९.१२ / शुक्ल यजुर्वेद ३.६०'
  },
  {
    id: 'ml_beej_1',
    category: 'बीज मंत्र',
    titleHi: 'प्रमुख वैदिक एवं तांत्रिक एकाक्षरी बीज मंत्र रहस्य',
    titleEn: 'Principal Sacred Seed (Beej) Mantras',
    deityHi: 'परब्रह्म एवं अधिष्ठात्री शक्तियाँ',
    sanskritText: '१. ॐ (प्रणव बीज — परब्रह्म)\n२. श्रीं (लक्ष्मी बीज — ऐश्वर्य एवं सौभाग्य)\n३. ह्रीं (भुवनेश्वरी/माया बीज — शक्ति एवं तेज)\n४. क्लीं (काम/कृष्ण बीज — आकर्षण एवं प्रेम)\n५. ऐं (सरस्वती वाग्भव बीज — विद्या एवं प्रज्ञा)\n६. गं (गणपति बीज — विघ्न नाश)\n७. दुं (दुर्गा बीज — रक्षा एवं अभय)\n८. ह्रौं (शिव बीज — आरोग्य एवं मोक्ष)',
    meaningHi: 'बीज मंत्र अत्यंत घनीभूत आध्यात्मिक स्पंदन हैं। जिस प्रकार सूक्ष्म बीज में विशाल वटवृक्ष छिपा रहता है, उसी प्रकार इन बीज मंत्रों के जप से संबंधित देवता की अनंत शक्ति जागृत होती है।',
    benefitsHi: 'चक्र जागरण, एकाग्रता एवं इष्ट देवता की शीघ्र कृपा प्राप्ति।',
    sourceReference: 'मंत्रमहोदधि एवं शारदातिलक तंत्र'
  },
  {
    id: 'ml_stotra_shiva_tandava',
    category: 'स्तोत्र',
    titleHi: 'शिव ताण्डव स्तोत्रम् (दशानन रावण विरचित)',
    titleEn: 'Shiva Tandava Stotram',
    deityHi: 'भगवान नटराज महादेव',
    sanskritText: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥ १॥\nजटाकटाहसम्भ्रमभ्रमान्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥ २॥',
    meaningHi: 'सघन जटारूपी वन से प्रवाहित होती हुई देवनदी गंगा की धाराओं से जिनका कंठ प्रक्षालित है, गले में विशाल सर्पों की माला लटकाए जो डमरू के डम-डम नाद के साथ प्रचंड तांडव करते हैं, वे भगवान शिव हमारा सब प्रकार से कल्याण करें। जिनके ललाट पर धधकती हुई अग्नि प्रज्वलित है और मस्तक पर बालचंद्र सुशोभित हैं, उन चंद्रशेखर में मेरी प्रतिक्षण प्रीति रहे।',
    meaningEn: 'May Lord Shiva, whose neck is sanctified by the flowing waters of the celestial Ganga from the forest of His matted locks, and who dances the fierce cosmic Tandava to the beat of His Damaru, shower auspiciousness upon us.',
    benefitsHi: 'अदम्य आत्मविश्वास, वाक्-सिद्धि, भय नाश एवं भगवान आशुतोष की प्रसन्नता।',
    sourceReference: 'रावणकृत शिवताण्डवस्तोत्रम्'
  },
  {
    id: 'ml_stotra_aditya_hridaya',
    category: 'स्तोत्र',
    titleHi: 'आदित्यहृदय स्तोत्रम् (महर्षि अगस्त्य प्रोक्त)',
    titleEn: 'Aditya Hridaya Stotram (Valmiki Ramayana)',
    deityHi: 'भगवान सूर्य नारायण',
    sanskritText: 'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥ १॥\nरश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम्।\nपूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम्॥ २॥\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्।\nजयावहं जपेन्नित्यमक्षय्यं परमं शिवम्॥ ३॥',
    meaningHi: 'युद्धभूमि में महर्षि अगस्त्य ने श्रीराम से कहा: हे राम! देवताओं और असुरों द्वारा वंदित, किरणों से शोभायमान तथा संपूर्ण भुवन के स्वामी भगवान भास्कर का पूजन करो। यह परम पुण्यमय आदित्यहृदय स्तोत्र समस्त शत्रुओं का नाश करने वाला, नित्य विजय दिलाने वाला और अक्षय कल्याणकारी है।',
    meaningEn: 'Sage Agastya instructed Lord Rama on the battlefield: Worship the rising Sun God Vivasvan, revered by deities and demons alike. This sacred Aditya Hridaya Stotra destroys all adversaries and bestows unfailing victory.',
    benefitsHi: 'हर प्रकार के संघर्ष और परीक्षा में विजय, तेज, आरोग्य एवं सूर्य ग्रह की अनुकूलता।',
    sourceReference: 'वाल्मीकि रामायण, युद्धकाण्ड सर्ग १०५'
  },
  {
    id: 'ml_kavach_ram_raksha',
    category: 'कवच',
    titleHi: 'श्री रामरक्षास्तोत्र कवचम् (बुधकौशिक ऋषि विरचित)',
    titleEn: 'Shri Rama Raksha Stotra Kavacham',
    deityHi: 'भगवान श्री सीताराम',
    sanskritText: 'चरितं रघुनाथस्य शतकोटिप्रविस्तरम्।\nएकैकमक्षरं पुंसां महापातकनाशनम्॥ १॥\nशिरो मे राघवः पातु भालं दशरथात्मजः।\nकौसल्यायो दृशौ पातु विश्वामित्रप्रियः श्रुती॥ २॥\nरामो राजमणिः सदा विजयते रामं रमेशं भजे\nरामेणाभिहता निशाचरचमू रामाय तस्मै नमः॥',
    meaningHi: 'भगवान रघुनाथ का चरित्र सौ करोड़ श्लोकों के समान विस्तृत है और उसका एक-एक अक्षर मनुष्यों के महापातकों का नाश करने वाला है। मेरे सिर की रक्षा राघव करें, मस्तक की रक्षा दशरथनंदन करें, नेत्रों की रक्षा कौसल्यानंदन करें और कानों की रक्षा विश्वामित्र के प्रिय श्रीराम करें।',
    meaningEn: 'The life of Lord Raghunatha spans a billion verses; every single syllable destroys the greatest sins. May Raghava protect my head, Dasharatha’s son my forehead, and Kausalya’s son my eyes.',
    benefitsHi: 'अभेद्य आध्यात्मिक सुरक्षा कवच, अरिष्ट निवारण एवं निर्भयता।',
    sourceReference: 'बुधकौशिकविरचितं श्रीरामरक्षास्तोत्रम्'
  },
  {
    id: 'ml_sukta_shri',
    category: 'सूक्त',
    titleHi: 'ऋग्वेदीय श्रीसूक्तम् (षोडश ऋचा)',
    titleEn: 'Rigvedic Shri Suktam',
    deityHi: 'भगवती महालक्ष्मी',
    sanskritText: 'ॐ हिरण्यवर्णां हरिणीं सुवर्णरौप्यस्रजाम्। चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥ १॥\nताम आवह जातवेदो लक्ष्मीमनपगामिनीम्। यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम्॥ २॥',
    meaningHi: 'हे जातवेदा अग्निदेव! आप सुवर्ण के समान ज्योतिर्मयी, सोने-चांदी के हार से सुशोभित, चंद्रमा के समान आनंददायिनी और कभी न छोड़कर जाने वाली (अनपगामिनी) भगवती महालक्ष्मी का मेरे गृह में आवाहन करें।',
    benefitsHi: 'अखंड लक्ष्मी कृपा, दरिद्रता एवं ऋण से पूर्ण मुक्ति।',
    sourceReference: 'ऋग्वेद खिलसूक्त (पञ्चम मण्डल परिशिष्ट)'
  },
  {
    id: 'ml_aarti_jagdish',
    category: 'आरती',
    titleHi: 'श्री जगदीश जी की आरती — ॐ जय जगदीश हरे',
    titleEn: 'Universal Aarti — Om Jai Jagdish Hare',
    deityHi: 'भगवान श्री हरि विष्णु / जगदीश्वर',
    sanskritText: 'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।\nभक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे॥ ॐ जय जगदीश हरे॥\nजो ध्यावे फल पावे, दुःख बिनसे मन का।\nसुख सम्पत्ति घर आवे, कष्ट मिटे तन का॥ ॐ जय जगदीश हरे॥\nमात-पिता तुम मेरे, शरण गहूँ किसकी।\nतुम बिन और न दूजा, आस करूँ जिसकी॥ ॐ जय जगदीश हरे॥',
    meaningHi: 'संपूर्ण जगत के स्वामी भगवान जगदीश्वर की जय हो, जो अपने भक्तों के संकटों को क्षण भर में दूर करते हैं।',
    benefitsHi: 'नित्य सायंकाल व प्रातः पूजन के अंत में परिवार की सुख-शांति एवं भक्ति वृद्धि।',
    sourceReference: 'पं. श्रद्धाराम फिल्लौरी रचित सनातन प्रार्थना'
  },
  {
    id: 'ml_subhashita_1',
    category: 'संस्कृत सुभाषित',
    titleHi: 'नीतिशतकम् एवं चाणक्य नीति के अमूल्य संस्कृत सुभाषित',
    titleEn: 'Immortal Sanskrit Subhashitas (Niti Shatakam)',
    deityHi: 'नीति एवं व्यवहार शास्त्र',
    sanskritText: '१. विद्या ददाति विनयं विनयाद्याति पात्रताम्।\nपात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्॥ (हितोपदेश)\n\n२. उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥ (पञ्चतन्त्र)\n\n३. परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः।\nपरोपकाराय दुहन्ति गावः परोपकारार्थमिदं शरीरम्॥',
    meaningHi: '१. विद्या विनय देती है, विनय से योग्यता आती है, योग्यता से धन की प्राप्ति होती है, धन से धर्म के कार्य होते हैं और धर्म से सच्चा सुख मिलता है।\n२. परिश्रम (उद्यम) से ही कार्य सिद्ध होते हैं, केवल मन की कल्पनाओं से नहीं; सोते हुए सिंह के मुख में हिरण स्वयं प्रवेश नहीं करते।\n३. वृक्ष परोपकार के लिए फल देते हैं, नदियाँ परोपकार के लिए बहती हैं, गायें परोपकार के लिए दूध देती हैं और यह मानव शरीर भी परोपकार के लिए ही मिला है।',
    meaningEn: '1. Knowledge bestows humility; from humility comes worthiness; from worthiness one attains wealth; from wealth comes righteous duty, and from that, true happiness. 2. Success is achieved through diligent effort, not mere wishful thinking.',
    benefitsHi: 'चरित्र निर्माण, जीवन प्रबंधन एवं नैतिक प्रज्ञा।',
    sourceReference: 'हितोपदेश, पञ्चतन्त्र एवं भर्तृहरि नीतिशतकम्'
  }
];

// ============================================================================
// 4. SANSKRIT LEARNING (संस्कृत शिक्षा — 4 LEVELS + LESSONS + QUIZZES)
// ============================================================================

export type SanskritLevelId = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type SanskritCourseLevel = SanskritLevelId;

export interface SanskritLesson {
  id: string;
  level: SanskritLevelId;
  levelLabelHi: string;
  levelLabelEn: string;
  topicCategory: string;
  titleHi: string;
  titleEn: string;
  sanskritExamples: string;
  explanationHi: string;
  explanationEn: string;
  vocabulary: Array<{ sanskrit: string; hindi: string; english: string }>;
  practiceSentences: Array<{ hindi: string; sanskrit: string; english: string }>;
  quiz: Array<{
    questionHi: string;
    options: string[];
    correctIndex: number;
    explanationHi: string;
  }>;
  displayOrder: number;
}

export const SANSKRIT_LEVELS: Array<{
  id: SanskritLevelId;
  titleHi: string;
  titleEn: string;
  badgeHi: string;
  descriptionHi: string;
}> = [
  {
    id: 'beginner',
    titleHi: 'स्तर १: प्रारंभिक (Beginner)',
    titleEn: 'Level 1: Beginner',
    badgeHi: 'वर्णमाला, उच्चारण एवं दैनिक शब्दावली',
    descriptionHi: 'माहेश्वर सूत्र, संस्कृत वर्णमाला (स्वर-व्यंजन), उच्चारण स्थान एवं सरल संभाषण शब्द'
  },
  {
    id: 'elementary',
    titleHi: 'स्तर २: प्राथमिक (Elementary)',
    titleEn: 'Level 2: Elementary',
    badgeHi: 'विभक्ति, शब्दरूप एवं धातुरूप (लकार)',
    descriptionHi: 'कारक व सप्त विभक्तियाँ, बालक/लता/फल शब्दरूप तथा पठ्/भू/गम् धातु के पंच लकार'
  },
  {
    id: 'intermediate',
    titleHi: 'स्तर ३: मध्यवर्ती (Intermediate)',
    titleEn: 'Level 3: Intermediate',
    badgeHi: 'संधि, समास एवं वाक्य अनुवाद अभ्यास',
    descriptionHi: 'स्वर-व्यंजन-विसर्ग संधि, षट् समास (अव्ययीभाव से बहुव्रीहि) एवं हिंदी से संस्कृत अनुवाद'
  },
  {
    id: 'advanced',
    titleHi: 'स्तर ४: उन्नत (Advanced)',
    titleEn: 'Level 4: Advanced',
    badgeHi: 'अष्टाध्यायी व्याकरण, छन्द एवं श्लोक अन्वय',
    descriptionHi: 'पाणिनीय व्याकरण सूत्र, अनुष्टुप्/इन्द्रवज्रा/मन्दाक्रान्ता छन्द एवं वैदिक-लौकिक श्लोक अन्वय'
  }
];

export const INITIAL_SANSKRIT_LESSONS: SanskritLesson[] = [
  {
    id: 'skt_lesson_1_varnamala',
    level: 'beginner',
    levelLabelHi: 'प्रारंभिक (Beginner)',
    levelLabelEn: 'Beginner',
    topicCategory: 'संस्कृत वर्णमाला एवं माहेश्वर सूत्र',
    titleHi: 'पाठ १: चतुर्दश माहेश्वर सूत्र, स्वर-व्यंजन एवं उच्चारण स्थान',
    titleEn: 'Lesson 1: 14 Maheshwara Sutras, Alphabet & Pronunciation Points',
    sanskritExamples: '१. अइउण् । २. ऋलृक् । ३. एओङ् । ४. ऐऔच् । ५. हयवरट् । ६. लण् । ७. ञमङणनम् । ८. झभञ् । ९. घढधष् । १०. जबगडदश् । ११. खफछठथचटतव् । १२. कपय् । १३. शषसर् । १४. हल् ॥\n\nउच्चारण सूत्र:\n• अकुहविसर्जनीयानां कण्ठः (अ, आ, क वर्ग, ह, विसर्ग — कंठ)\n• इचुयशानां तालु (इ, ई, च वर्ग, य, श — तालु)\n• ऋटुरषाणां मूर्धा (ऋ, ट वर्ग, र, ष — मूर्धा)\n• लृतुलसानां दन्ताः (लृ, त वर्ग, ल, स — दंत)\n• उपूपध्मानीयानामोष्ठौ (उ, ऊ, प वर्ग — ओष्ठ)',
    explanationHi: 'भगवान नटराज शिव के डमरू से निकले १४ माहेश्वर सूत्र महर्षि पाणिनि के संस्कृत व्याकरण (अष्टाध्यायी) की नींव हैं। संस्कृत में स्वरों को "अच्" (९ मूल स्वर) और व्यंजनों को "हल्" (३३ मूल व्यंजन) कहा जाता है। प्रत्येक अक्षर का मुख के भीतर एक निश्चित वैज्ञानिक उच्चारण स्थान (कंठ, तालु, मूर्धा, दंत, ओष्ठ, नासिका) है।',
    explanationEn: 'The 14 Maheshwara Sutras revealed from Lord Shiva’s Damaru form the foundation of Panini’s Sanskrit grammar. Vowels are called Ach (9) and consonants are called Hal (33), each with a precise phonetic articulation point.',
    vocabulary: [
      { sanskrit: 'हरिः ॐ / नमस्ते', hindi: 'नमस्कार / अभिवादन', english: 'Sacred Salutation' },
      { sanskrit: 'मम नाम ... अस्ति', hindi: 'मेरा नाम ... है', english: 'My name is ...' },
      { sanskrit: 'भवान् कथम् अस्ति?', hindi: 'आप कैसे हैं?', english: 'How are you?' },
      { sanskrit: 'अहं कुशली अस्मि', hindi: 'मैं कुशल हूँ', english: 'I am well' },
      { sanskrit: 'शोभनम् / उत्तमम्', hindi: 'बहुत अच्छा', english: 'Excellent / Good' }
    ],
    practiceSentences: [
      { hindi: 'आपका नाम क्या है?', sanskrit: 'भवतः नाम किम् अस्ति?', english: 'What is your name?' },
      { hindi: 'संस्कृत देववाणी है।', sanskrit: 'संस्कृतं देववाणी अस्ति।', english: 'Sanskrit is the divine language.' }
    ],
    quiz: [
      {
        questionHi: 'महर्षि पाणिनि के व्याकरण में "अच्" प्रत्याहार का क्या अर्थ है?',
        options: ['समस्त स्वर (Vowels)', 'समस्त व्यंजन (Consonants)', 'केवल विसर्ग', 'केवल अनुस्वार'],
        correctIndex: 0,
        explanationHi: 'माहेश्वर सूत्रों के प्रथम ४ सूत्रों (अइउण् से ऐऔच् तक) में सभी स्वर आते हैं, अतः स्वरों को "अच्" कहते हैं।'
      },
      {
        questionHi: '"अकुहविसर्जनीयानां कण्ठः" सूत्र के अनुसार क-वर्ग (क, ख, ग, घ, ङ) का उच्चारण स्थान क्या है?',
        options: ['तालु', 'दन्त', 'कण्ठ (Throat)', 'ओष्ठ'],
        correctIndex: 2,
        explanationHi: 'अ, आ, क-वर्ग, ह और विसर्ग का उच्चारण स्थान कण्ठ है।'
      }
    ],
    displayOrder: 1
  },
  {
    id: 'skt_lesson_2_vibhakti_lakara',
    level: 'elementary',
    levelLabelHi: 'प्राथमिक (Elementary)',
    levelLabelEn: 'Elementary',
    topicCategory: 'विभक्ति, शब्दरूप एवं धातुरूप (लकार)',
    titleHi: 'पाठ २: सप्त विभक्तियाँ, "राम" शब्दरूप एवं "पठ्" धातु (लट् व लृट् लकार)',
    titleEn: 'Lesson 2: Seven Cases (Vibhakti), Rama Declension & Path Verb Conjugation',
    sanskritExamples: 'अकारान्त पुल्लिंग "राम" शब्दरूप (एकवचन - द्विवचन - बहुवचन):\n• प्रथमा (कर्ता - ने): रामः - रामौ - रामाः\n• द्वितीया (कर्म - को): रामम् - रामौ - रामान्\n• तृतीया (करण - से/द्वारा): रामेण - रामाभ्याम् - रामैः\n• चतुर्थी (सम्प्रदान - के लिए): रामाय - रामाभ्याम् - रामेभ्यः\n• पञ्चमी (अपादान - से अलग): रामात् - रामाभ्याम् - रामेभ्यः\n• षष्ठी (सम्बन्ध - का/के/की): रामस्य - रामयोः - रामाणाम्\n• सप्तमी (अधिकरण - में/पर): रामे - रामयोः - रामेषु\n• सम्बोधन: हे राम! - हे रामौ! - हे रामाः!\n\n"पठ्" (पढ़ना) धातु — लट् लकार (वर्तमान काल):\n• प्रथम पुरुष: पठति - पठतः - पठन्ति\n• मध्यम पुरुष: पठसि - पठथः - पठथ\n• उत्तम पुरुष: पठामि - पठावः - पठामः',
    explanationHi: 'संस्कृत में तीन वचन (एकवचन, द्विवचन, बहुवचन), तीन लिंग (पुल्लिंग, स्त्रीलिंग, नपुंसकलिंग) और तीन पुरुष (प्रथम, मध्यम, उत्तम) होते हैं। क्रिया का रूप सदैव कर्ता के पुरुष और वचन के अनुसार लगता है (जैसे: सः पठति, त्वं पठसि, अहं पठामि)।',
    explanationEn: 'Sanskrit features three numbers (singular, dual, plural), three genders, and three persons. Verb endings strictly agree with the person and number of the subject.',
    vocabulary: [
      { sanskrit: 'सः / तौ / ते', hindi: 'वह / वे दोनों / वे सब', english: 'He / Both of them / They' },
      { sanskrit: 'त्वम् / युवाम् / यूयम्', hindi: 'तुम / तुम दोनों / तुम सब', english: 'You / Both of you / You all' },
      { sanskrit: 'अहम् / आवाम् / वयम्', hindi: 'मैं / हम दोनों / हम सब', english: 'I / Both of us / We all' },
      { sanskrit: 'गच्छति (गम् धातु)', hindi: 'जाता है', english: 'Goes' }
    ],
    practiceSentences: [
      { hindi: 'बालक वेद पढ़ता है।', sanskrit: 'बालकः वेदं पठति।', english: 'The boy reads the Veda.' },
      { hindi: 'हम सब विद्यालय जाते हैं।', sanskrit: 'वयं विद्यालयं गच्छामः।', english: 'We all go to school.' },
      { hindi: 'श्रीराम को नमस्कार है (नमः के योग में चतुर्थी)।', sanskrit: 'श्रीरामाय नमः।', english: 'Salutations to Lord Rama.' }
    ],
    quiz: [
      {
        questionHi: '"नमः स्वस्ति स्वाहा स्वधा..." सूत्र के अनुसार "नमः" शब्द के योग में कौन सी विभक्ति लगती है?',
        options: ['द्वितीया विभक्ति', 'चतुर्थी विभक्ति (जैसे: गणेशाय नमः)', 'षष्ठी विभक्ति', 'सप्तमी विभक्ति'],
        correctIndex: 1,
        explanationHi: '"नमः" के योग में सदैव चतुर्थी विभक्ति होती है, जैसे—शिवाय नमः, गुरवे नमः, श्रीगणेशाय नमः।'
      },
      {
        questionHi: '"अहम्" (मैं — उत्तम पुरुष एकवचन) के साथ "पठ्" धातु लट् लकार का कौन सा रूप लगेगा?',
        options: ['पठति', 'पठसि', 'पठामि', 'पठन्ति'],
        correctIndex: 2,
        explanationHi: 'उत्तम पुरुष एकवचन "अहम्" के साथ "पठामि" (अहं पठामि = मैं पढ़ता हूँ) का प्रयोग होता है।'
      }
    ],
    displayOrder: 2
  },
  {
    id: 'skt_lesson_3_sandhi_samasa',
    level: 'intermediate',
    levelLabelHi: 'मध्यवर्ती (Intermediate)',
    levelLabelEn: 'Intermediate',
    topicCategory: 'संधि एवं समास प्रकरण',
    titleHi: 'पाठ ३: त्रिविध संधि (स्वर, व्यंजन, विसर्ग) एवं षट् समास',
    titleEn: 'Lesson 3: Sandhi (Euphonic Combination) & Samasa (Compounds)',
    sanskritExamples: 'प्रमुख स्वर संधि सूत्र:\n१. दीर्घ संधि (अकः सवर्णे दीर्घः): हिम + आलयः = हिमालयः, विद्या + अर्थी = विद्यार्थी\n२. गुण संधि (आद्गुणः): महा + ईशः = महेशः, सूर्य + उदयः = सूर्योदयः\n३. वृद्धि संधि (वृद्धिरेचि): सदा + एव = सदैव, महा + औषधिः = महौषधिः\n४. यण् संधि (इको यणचि): इति + आदि = इत्यादि, सु + आगतम् = स्वागतम्\n५. अयादि संधि (एचोऽयवायावः): ने + अनम् = नयनम्, पो + अनः = पवनः\n\nप्रमुख समास के ६ भेद:\n१. अव्ययीभाव (यथाशक्ति = शक्तिम् अनतिक्रम्य)\n२. तत्पुरुष (राजपुरुषः = राज्ञः पुरुषः)\n३. कर्मधारय (नीलकमलम् = नीलं च तत् कमलम्)\n४. द्विगु (त्रिलोकी = त्रयाणां लोकानां समाहारः)\n५. द्वन्द्व (रामलक्ष्मणौ = रामश्च लक्ष्मणश्च)\n६. बहुव्रीहि (पीताम्बरः = पीतम् अम्बरं यस्य सः — श्रीविष्णुः)',
    explanationHi: 'दो वर्णों के अत्यंत निकट आने से जो ध्वनि परिवर्तन होता है उसे "संधि" कहते हैं, और अनेक पदों का मिलकर एक पद बन जाना "समास" (समसनं समासः) कहलाता है। संधि और समास के ज्ञान से गीता, उपनिषद और स्तोत्रों के लंबे श्लोकों का अर्थ स्वतः स्पष्ट हो जाता है।',
    explanationEn: 'Sandhi is the phonetic combination of adjacent letters, while Samasa is the compounding of multiple words into a single semantic unit. Mastering both unlocks direct comprehension of Sanskrit scriptures.',
    vocabulary: [
      { sanskrit: 'सूर्योदयः (सूर्य + उदयः)', hindi: 'सूर्य का उदय (गुण संधि)', english: 'Sunrise' },
      { sanskrit: 'स्वागतम् (सु + आगतम्)', hindi: 'शुभ आगमन (यण् संधि)', english: 'Welcome' },
      { sanskrit: 'चन्द्रशेखरः (बहुव्रीहि)', hindi: 'चंद्रमा है शिखर पर जिनके (शिव)', english: 'Lord Shiva' }
    ],
    practiceSentences: [
      { hindi: 'विद्या से ही अमृत की प्राप्ति होती है।', sanskrit: 'विद्यया अमृतमश्नुते (विद्ययाऽमृतमश्नुते)।', english: 'Through supreme knowledge one attains immortality.' }
    ],
    quiz: [
      {
        questionHi: '"सु + आगतम् = स्वागतम्" में किस संधि का प्रयोग हुआ है?',
        options: ['दीर्घ संधि', 'गुण संधि', 'यण् संधि (इको यणचि)', 'वृद्धि संधि'],
        correctIndex: 2,
        explanationHi: '"इको यणचि" सूत्र से उ के बाद भिन्न स्वर आ आने पर उ को व् आदेश होकर "स्वागतम्" बनता है।'
      },
      {
        questionHi: '"पीताम्बरः" (पीतम् अम्बरं यस्य सः — श्रीविष्णु) में कौन सा समास है?',
        options: ['द्वन्द्व समास', 'बहुव्रीहि समास', 'द्विगु समास', 'अव्ययीभाव समास'],
        correctIndex: 1,
        explanationHi: 'जहाँ दोनों पद मिलकर किसी तीसरे प्रधान अर्थ (भगवान विष्णु) की ओर संकेत करते हैं, वहाँ बहुव्रीहि समास होता है।'
      }
    ],
    displayOrder: 3
  },
  {
    id: 'skt_lesson_4_anvaya_chhanda',
    level: 'advanced',
    levelLabelHi: 'उन्नत (Advanced)',
    levelLabelEn: 'Advanced',
    topicCategory: 'श्लोक अन्वय एवं वैदिक-लौकिक छन्द',
    titleHi: 'पाठ ४: श्लोक अन्वय पद्धति (पदच्छेद, पदार्थ, अन्वय) एवं प्रमुख छन्द',
    titleEn: 'Lesson 4: Shloka Anvaya Methodology & Classical Sanskrit Meters',
    sanskritExamples: 'श्लोक अन्वय का उदाहरण (भगवद्गीता ४.७):\n• मूल श्लोक:\nयदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥\n\n• पदच्छेद (संधि विच्छेद):\nयदा यदा हि धर्मस्य ग्लानिः भवति भारत । अभ्युत्थानम् अधर्मस्य तदा आत्मानम् सृजामि अहम् ॥\n\n• अन्वय (गद्य क्रम — कर्ता, कर्म, क्रिया क्रम):\nहे भारत! यदा यदा हि धर्मस्य ग्लानिः, अधर्मस्य (च) अभ्युत्थानं भवति, तदा अहम् आत्मानं सृजामि।\n\n• अनुष्टुप् छन्द का लक्षण:\nश्लोके षष्ठं गुरु ज्ञेयं सर्वत्र लघु पञ्चमम्।\nद्विचतुष्पादयोर्ह्रस्वं सप्तमं दीर्घमन्ययोः॥ (प्रत्येक चरण में ८ अक्षर, कुल ३२ अक्षर)',
    explanationHi: 'संस्कृत श्लोक में छन्द की लय के कारण पद आगे-पीछे रहते हैं। श्लोक का अर्थ निकालने की ४ शास्त्रीय सीढ़ियाँ हैं: १. पदच्छेद (संधि अलग करना), २. पदार्थ (प्रत्येक पद की विभक्ति व अर्थ), ३. अन्वय (वाक्य को स्वाभाविक गद्य क्रम में लगाना), और ४. भावार्थ।',
    explanationEn: 'In Sanskrit poetry, word order is flexible due to metrical rules. The four classical steps to interpret any verse are Padaccheda (splitting Sandhis), Padartha (word analysis), Anvaya (prose syntax order), and Bhavartha (meaning).',
    vocabulary: [
      { sanskrit: 'पदच्छेदः', hindi: 'संधि युक्त पदों को अलग करना', english: 'Word splitting' },
      { sanskrit: 'अन्वयः', hindi: 'श्लोक के शब्दों को कर्ता-कर्म-क्रिया क्रम में लगाना', english: 'Prose order arrangement' },
      { sanskrit: 'अनुष्टुप् छन्दः', hindi: '३२ अक्षरों का सर्वाधिक प्रचलित श्लोक छन्द', english: 'Anushtup Meter (32 syllables)' }
    ],
    practiceSentences: [
      { hindi: 'धर्म की रक्षा करने वाले की धर्म रक्षा करता है।', sanskrit: 'धर्मो रक्षति रक्षितः।', english: 'Dharma protects those who protect Dharma.' }
    ],
    quiz: [
      {
        questionHi: 'वाल्मीकि रामायण और श्रीमद्भगवद्गीता के अधिकांश श्लोक किस छन्द में रचे गए हैं, जिसके प्रत्येक पाद (चरण) में ८ अक्षर और कुल ३२ अक्षर होते हैं?',
        options: ['अनुष्टुप् छन्द', 'मन्दाक्रान्ता छन्द', 'शिखरिणी छन्द', 'शार्दूलविक्रीडित छन्द'],
        correctIndex: 0,
        explanationHi: 'अनुष्टुप् छन्द में ४ चरण होते हैं और प्रत्येक चरण में ८ अक्षर (८ × ४ = ३२ अक्षर) होते हैं।'
      }
    ],
    displayOrder: 4
  }
];

// ============================================================================
// 5. TEMPLES AND TIRTHA (मंदिर एवं तीर्थ — 8 CATEGORIES)
// ============================================================================

export interface TempleTirthaItem {
  id: string;
  category: string;
  nameHi: string;
  nameEn: string;
  cityStateHi: string;
  deityHi: string;
  introductionHi: string;
  religiousSignificanceHi: string;
  historyHi: string;
  verifiedDarshanTimingsHi: string;
  addressHi: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  relatedIds: string[];
}

export const TEMPLE_CATEGORIES: string[] = [
  'द्वादश ज्योतिर्लिंग',
  'चार धाम',
  'शक्तिपीठ',
  'प्रमुख मंदिर',
  'तीर्थस्थल',
  'आश्रम',
  'पवित्र नदियाँ',
  'धार्मिक महत्व के स्थान'
];

export const INITIAL_TEMPLES: TempleTirthaItem[] = [
  {
    id: 'temple_kashi_vishwanath',
    category: 'द्वादश ज्योतिर्लिंग',
    nameHi: 'श्री काशी विश्वनाथ ज्योतिर्लिंग (एवं द्वादश ज्योतिर्लिंग स्तोत्र)',
    nameEn: 'Shri Kashi Vishwanath Jyotirlinga, Varanasi',
    cityStateHi: 'वाराणसी (काशी), उत्तर प्रदेश',
    deityHi: 'भगवान श्री विश्वेश्वर महादेव (सप्तम ज्योतिर्लिंग)',
    introductionHi: 'पतितपावनी माँ गंगा के पश्चिमी तट पर स्थित अविमुक्त क्षेत्र काशी में भगवान शिव स्वयं "विश्वनाथ" के रूप में विराजमान हैं। यहाँ द्वादश ज्योतिर्लिंगों का पुण्य स्मरण भी किया जाता है: १. सोमनाथ (गुजरात), २. मल्लिकार्जुन (श्रीशैलम, आंध्र प्रदेश), ३. महाकालेश्वर (उज्जैन), ४. ओंकारेश्वर (मध्य प्रदेश), ५. केदारनाथ (उत्तराखंड), ६. भीमाशंकर (महाराष्ट्र), ७. काशी विश्वनाथ (वाराणसी), ८. त्र्यम्बकेश्वर (नासिक), ९. वैद्यनाथ (देवघर), १०. नागेश्वर (द्वारका), ११. रामेश्वरम (तमिलनाडु), १२. घृष्णेश्वर (वेरुल, महाराष्ट्र)।',
    religiousSignificanceHi: 'स्कंद पुराण के काशीखंड के अनुसार काशी भगवान शिव के त्रिशूल पर बसी है और यहाँ देहत्याग करने वाले प्राणी को भगवान विश्वनाथ स्वयं तारक मंत्र का उपदेश देकर मोक्ष प्रदान करते हैं ("काश्यां मरणान्मुक्तिः")।',
    historyHi: 'अनादिकाल से पूजित इस ज्योतिर्लिंग का वर्तमान भव्य स्वर्ण शिखर युक्त मंदिर १७८० ई. में लोकमाता अहिल्याबाई होल्कर द्वारा पुनर्निर्मित कराया गया तथा महाराज रणजीत सिंह ने शिखर पर स्वर्ण मंडन कराया।',
    verifiedDarshanTimingsHi: 'मंगला आरती: प्रातः ०३:०० - ०४:०० | सामान्य दर्शन: प्रातः ०४:०० से रात्रि ११:०० | सप्तर्षि आरती: सायं ०७:०० | शृंगार/भोग आरती: रात्रि ०९:०० | शयन आरती: रात्रि १०:३०',
    addressHi: 'लाहोरी टोला, दशाश्वमेध घाट के समीप, वाराणसी, उत्तर प्रदेश - २२१००१',
    latitude: 25.3109,
    longitude: 83.0107,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_kedarnath', 'temple_mahakaleshwar', 'temple_rishikesh_tirtha']
  },
  {
    id: 'temple_kedarnath',
    category: 'द्वादश ज्योतिर्लिंग',
    nameHi: 'श्री केदारनाथ ज्योतिर्लिंग धाम (पंच केदार एवं उत्तराखंड चार धाम)',
    nameEn: 'Shri Kedarnath Jyotirlinga, Uttarakhand',
    cityStateHi: 'रुद्रप्रयाग, हिमालय, उत्तराखंड (ऊँचाई: ३,५८३ मीटर)',
    deityHi: 'भगवान श्री केदारेश्वर ज्योतिर्लिंग (पंचम ज्योतिर्लिंग)',
    introductionHi: 'मंदाकिनी नदी के पावन उद्गम तट पर हिमालय की हिमाच्छादित चोटियों के मध्य स्थित श्री केदारनाथ धाम द्वादश ज्योतिर्लिंगों में पंचम तथा उत्तराखंड के चार धामों (यमुनोत्री, गंगोत्री, केदारनाथ, बद्रीनाथ) का प्रमुख स्तंभ है।',
    religiousSignificanceHi: 'शिव पुराण के अनुसार पांडवों को गोत्रहत्या दोष से मुक्ति दिलाने हेतु भगवान शिव यहाँ महिष (भैंसे) के पृष्ठभाग रूपी त्रिकोणाकार ज्योतिर्लिंग के रूप में प्रतिष्ठित हुए।',
    historyHi: 'पांडवों द्वारा स्थापित और आदि जगद्गुरु शंकराचार्य द्वारा ८वीं शताब्दी में जीर्णोद्धार किया गया यह पाषाण मंदिर हिमयुग और प्राकृतिक आपदाओं के मध्य भी अडिग खड़ा है।',
    verifiedDarshanTimingsHi: 'कपाट खुलने का काल: अक्षय तृतीया (अप्रैल/मई) से भैया दूज (अक्टूबर/नवंबर) तक | प्रातः दर्शन: ०४:०० से दोपहर ०३:०० | सायं शृंगार व आरती दर्शन: सायं ०५:०० से रात्रि ०८:३० (शीतकाल में ऊखीमठ ओंकारेश्वर मंदिर में पूजा होती है)',
    addressHi: 'केदारनाथ धाम, जिला रुद्रप्रयाग, उत्तराखंड - २४६४४५',
    latitude: 30.7352,
    longitude: 79.0669,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_badrinath', 'temple_kashi_vishwanath', 'temple_rishikesh_tirtha']
  },
  {
    id: 'temple_badrinath',
    category: 'चार धाम',
    nameHi: 'श्री बद्रीनाथ धाम (चतुर्धाम — बद्रीनाथ, द्वारका, जगन्नाथ पुरी, रामेश्वरम)',
    nameEn: 'Shri Badrinath Dham, Uttarakhand',
    cityStateHi: 'चमोली, अलकनंदा तट, उत्तराखंड',
    deityHi: 'भगवान श्री बद्रीनारायण (चतुर्भुज ध्यानमग्न शालिग्राम विग्रह)',
    introductionHi: 'नर और नारायण पर्वतों के मध्य अलकनंदा नदी के तट पर स्थित श्री बद्रीनाथ धाम भारत के सनातन चार धामों (उत्तर में बद्रीनाथ, पश्चिम में द्वारका, पूर्व में जगन्नाथ पुरी, दक्षिण में रामेश्वरम) का प्रथम धाम है।',
    religiousSignificanceHi: 'यहाँ भगवान विष्णु ने बदरी (बेर) के वन में पद्मासन में बैठकर सहस्रों वर्षों तक तपस्या की थी और महर्षि वेदव्यास ने समीपस्थ माणा ग्राम की व्यास गुफा में वेदों का विभाजन व अष्टादश पुराणों की रचना की थी।',
    historyHi: 'आदि शंकराचार्य ने नारद कुंड से भगवान बद्रीनारायण के शालिग्राम विग्रह को निकालकर पुनः मंदिर के गर्भगृह में स्थापित किया। यहाँ मुख्य पुजारी केरल के नम्बूदरीपाद ब्राह्मण (रावल) होते हैं।',
    verifiedDarshanTimingsHi: 'अप्रैल/मई से नवंबर तक | प्रातः महाभिषेक व दर्शन: ०४:३० से दोपहर ०१:०० | सायं दर्शन व गीतगोविंद आरती: ०४:०० से रात्रि ०९:०० (शीतकाल में पांडुकेश्वर व जोशीमठ में पूजा)',
    addressHi: 'बद्रीनाथ पुरी, जिला चमोली, उत्तराखंड - २४६४२२',
    latitude: 30.7433,
    longitude: 79.4938,
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_kedarnath', 'temple_rishikesh_tirtha']
  },
  {
    id: 'temple_kamakhya_shaktipeeth',
    category: 'शक्तिपीठ',
    nameHi: 'माँ कामाख्या शक्तिपीठ एवं ५१ शक्तिपीठ परिचय',
    nameEn: 'Maa Kamakhya Shaktipeeth, Guwahati',
    cityStateHi: 'नीलाचल पर्वत, गुवाहाटी, असम',
    deityHi: 'महाविद्या माँ कामाख्या देवी',
    introductionHi: 'ब्रह्मपुत्र नदी के तट पर नीलाचल पर्वत पर स्थित माँ कामाख्या मंदिर ५१ शक्तिपीठों में सर्वोच्च सिद्ध पीठ है। अन्य प्रमुख शक्तिपीठों में ज्वालाजी, वैष्णो देवी, कालीघाट (कोलकाता), विशालाक्षी (काशी), हरसिद्धि (उज्जैन) और अम्बाजी (गुजरात) सम्मिलित हैं।',
    religiousSignificanceHi: 'कालिका पुराण एवं देवी भागवत के अनुसार दक्ष यज्ञ के पश्चात माता सती के अंग जहाँ-जहाँ गिरे, वे स्थान शक्तिपीठ बने। नीलाचल पर्वत पर सती का महामुद्रा (योनि) भाग गिरा था, जहाँ आषाढ़ मास में अम्बुबाची महापर्व मनाया जाता है।',
    historyHi: 'प्राचीन कामरूप राज्य से पूजित इस मंदिर का पुनर्निर्माण १६वीं शताब्दी में कोच राजवंश के महाराजा नरनारायण द्वारा कराया गया।',
    verifiedDarshanTimingsHi: 'प्रातः ०५:३० को नित्य स्नान व पूजन | भक्त दर्शन: प्रातः ०८:०० से दोपहर ०१:०० तथा दोपहर ०२:३० से सायं ०५:१५ | सायं आरती: ०७:३०',
    addressHi: 'नीलाचल पर्वत, कामाख्या, गुवाहाटी, असम - ७८१०१०',
    latitude: 26.1664,
    longitude: 91.7055,
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_kashi_vishwanath']
  },
  {
    id: 'temple_ayodhya_ram_mandir',
    category: 'प्रमुख मंदिर',
    nameHi: 'श्री राम जन्मभूमि मंदिर, अयोध्या धाम',
    nameEn: 'Shri Ram Janmabhoomi Mandir, Ayodhya Dham',
    cityStateHi: 'अयोध्या धाम, सरयू तट, उत्तर प्रदेश',
    deityHi: 'भगवान श्री रामलला विराजमान (बालक राम — ५ वर्षीय दिव्य स्वरूप)',
    introductionHi: 'सप्त पुरियों में प्रथम मोक्षदायिनी पुरी अयोध्या ("अयोध्या मथुरा माया काशी काञ्ची अवन्तिका, पुरी द्वारावती चैव सप्तैता मोक्षदायिकाः") में सरयू तट के समीप भगवान श्रीराम की पावन जन्मस्थली पर नागर शैली में निर्मित भव्य मंदिर।',
    religiousSignificanceHi: 'वाल्मीकि रामायण और स्कंद पुराण के अयोध्या माहात्म्य के अनुसार चैत्र शुक्ल नवमी को मर्यादा पुरुषोत्तम श्रीराम का यहीं प्राकट्य हुआ था।',
    historyHi: 'पारंपरिक नागर स्थापत्य शैली में बंसी पहाड़पुर के गुलाबी बलुआ पत्थरों से बिना लोहे के उपयोग के निर्मित इस भव्य मंदिर में २२ जनवरी २०२४ (पौष शुक्ल द्वादशी) को श्री रामलला की प्राण-प्रतिष्ठा संपन्न हुई।',
    verifiedDarshanTimingsHi: 'मंगला आरती: प्रातः ०४:३० | शृंगार आरती: प्रातः ०६:३० | सामान्य दर्शन: प्रातः ०७:०० से रात्रि ०९:३० | संध्या आरती: सायं ०७:३० | शयन आरती: रात्रि १०:००',
    addressHi: 'श्री राम जन्मभूमि पथ, अयोध्या धाम, उत्तर प्रदेश - २२४१२३',
    latitude: 26.7956,
    longitude: 82.1944,
    imageUrl: 'https://images.unsplash.com/photo-1706186736145-1c4f9200e004?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_kashi_vishwanath', 'temple_rishikesh_tirtha']
  },
  {
    id: 'temple_rishikesh_tirtha',
    category: 'तीर्थस्थल',
    nameHi: 'ऋषिकेश तीर्थ एवं त्रिवेणी घाट (योग व पंचांग की पावन भूमि)',
    nameEn: 'Rishikesh Tirtha, Triveni Ghat & Tapovan Ashrams',
    cityStateHi: 'ऋषिकेश, देहरादून/टिहरी गढ़वाल, उत्तराखंड',
    deityHi: 'भगवान श्री हृषीकेश नारायण एवं पतितपावनी माँ गंगा',
    introductionHi: 'हिमालय की तलहटी में जहाँ माँ गंगा पर्वतों से उतरकर समतल धरा में प्रवेश करती हैं, वह तपोभूमि ऋषिकेश (हृषीकेश — इंद्रियों के स्वामी भगवान विष्णु) प्राचीन ऋषियों, आश्रमों, संस्कृत विद्यापीठों और JyotishWala के मानक पंचांग (30.0869°N, 78.2676°E) का केंद्र है।',
    religiousSignificanceHi: 'केदारखंड के अनुसार महर्षि रैभ्य ने यहाँ कठोर तपस्या कर भगवान हृषीकेश का साक्षात्कार किया था। यहाँ त्रिवेणी घाट, भरत मंदिर, नीलकंठ महादेव, परमार्थ निकेतन, स्वर्गाश्रम और वशिष्ठ गुफा स्थित हैं।',
    historyHi: 'त्रिवेणी घाट पर गंगा, यमुना और सरस्वती का अंतःसलिला संगम माना जाता है। यहाँ प्रतिदिन सायंकाल होने वाली दिव्य गंगा आरती विश्वप्रसिद्ध है।',
    verifiedDarshanTimingsHi: 'त्रिवेणी घाट व परमार्थ निकेतन सायं गंगा आरती: ग्रीष्मकाल में सायं ०६:०० - ०७:०० | शीतकाल में सायं ०५:१५ - ०६:१५ | श्री भरत मंदिर दर्शन: प्रातः ०५:०० से रात्रि ०९:००',
    addressHi: 'त्रिवेणी घाट एवं तपोवन, ऋषिकेश, उत्तराखंड - २४९२०१',
    latitude: 30.0869,
    longitude: 78.2676,
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_kedarnath', 'temple_badrinath', 'temple_ganga_saptasindhu']
  },
  {
    id: 'temple_ganga_saptasindhu',
    category: 'पवित्र नदियाँ',
    nameHi: 'माँ गंगा एवं सप्त पवित्र नदियाँ (गंगा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिंधु, कावेरी)',
    nameEn: 'Maa Ganga & The Seven Sacred Rivers of Bharat',
    cityStateHi: 'गंगोत्री-गोमुख से गंगासागर तक (संपूर्ण भारतवर्ष)',
    deityHi: 'भगवती भागीरथी माँ गंगा एवं सप्तसिंधु तीर्थ',
    introductionHi: 'सनातन संस्कृति में नदियों को केवल जलस्रोत नहीं अपितु साक्षात् लोकमाता माना गया है। स्नान एवं संकल्प में प्रतिदिन सप्त नदियों का स्मरण किया जाता है: "गङ्गे च यमुने चैव गोदावरि सरस्वति। नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु॥"',
    religiousSignificanceHi: 'भगवान विष्णु के श्रीचरणों से निकली, भगवान शिव की जटाओं में विराजमान और राजर्षि भगीरथ की तपस्या से धरा पर अवतरित माँ गंगा के दर्शन, स्पर्श व स्नान से कोटि जन्मों के पाप नष्ट होते हैं। प्रयागराज, हरिद्वार, उज्जैन (शिप्रा) और नासिक (गोदावरी) में कुम्भ महापर्व आयोजित होता है।',
    historyHi: 'गंगा दशहरा (ज्येष्ठ शुक्ल दशमी) को माँ गंगा का पृथ्वी पर अवतरण दिवस मनाया जाता है।',
    verifiedDarshanTimingsHi: 'हर की पैड़ी (हरिद्वार), दशाश्वमेध घाट (काशी) एवं त्रिवेणी घाट (ऋषिकेश) पर नित्य प्रातः व सूर्यास्त समय भव्य गंगा आरती।',
    addressHi: 'गंगोत्री, देवप्रयाग, ऋषिकेश, हरिद्वार, प्रयागराज एवं काशी',
    latitude: 29.9560,
    longitude: 78.1710,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
    relatedIds: ['temple_rishikesh_tirtha', 'temple_kashi_vishwanath']
  }
];

// ============================================================================
// 6. YAJMAN & PUJA BOOKING SYSTEM (यजमान एवं पूजा बुकिंग)
// ============================================================================

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface PujaBookingRecord {
  id: string;
  pujaServiceTitle: string;
  pujaCategory: string;
  panditId: string;
  panditName: string;
  preferredDate: string;
  preferredTime: string;
  yajmanName: string;
  yajmanGotra: string;
  yajmanPravar?: string;
  yajmanPhone: string;
  yajmanEmail?: string;
  locationAddress: string;
  city: string;
  mode: 'in_person' | 'online_sankalp';
  specialInstructions?: string;
  dakshinaAmount: string;
  status: BookingStatus;
  adminOrPanditRemarks?: string;
  backendVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUS_LABELS: Record<
  BookingStatus,
  { hi: string; en: string; badgeClass: string }
> = {
  pending: {
    hi: 'लंबित (बैकएंड पुष्टि प्रतीक्षित)',
    en: 'Pending (Awaiting Backend Confirmation)',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
  },
  accepted: {
    hi: 'स्वीकार (पंडित जी द्वारा स्वीकृत)',
    en: 'Accepted by Pandit',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
  },
  confirmed: {
    hi: 'पुष्ट (बैकएंड द्वारा सत्यापित)',
    en: 'Confirmed (Backend Verified)',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  },
  in_progress: {
    hi: 'अनुष्ठान जारी',
    en: 'In Progress',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
  },
  completed: {
    hi: 'पूर्ण संपन्न',
    en: 'Completed',
    badgeClass: 'bg-[#008080] text-white border-[#008080]'
  },
  rejected: {
    hi: 'अस्वीकार',
    en: 'Rejected',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
  },
  cancelled: {
    hi: 'रद्द',
    en: 'Cancelled',
    badgeClass: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
  }
};

const STORAGE_KEY_BOOKINGS = 'jyotishwala_puja_bookings_v1';

export function getPujaBookings(): PujaBookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export async function createPujaBookingRequest(
  input: Omit<PujaBookingRecord, 'id' | 'status' | 'backendVerified' | 'createdAt' | 'updatedAt'>
): Promise<{ ok: boolean; booking: PujaBookingRecord; messageHi: string }> {
  const nowStr = new Date().toLocaleString('hi-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Strict Rule (Section 20): A booking must NEVER appear confirmed until confirmation comes from the backend!
  const newBooking: PujaBookingRecord = {
    ...input,
    id: `bk_${Date.now()}`,
    status: 'pending',
    backendVerified: false,
    createdAt: nowStr,
    updatedAt: nowStr
  };

  try {
    const base = getWpApiBaseUrl();
    const res = await fetch(`${base}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.bookingId) {
        newBooking.id = String(data.bookingId);
      }
    }
  } catch {
    // Saved locally in pending state and queued for WP backend sync
  }

  const existing = getPujaBookings();
  const updated = [newBooking, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    window.dispatchEvent(new Event('jyotishwala_bookings_changed'));
  } catch {
    // ignore
  }

  return {
    ok: true,
    booking: newBooking,
    messageHi:
      'आपका पूजा बुकिंग अनुरोध सफलतापूर्वक दर्ज कर लिया गया है। अभी स्थिति "लंबित (Pending)" है। वर्डप्रेस बैकएंड एवं आचार्य द्वारा सत्यापन के पश्चात ही बुकिंग "पुष्ट (Confirmed)" होगी।'
  };
}

export function updatePujaBookingStatusLocal(
  bookingId: string,
  nextStatus: BookingStatus,
  remarks?: string
): void {
  const list = getPujaBookings().map((b) =>
    b.id === bookingId
      ? {
          ...b,
          status: nextStatus,
          adminOrPanditRemarks: remarks ?? b.adminOrPanditRemarks,
          updatedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
        }
      : b
  );
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
    window.dispatchEvent(new Event('jyotishwala_bookings_changed'));
  } catch {
    // ignore
  }
}

// ============================================================================
// 7. PERSONAL LIBRARY (मेरा पुस्तकालय — BOOKMARKS, HISTORY, NOTES, DOCS)
// ============================================================================

export type LibraryItemType =
  | 'article'
  | 'shloka'
  | 'mantra'
  | 'puja'
  | 'sankalp_doc'
  | 'temple'
  | 'note';

export interface PersonalLibraryItem {
  id: string;
  itemType: LibraryItemType;
  refId: string;
  title: string;
  subtitle?: string;
  sanskritOrContent: string;
  meaningOrNotes?: string;
  savedAt: string;
}

export interface ReadingHistoryEntry {
  id: string;
  itemType: string;
  title: string;
  subtitle: string;
  targetPage: string;
  viewedAt: string;
}

const STORAGE_KEY_LIBRARY = 'jyotishwala_personal_library_v1';
const STORAGE_KEY_HISTORY = 'jyotishwala_reading_history_v1';
const STORAGE_KEY_SANSKRIT_PROGRESS = 'jyotishwala_sanskrit_progress_v1';

export function getPersonalLibraryItems(): PersonalLibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function isItemBookmarked(refId: string): boolean {
  return getPersonalLibraryItems().some((i) => i.refId === refId);
}

export function togglePersonalLibraryBookmark(
  item: Omit<PersonalLibraryItem, 'id' | 'savedAt'>
): { added: boolean; items: PersonalLibraryItem[] } {
  const existing = getPersonalLibraryItems();
  const exists = existing.some((i) => i.refId === item.refId);
  let updated: PersonalLibraryItem[];
  if (exists) {
    updated = existing.filter((i) => i.refId !== item.refId);
  } else {
    const newItem: PersonalLibraryItem = {
      ...item,
      id: `lib_${Date.now()}`,
      savedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    updated = [newItem, ...existing];
  }
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jyotishwala_library_changed'));
  } catch {
    // ignore
  }
  return { added: !exists, items: updated };
}

export function removePersonalLibraryItem(id: string): void {
  const updated = getPersonalLibraryItems().filter((i) => i.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jyotishwala_library_changed'));
  } catch {
    // ignore
  }
}

export function recordReadingHistory(entry: Omit<ReadingHistoryEntry, 'id' | 'viewedAt'>): void {
  try {
    const existing = getReadingHistory();
    const filtered = existing.filter((h) => h.title !== entry.title);
    const updated: ReadingHistoryEntry[] = [
      {
        ...entry,
        id: `hist_${Date.now()}`,
        viewedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
      },
      ...filtered
    ].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export interface SanskritProgressState {
  completedLessonIds: string[];
  quizScores: Record<string, { score: number; total: number; completedAt: string }>;
}

export function getSanskritProgress(): SanskritProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SANSKRIT_PROGRESS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.completedLessonIds)) return parsed;
    }
  } catch {
    // ignore
  }
  return { completedLessonIds: [], quizScores: {} };
}

export function saveSanskritQuizScore(lessonId: string, score: number, total: number): SanskritProgressState {
  const current = getSanskritProgress();
  const completedIds = current.completedLessonIds.includes(lessonId)
    ? current.completedLessonIds
    : [...current.completedLessonIds, lessonId];
  const next: SanskritProgressState = {
    completedLessonIds: completedIds,
    quizScores: {
      ...current.quizScores,
      [lessonId]: {
        score,
        total,
        completedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
      }
    }
  };
  try {
    localStorage.setItem(STORAGE_KEY_SANSKRIT_PROGRESS, JSON.stringify(next));
    window.dispatchEvent(new Event('jyotishwala_library_changed'));
  } catch {
    // ignore
  }
  return next;
}

// ============================================================================
// 8. PANDIT REGISTRATION & VERIFICATION STATUS (पंडित पंजीकरण एवं सत्यापन)
// ============================================================================

export type PanditVerificationStatus =
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'info_required';

export interface RegisteredPanditAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  languages: string[];
  education: string;
  karmakandQualification: string;
  experienceYears: number;
  specialServices: string[];
  dakshinaRange: string;
  availability: string;
  avatarUrl: string;
  certificateDetails: string;
  verificationStatus: PanditVerificationStatus;
  adminRemarks?: string;
  registeredAt: string;
}

export const PANDIT_VERIFICATION_LABELS: Record<
  PanditVerificationStatus,
  { hi: string; en: string; badgeClass: string }
> = {
  pending_verification: {
    hi: 'सत्यापन लंबित (Pending Backend Verification)',
    en: 'Verification Pending',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
  },
  verified: {
    hi: 'सत्यापित आचार्य (Backend Verified)',
    en: 'Verified Pandit',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
  },
  rejected: {
    hi: 'अस्वीकृत (Rejected)',
    en: 'Rejected',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
  },
  info_required: {
    hi: 'अतिरिक्त प्रमाणपत्र/जानकारी आवश्यक',
    en: 'Additional Information Required',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
  }
};

const STORAGE_KEY_PANDIT_ACCOUNTS = 'jyotishwala_pandit_accounts_v1';

export function getRegisteredPanditAccount(emailOrPhone?: string): RegisteredPanditAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PANDIT_ACCOUNTS);
    if (!raw) return null;
    const list: RegisteredPanditAccount[] = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return null;
    if (!emailOrPhone) return list[0];
    const q = emailOrPhone.toLowerCase().trim();
    return (
      list.find(
        (p) => p.email.toLowerCase() === q || p.phone.replace(/\D+/g, '') === q.replace(/\D+/g, '')
      ) || list[0]
    );
  } catch {
    return null;
  }
}

export async function saveRegisteredPanditAccount(
  account: RegisteredPanditAccount
): Promise<RegisteredPanditAccount> {
  try {
    const base = getWpApiBaseUrl();
    await fetch(`${base}/pandit-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    });
  } catch {
    // Queued locally if offline
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PANDIT_ACCOUNTS);
    const list: RegisteredPanditAccount[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((p) => p.id === account.id || p.email === account.email);
    if (idx >= 0) {
      list[idx] = account;
    } else {
      list.unshift(account);
    }
    localStorage.setItem(STORAGE_KEY_PANDIT_ACCOUNTS, JSON.stringify(list));
  } catch {
    // ignore
  }
  return account;
}

// ============================================================================
// 9. HELP AND SUPPORT (सहायता केंद्र, सामान्य प्रश्न एवं सहायता टिकट)
// ============================================================================

export interface SupportTicketItem {
  id: string;
  ticketType: 'support' | 'issue_report' | 'feedback';
  subject: string;
  category: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  message: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  adminResponse?: string;
  createdAt: string;
}

export const SUPPORT_FAQS: Array<{ category: string; qHi: string; aHi: string }> = [
  {
    category: 'पंचांग एवं स्थान',
    qHi: '१. JyotishWala पंचांग का डिफ़ॉल्ट मानक स्थान कौन सा है और क्या मैं इसे बदल सकता हूँ?',
    aHi: 'JyotishWala का प्रारंभिक मानक स्थान "ऋषिकेश, उत्तराखंड, भारत (30.0869°N, 78.2676°E, टाइमज़ोन: Asia/Kolkata)" है। आप होम स्क्रीन अथवा पंचांग पेज के स्थान बटन पर टैप करके भारत या विश्व का कोई भी शहर चुन सकते हैं।'
  },
  {
    category: 'जन्मकुंडली एवं गणना',
    qHi: '२. जन्मकुंडली और ग्रहों के अंश किस अयनांश पद्धति से गणना किए जाते हैं?',
    aHi: 'जन्मकुंडली (लग्न, चंद्र, नवमांश D9, विंशोत्तरी दशा और अष्टकूट मिलान) विशुद्ध लाहिड़ी चित्रापक्ष अयनांश (Lahiri Chitra Paksha Sidereal Ephemeris) पद्धति से गणना किए जाते हैं।'
  },
  {
    category: 'पूजा बुकिंग एवं भुगतान सत्यापन',
    qHi: '३. पूजा बुकिंग या दक्षिणा रसीद जमा करने के बाद पुष्टि (Confirmation) कब होती है?',
    aHi: 'सुरक्षा एवं पारदर्शिता नियमों के अंतर्गत केवल स्क्रीनशॉट या UTR नंबर डालने मात्र से भुगतान या बुकिंग स्वतः पुष्ट नहीं मानी जाती। वर्डप्रेस बैकएंड एडमिन द्वारा बैंक/UPI मिलान करने के पश्चात ही स्थिति "पुष्ट / स्वीकृत (Verified)" होती है।'
  },
  {
    category: 'पंडित पंजीकरण एवं बैज',
    qHi: '४. पंडित / पुरोहित खाते पर "सत्यापित आचार्य (Verified)" बैज कब मिलता है?',
    aHi: 'जब कोई आचार्य "पंडित / पुरोहित" खाता प्रकार चुनकर पंजीकरण करते हैं, तो प्रारंभिक स्थिति "सत्यापन लंबित" रहती है। वर्डप्रेस एडमिन पैनल द्वारा शैक्षणिक व कर्मकांड प्रमाणपत्रों की जाँच के बाद ही सत्यापित बैज प्रदर्शित होता है।'
  },
  {
    category: 'वेबसाइट लेख एवं ऑफलाइन मोड',
    qHi: '५. क्या मैं सहेजे गए श्लोक, मंत्र, पूजा विधि और लेख ऑफलाइन पढ़ सकता हूँ?',
    aHi: 'जी हाँ! आपके द्वारा "मेरा पुस्तकालय" में बुकमार्क किए गए सभी श्लोक, मंत्र, पूजा विधियाँ, संकल्प पत्र और पूर्व में लोड किए गए लेख ऑफलाइन मोड में भी उपलब्ध रहते हैं।'
  }
];

const STORAGE_KEY_TICKETS = 'jyotishwala_support_tickets_v1';

export function getSupportTickets(): SupportTicketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export async function submitSupportTicket(
  input: Omit<SupportTicketItem, 'id' | 'status' | 'createdAt'>
): Promise<SupportTicketItem> {
  const ticket: SupportTicketItem = {
    ...input,
    id: `TKT-${Date.now().toString().slice(-6)}`,
    status: 'open',
    createdAt: new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
  };

  try {
    const base = getWpApiBaseUrl();
    await fetch(`${base}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
  } catch {
    // Cached locally and synced when backend is reachable
  }

  const existing = getSupportTickets();
  try {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify([ticket, ...existing]));
  } catch {
    // ignore
  }
  return ticket;
}

// ============================================================================
// 10. ADMIN FEATURE REGISTRY & PLUGIN INTEGRATION MANIFEST (Section 2, 30, 36)
// ============================================================================

export interface AdminFeatureRegistryEntry {
  featureId: string;
  frontendFeatureNameHi: string;
  frontendFeatureNameEn: string;
  frontendComponent: string;
  adminPluginModule: string;
  requiredSettings: string[];
  databaseTables: string[];
  restEndpoints: string[];
  requiredPermissions: string;
  hasOnOffToggle: boolean;
  onOffSettingKey: string;
  contentManagementCapabilities: string;
  integrationStatus: 'active_connected' | 'active_with_backend_verification';
}

export const ADMIN_FEATURE_REGISTRY: AdminFeatureRegistryEntry[] = [
  {
    featureId: 'home_dashboard',
    frontendFeatureNameHi: '१. मुख्य पृष्ठ (Home Dashboard & Banners)',
    frontendFeatureNameEn: 'Home Dashboard & Hero Banners',
    frontendComponent: 'src/views/HomeView.tsx',
    adminPluginModule: '1. App Dashboard & 6. Home Screen & Banners (admin/pages/banners.php)',
    requiredSettings: ['enable_banners', 'home_sections_order', 'app_tagline_hi', 'app_tagline_en'],
    databaseTables: ['wp_jw_banners', 'wp_options (jw_app_settings)'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/content', 'GET /wp-json/jyotishwala/v1/banners'],
    requiredPermissions: 'manage_options (WP Administrator)',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_banners',
    contentManagementCapabilities: 'Add/Edit/Delete slides, reorder homepage sections, toggle modules, set CTA targets',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'gyan_vibhag',
    frontendFeatureNameHi: '२. संपूर्ण ज्ञान विभाग (वेद, उपनिषद, गीता, पुराण, इतिहास, दर्शन, दैनिक धर्म)',
    frontendFeatureNameEn: 'Complete Knowledge Section (7 Shastra Departments)',
    frontendComponent: 'src/views/GyanVibhagView.tsx',
    adminPluginModule: '11. Shastra, Puja, Sanskrit & Modules Hub -> Tab 1: ज्ञान विभाग (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_gyan', 'default_language'],
    databaseTables: ['wp_jw_knowledge'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/knowledge', 'POST /wp-json/jyotishwala/v1/knowledge'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_gyan',
    contentManagementCapabilities: 'Add/Edit/Delete Shastra chapters & verses, Sanskrit text, Hindi/English translations, Bhashya commentary, source reference, display order',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'wp_website_articles',
    frontendFeatureNameHi: '३. वेबसाइट लेख (WordPress Website Articles)',
    frontendFeatureNameEn: 'WordPress Website Editorial Articles',
    frontendComponent: 'src/views/ArticlesView.tsx',
    adminPluginModule: 'WordPress Core Posts + 2. Content -> Tab 8 (admin/pages/content.php)',
    requiredSettings: ['enable_articles'],
    databaseTables: ['wp_posts', 'wp_postmeta', 'wp_users', 'wp_terms'],
    restEndpoints: ['GET /wp-json/wp/v2/posts?_embed=1', 'GET /wp-json/jyotishwala/v1/articles'],
    requiredPermissions: 'edit_posts (WordPress Editorial Roles)',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_articles',
    contentManagementCapabilities: 'Managed directly via WordPress Posts editor; synced with authentic author avatar, bio, categories, tags & SEO metadata',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'puja_karmakand',
    frontendFeatureNameHi: '४. पूजा एवं कर्मकांड (१९ श्रेणियाँ व क्रमबद्ध पूजा विधि)',
    frontendFeatureNameEn: 'Puja & Vedic Karmakand Procedures',
    frontendComponent: 'src/views/PujaKarmakandView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 2: पूजा एवं कर्मकांड (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_puja_vidhi'],
    databaseTables: ['wp_jw_puja_vidhi'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/pujas'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_puja_vidhi',
    contentManagementCapabilities: 'Manage all 19 Puja categories, Samagri lists, preparation rules, step-by-step Vidhi, Sanskrit mantras, Sankalpa & Aarti',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'mantra_stotra_library',
    frontendFeatureNameHi: '५. मंत्र, स्तोत्र, कवच, सूक्त, आरती एवं १०८ जप माला',
    frontendFeatureNameEn: 'Mantra, Stotra & Shloka Library + 108 Japa Mala',
    frontendComponent: 'src/views/DharmaView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 3: मंत्र एवं स्तोत्र पुस्तकालय (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_dharma', 'enable_mantra_library'],
    databaseTables: ['wp_jw_mantras'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/mantras'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_dharma',
    contentManagementCapabilities: 'Manage 15 Mantra/Stotra/Kavach/Sukta categories, Sanskrit text, Hindi/English meaning, source reference & verified audio URL',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'panchang_calendar',
    frontendFeatureNameHi: '६. ऋषिकेश दैनिक एवं मासिक पंचांग, मुहूर्त व चौघड़िया',
    frontendFeatureNameEn: 'Rishikesh Daily & Monthly Panchang Engine',
    frontendComponent: 'src/views/PanchangView.tsx',
    adminPluginModule: '3. Panchang Management (admin/pages/panchang.php)',
    requiredSettings: ['enable_panchang', 'default_city_name', 'default_latitude', 'default_longitude', 'ayanamsha_type'],
    databaseTables: ['wp_options (jw_panchang_settings)', 'wp_jw_api_vault'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/panchang'],
    requiredPermissions: 'manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_panchang',
    contentManagementCapabilities: 'Configure default reference location (Rishikesh 30.0869°N, 78.2676°E), Ayanamsha, Paksha system, and element visibility checkboxes',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'tyohar_vrat',
    frontendFeatureNameHi: '७. सनातन व्रत एवं त्योहार कैलेंडर (८ विस्तृत अनुभाग)',
    frontendFeatureNameEn: 'Vrat, Festival & Parva Calendar',
    frontendComponent: 'src/views/TyoharView.tsx',
    adminPluginModule: '2. Content -> Tab 3: Sanatan Vrat & Tyohar (admin/pages/content.php)',
    requiredSettings: ['enable_tyohar'],
    databaseTables: ['wp_jw_tyohar'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/tyohar', 'GET /wp-json/jyotishwala/v1/content'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_tyohar',
    contentManagementCapabilities: 'Add/Edit/Delete festivals across years & months with all 8 detailed sections (Why celebrated, History, Puja Vidhi, Vrat rules, Mantra, Sankalp, Do/Donts, Daan)',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'vedic_jyotish_kundli',
    frontendFeatureNameHi: '८. वैदिक जन्मकुंडली, वर्ग चक्र (D1, D9, D10), दशा, गुण मिलान एवं गोचर',
    frontendFeatureNameEn: 'Vedic Jyotish, Kundli, Ashtakoot Milan, Dasha & Gochar',
    frontendComponent: 'src/views/KundliView.tsx, MilanView.tsx, GocharView.tsx, RashifalView.tsx',
    adminPluginModule: '4. Kundli & Jyotish Engine (admin/pages/kundli.php) & 2. Content -> Tab 8 (Rashifal)',
    requiredSettings: ['enable_kundli', 'enable_milan', 'enable_rashifal', 'enable_gochar', 'ayanamsha', 'chart_style_default'],
    databaseTables: ['wp_options (jw_kundli_settings)', 'wp_jw_rashifal'],
    restEndpoints: ['POST /wp-json/jyotishwala/v1/kundli/calculate', 'POST /wp-json/jyotishwala/v1/kundli/match', 'GET /wp-json/jyotishwala/v1/rashifal'],
    requiredPermissions: 'manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_kundli',
    contentManagementCapabilities: 'Configure Lahiri Ayanamsha, North/South Indian chart defaults, Dasha year length, Guna Milan threshold & Daily/Monthly/Yearly Rashifal',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'sanskrit_learning',
    frontendFeatureNameHi: '९. संस्कृत शिक्षा (४ स्तर, व्याकरण, संधि, समास, लकार एवं प्रश्नोत्तरी)',
    frontendFeatureNameEn: 'Sanskrit Learning Courses & Interactive Quizzes',
    frontendComponent: 'src/views/SanskritLearningView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 4: संस्कृत शिक्षा पाठ्यक्रम (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_sanskrit'],
    databaseTables: ['wp_jw_sanskrit_courses'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/sanskrit'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_sanskrit',
    contentManagementCapabilities: 'Add/Edit/Delete lessons across 4 levels (प्रारंभिक, प्राथमिक, मध्यवर्ती, उन्नत), vocabulary tables, translation exercises & MCQ quizzes',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'temples_tirtha',
    frontendFeatureNameHi: '१०. मंदिर एवं तीर्थ डायरेक्टरी (द्वादश ज्योतिर्लिंग, चार धाम, शक्तिपीठ, आश्रम व नदियाँ)',
    frontendFeatureNameEn: 'Temples, 12 Jyotirlingas, Char Dham & Sacred Tirtha Directory',
    frontendComponent: 'src/views/TemplesTirthaView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 5: मंदिर एवं तीर्थ प्रबंधन (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_temples'],
    databaseTables: ['wp_jw_temples'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/temples'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_temples',
    contentManagementCapabilities: 'Add/Edit/Delete temples & tirthas, verified Darshan/Aarti timings, history, coordinates & photos',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'pandit_services_and_dashboard',
    frontendFeatureNameHi: '११. पंडित सेवाएँ, मुख्य ज्योतिषाचार्य एवं पंडित डैशबोर्ड',
    frontendFeatureNameEn: 'Pandit Directory, Verification & Pandit Dashboard',
    frontendComponent: 'src/views/PanditChatView.tsx, src/views/PanditDashboardView.tsx',
    adminPluginModule: '2. Content -> Tab 1: Pandits & QR Codes + 11. Modules Hub -> Tab 7: पंडित सत्यापन',
    requiredSettings: ['enable_pandit_chat', 'enable_pandit_registration'],
    databaseTables: ['wp_jw_pandits'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/pandits', 'POST /wp-json/jyotishwala/v1/pandit-register'],
    requiredPermissions: 'manage_options (Super Admin for verification & QR codes)',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_pandit_chat',
    contentManagementCapabilities: 'Add/Edit/Delete Pandits, 1-click Make Chief Astrologer for Home Screen, review Pandit registrations & grant Verified badge',
    integrationStatus: 'active_with_backend_verification'
  },
  {
    featureId: 'yajman_puja_booking',
    frontendFeatureNameHi: '१२. यजमान पूजा बुकिंग एवं स्थिति ट्रैकिंग',
    frontendFeatureNameEn: 'Yajman Puja Booking & Status Workflow',
    frontendComponent: 'src/views/PujaBookingView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 6: यजमान पूजा बुकिंग (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_puja_booking'],
    databaseTables: ['wp_jw_bookings'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/bookings', 'POST /wp-json/jyotishwala/v1/bookings'],
    requiredPermissions: 'manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_puja_booking',
    contentManagementCapabilities: 'View Yajman booking requests, assign Pandit, update status (लंबित, स्वीकार, पुष्ट, जारी, पूर्ण, अस्वीकार, रद्द)',
    integrationStatus: 'active_with_backend_verification'
  },
  {
    featureId: 'sankalpa_document_generator',
    frontendFeatureNameHi: '१३. दैनिक संकल्प मंत्र एवं संकल्प पत्र जनरेटर (PDF व प्रिंट)',
    frontendFeatureNameEn: '13-Anga Dynamic Sankalpa & Document Generator',
    frontendComponent: 'src/views/SankalpView.tsx',
    adminPluginModule: '2. Content -> Tab 5: Sankalp Mantra Templates (admin/pages/content.php)',
    requiredSettings: ['enable_sankalp'],
    databaseTables: ['wp_options (jw_site_pages_content.sankalp)'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/content'],
    requiredPermissions: 'jw_manage_content / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_sankalp',
    contentManagementCapabilities: 'Manage Laghu & Vistrit Sankalp templates, Desh-Kala clauses, steps, benefits & notes',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'personal_library',
    frontendFeatureNameHi: '१४. मेरा पुस्तकालय (बुकमार्क, इतिहास, संस्कृत प्रगति, बुकिंग व रसीदें)',
    frontendFeatureNameEn: 'Personal Library (Bookmarks, History, Progress & Bookings)',
    frontendComponent: 'src/views/PersonalLibraryView.tsx',
    adminPluginModule: '5. App Users & 9. App Settings',
    requiredSettings: ['enable_personal_library'],
    databaseTables: ['wp_usermeta', 'wp_jw_bookings', 'wp_jw_receipts'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/user/profile'],
    requiredPermissions: 'Authenticated User / manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_personal_library',
    contentManagementCapabilities: 'Manage user library retention, saved items, booking records & verified payment receipts',
    integrationStatus: 'active_connected'
  },
  {
    featureId: 'payment_and_receipt_verification',
    frontendFeatureNameHi: '१५. दक्षिणा भुगतान एवं रसीद सत्यापन प्रणाली',
    frontendFeatureNameEn: 'UPI QR Payment & Receipt Verification System',
    frontendComponent: 'src/views/PanditChatView.tsx, src/views/PersonalLibraryView.tsx',
    adminPluginModule: '2. Content -> Tab 2: Consultation Payment Receipts (admin/pages/content.php)',
    requiredSettings: ['enable_pandit_chat'],
    databaseTables: ['wp_jw_receipts'],
    restEndpoints: ['POST /wp-json/jyotishwala/v1/receipts'],
    requiredPermissions: 'manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_pandit_chat',
    contentManagementCapabilities: 'Verify UTR numbers & receipt screenshots, approve/reject payments with admin remarks (no unverified auto-confirmation)',
    integrationStatus: 'active_with_backend_verification'
  },
  {
    featureId: 'help_and_support',
    frontendFeatureNameHi: '१६. सहायता केंद्र, सामान्य प्रश्न (FAQ) एवं सहायता टिकट',
    frontendFeatureNameEn: 'Help Center, FAQs & Support Ticket System',
    frontendComponent: 'src/views/HelpSupportView.tsx',
    adminPluginModule: '11. Modules Hub -> Tab 8: सहायता टिकट एवं FAQ (admin/pages/modules-hub.php)',
    requiredSettings: ['enable_support_tickets', 'contact_email', 'contact_phone'],
    databaseTables: ['wp_jw_support_tickets'],
    restEndpoints: ['GET /wp-json/jyotishwala/v1/support', 'POST /wp-json/jyotishwala/v1/support'],
    requiredPermissions: 'manage_options',
    hasOnOffToggle: true,
    onOffSettingKey: 'enable_support_tickets',
    contentManagementCapabilities: 'View user support tickets, bug reports & feedback, post official responses & update ticket status',
    integrationStatus: 'active_connected'
  }
];

export async function syncSanatanPlatformWithWp(): Promise<void> {
  try {
    const base = getWpApiBaseUrl();
    const res = await fetch(`${base}/knowledge`, { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const existingRaw = localStorage.getItem('jyotishwala_wp_sync_cache_v1');
        const existing = existingRaw ? JSON.parse(existingRaw) : {};
        localStorage.setItem(
          'jyotishwala_wp_sync_cache_v1',
          JSON.stringify({ ...existing, knowledge: json.data })
        );
      }
    }
  } catch {
    // Offline fallback uses pre-seeded authentic Shastra data
  }
}

