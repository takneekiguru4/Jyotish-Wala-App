/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MantraItem {
  id: string;
  title: string;
  deity: string;
  deityHindi: string;
  sanskrit: string;
  transliteration: string;
  meaningHindi: string;
  meaningEnglish: string;
  benefits: string;
  suggestedJapCount: number;
  beejMantra: string;
}

export interface GitaShloka {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaningHindi: string;
  meaningEnglish: string;
  context: string;
}

export interface PujaGuide {
  id: string;
  title: string;
  category: string;
  duration: string;
  samagri: string[];
  steps: { stepNumber: number; title: string; instruction: string; mantra?: string }[];
}

export const SACRED_MANTRAS: MantraItem[] = [
  {
    id: 'gayatri_mantra',
    title: 'महामंत्र: श्री गायत्री मंत्र',
    deity: 'Goddess Gayatri / Sun God',
    deityHindi: 'गायत्री माता / सविता देव',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    transliteration: 'Oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt.',
    meaningHindi: 'हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करें।',
    meaningEnglish: 'We meditate on that most adorable, desirable and effulgent light of the divine Sun; may that inspire and illuminate our intellects.',
    benefits: 'बुद्धि, ज्ञान, एकाग्रता, आत्मबल तथा सभी पापों का शमन।',
    suggestedJapCount: 108,
    beejMantra: 'ॐ भूर्भुवः स्वः'
  },
  {
    id: 'mahamrityunjaya_mantra',
    title: 'संजीवनी: महामृत्युंजय मंत्र',
    deity: 'Lord Shiva',
    deityHindi: 'भगवान शिव (त्र्यम्बक)',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
    transliteration: 'Oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam, urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt.',
    meaningHindi: 'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो सुगंधित हैं और जीवन को पुष्ट करते हैं। जिस प्रकार पका हुआ खरबूजा बेल के बंधन से मुक्त हो जाता है, उसी प्रकार हम मृत्यु के भय से मुक्त होकर मोक्ष को प्राप्त हों।',
    meaningEnglish: 'We worship the Three-eyed Lord who is fragrant and who nourishes all beings. As a ripe melon falls from its vine, may He liberate us from death for the sake of immortality.',
    benefits: 'अकाल मृत्यु से रक्षा, असाध्य रोगों का निवारण, भय मुक्ति एवं मोक्ष।',
    suggestedJapCount: 108,
    beejMantra: 'ॐ हौं जूं सः'
  },
  {
    id: 'ganesha_mool_mantra',
    title: 'विघ्नहर्ता: श्री गणेश मूल मंत्र',
    deity: 'Lord Ganesha',
    deityHindi: 'भगवान श्री गणेश',
    sanskrit: 'ॐ गं गणपतये नमः॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    transliteration: 'Oṃ gaṃ gaṇapataye namaḥ. Vakratuṇḍa mahākāya sūryakoṭi samaprabha, nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā.',
    meaningHindi: 'हे टेढ़ी सूंड वाले, विशाल शरीर वाले, करोड़ों सूर्यों के समान तेजस्वी देव! मेरे समस्त कार्यों को सदा निर्विघ्न संपन्न करें।',
    meaningEnglish: 'O Lord of curved trunk and immense form, whose brilliance rivals that of a million suns, please make all my endeavors free of obstacles forever.',
    benefits: 'सर्व कार्यों में सफलता, बुद्धि का विकास, विघ्न बाधाओं का समूल नाश।',
    suggestedJapCount: 108,
    beejMantra: 'गं (Gam)'
  },
  {
    id: 'maha_lakshmi_mantra',
    title: 'अष्टलक्ष्मी: श्री महालक्ष्मी मंत्र',
    deity: 'Goddess Lakshmi',
    deityHindi: 'मां महालक्ष्मी',
    sanskrit: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥ ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि। तन्नो लक्ष्मीः प्रचोदयात्॥',
    transliteration: 'Oṃ śrīṃ hrīṃ klīṃ śrīṃ siddha lakṣmyai namaḥ.',
    meaningHindi: 'हे सुख, ऐश्वर्य, सौभाग्य और सिद्धि प्रदान करने वाली भगवती महालक्ष्मी! मैं आपको नमन करता हूँ।',
    meaningEnglish: 'Om, salutations to Goddess Siddha Lakshmi, the embodiment of wealth, prosperity, auspiciousness, and spiritual abundance.',
    benefits: 'धन, धान्य, समृद्धि, पारिवारिक शांति एवं ऋण मुक्ति।',
    suggestedJapCount: 108,
    beejMantra: 'श्रीं (Shreem)'
  }
];

export const GITA_VERSES: GitaShloka[] = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'Karmaṇy-evādhikāras te mā phaleṣu kadācana, mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi.',
    meaningHindi: 'तुम्हारा केवल कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल की वासना वाले मत बनो और न ही तुम्हारी अकर्मण्यता (कर्म न करने) में आसक्ति हो।',
    meaningEnglish: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions. Never consider yourself the cause of results, nor be attached to inaction.',
    context: 'निष्काम कर्म योग का सार्वकालिक उपदेश, जो व्यक्ति को फल की चिंता से मुक्त कर कर्म की पराकाष्ठा सिखाता है।'
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    transliteration: 'Yadā yadā hi dharmasya glānir bhavati bhārata, abhyutthānam adharmasya tadātmānaṃ sṛjāmy aham.',
    meaningHindi: 'हे भारत (अर्जुन)! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने रूप को रचता हूँ अर्थात साकार रूप में प्रकट होता हूँ।',
    meaningEnglish: 'Whenever there is a decline in righteousness and an increase in unrighteousness, O Bharata, at that time I manifest Myself on earth.',
    context: 'भगवान का यह अमर वचन संसार में धर्म की पुनर्स्थापना और सज्जनों के संरक्षण का विश्वास दिलाता है।'
  },
  {
    chapter: 18,
    verse: 66,
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    transliteration: 'Sarva-dharmān parityajya mām ekaṃ śaraṇaṃ vraja, ahaṃ tvāṃ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ.',
    meaningHindi: 'सब धर्मों (कर्तव्यों एवं बंधनों) को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों से मुक्त कर दूँगा, तुम शोक मत करो।',
    meaningEnglish: 'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not despair.',
    context: 'गीता का चरम श्लोक (चरम संदेश) - परम शरणागति और आत्मसमर्पण का मार्ग।'
  }
];

export const DAILY_PUJA_GUIDE: PujaGuide = {
  id: 'daily_nitya_puja',
  title: 'दैनिक नित्य पूजा विधि (Panchopachara Puja)',
  category: 'नित्य कर्म',
  duration: '15-20 मिनट',
  samagri: [
    'शुद्ध जल व आचमनी पात्र',
    'दीपक (घी अथवा तिल के तेल का)',
    'धूपबत्ती व अगरबत्ती',
    'चंदन, कुमकुम व रोली',
    'अक्षत (अखंडित चावल)',
    'ताजे सुगंधित पुष्प व तुलसी पत्र',
    'भोग (मिश्री, फल अथवा मिष्ठान)'
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'पवित्रीकरण एवं दीप प्रज्वलन',
      instruction: 'पूजा वेदी के समक्ष पूर्वाभिमुख अथवा उत्तराभिमुख होकर बैठें। शुद्ध जल से स्वयं पर तथा पूजा सामग्री पर प्रोक्षण करें। घी का दीपक प्रज्वलित करें।',
      mantra: 'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत्पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥'
    },
    {
      stepNumber: 2,
      title: 'आचमन एवं प्राणायाम',
      instruction: 'दाहिने हाथ में जल लेकर तीन बार आचमन करें। यह मन, वाणी और शरीर की शुद्धि हेतु है।',
      mantra: 'ॐ केशवाय नमः, ॐ माधवाय नमः, ॐ नारायणाय नमः।'
    },
    {
      stepNumber: 3,
      title: 'संकल्प',
      instruction: 'दाहिने हाथ में अक्षत, पुष्प और जल लेकर अपने नाम, गोत्र एवं आज की तिथि का स्मरण करते हुए ईश्वर के प्रति समर्पण का संकल्प लें।'
    },
    {
      stepNumber: 4,
      title: 'गणेश एवं नवग्रह स्मरण',
      instruction: 'सर्वप्रथम विघ्नहर्ता भगवान श्री गणेश का ध्यान कर उन्हें रोली, अक्षत और पुष्प अर्पित करें।',
      mantra: 'ॐ गं गणपतये नमः।'
    },
    {
      stepNumber: 5,
      title: 'पंचोपचार पूजन',
      instruction: 'इष्टदेव को क्रमानुसार: 1. गंध (चंदन-रोली), 2. पुष्प, 3. धूप, 4. दीप, और 5. नैवेद्य (भोग) अर्पित करें।'
    },
    {
      stepNumber: 6,
      title: 'आरती एवं पुष्पांजलि',
      instruction: 'कर्पूर अथवा घी के दीप से भावविभोर होकर आरती करें तथा भगवान के चरणों में पुष्पांजलि समर्पित करें।'
    },
    {
      stepNumber: 7,
      title: 'क्षमा प्रार्थना',
      instruction: 'पूजा के अंत में जाने-अनजाने हुई त्रुटियों के लिए प्रभु से क्षमा याचना करें।',
      mantra: 'आवाहनं न जानामि न जानामि विसर्जनम्। पूजां चैव न जानामि क्षमस्व परमेश्वर॥'
    }
  ]
};

/**
 * Web Audio API synthesizer for sacred temple bell chime and om resonance!
 */
export function playTempleBellSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Sacred bell fundamental (~528Hz Solfeggio frequency + harmonics)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(524, ctx.currentTime + 3.0);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1056, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1048, ctx.currentTime + 2.5);

    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 3.3);
    osc2.stop(ctx.currentTime + 3.3);
  } catch {
    // Audio Context might require prior user interaction
  }
}
