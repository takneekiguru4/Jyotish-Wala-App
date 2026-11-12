import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Volume2,
  RotateCcw,
  Calendar,
  X,
  ArrowLeft,
  Disc,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import { LanguageCode } from '../types';
import { t } from '../i18n/translations';
import {
  MANTRA_LIBRARY_CATEGORIES,
  INITIAL_MANTRA_LIBRARY,
  MantraLibraryItem,
  isItemBookmarked,
  togglePersonalLibraryBookmark
} from '../services/sanatanPlatformService';

interface DharmaViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

interface MantraItem {
  id: string;
  title: string;
  deity: string;
  sanskrit: string;
  meaning: string;
  benefit: string;
  japaCountRecommended?: string;
}

const VEDIC_MANTRAS: MantraItem[] = [
  {
    id: 'gayatri',
    title: 'गायत्री महामंत्र',
    deity: 'माँ गायत्री / सविता देव',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    meaning: 'उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा को हम अपनी अंतरात्मा में धारण करें। वह परमात्मा हमारी बुद्धि को सन्मार्ग में प्रेरित करे।',
    benefit: 'बुद्धि, एकाग्रता, आत्मिक बल, तेज एवं समस्त पापों का क्षय।',
    japaCountRecommended: '108 बार नित्य (प्रातःकाल)'
  },
  {
    id: 'mahamrityunjaya',
    title: 'महामृत्युंजय मंत्र',
    deity: 'भगवान शिव',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥',
    meaning: 'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो समस्त जीवों का पोषण करने वाले हैं। जिस प्रकार पका हुआ खरबूजा बेल से स्वतः मुक्त हो जाता है, उसी प्रकार हम मृत्यु व व्याधि के बंधन से मुक्त होकर अमरत्व को प्राप्त हों।',
    benefit: 'अकाल मृत्यु भय नाशक, असाध्य रोग मुक्ति, दीर्घायु एवं ग्रह दोष शांति।',
    japaCountRecommended: '108 बार नित्य अथवा 1.25 लाख बार अनुष्ठान'
  },
  {
    id: 'ganesh',
    title: 'विघ्नहर्ता गणेश मंत्र',
    deity: 'भगवान श्री गणेश',
    sanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    meaning: 'घुमावदार सूंड वाले, विशाल शरीर वाले, करोड़ों सूर्यों के समान दिव्य तेजस्वी भगवान श्री गणेश, मेरे सभी शुभ कार्यों को सदा विघ्नरहित संपन्न करें।',
    benefit: 'नए कार्यों में सफलता, बुद्धि विकास एवं विघ्नों का शमन।',
    japaCountRecommended: '108 बार'
  },
  {
    id: 'lakshmi',
    title: 'महालक्ष्मी मंत्र',
    deity: 'माँ महालक्ष्मी',
    sanskrit: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः॥',
    meaning: 'समस्त ऐश्वर्य, ऋद्धि-सिद्धि और धन-धान्य की अधिष्ठात्री देवी माँ महालक्ष्मी को मेरा कोटि-कोटि नमन है।',
    benefit: 'आर्थिक दरिद्रता नाश, व्यापार में वृद्धि एवं ऐश्वर्य प्राप्ति।',
    japaCountRecommended: '108 बार (कमलगट्टे की माला से)'
  },
  {
    id: 'vishnu',
    title: 'श्री विष्णु भगवते मंत्र',
    deity: 'भगवान श्री हरि विष्णु',
    sanskrit: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्॥',
    meaning: 'जिनकी आकृति अत्यंत शांत है, जो शेषनाग की शैया पर शयन करते हैं, जिनकी नाभि में कमल है और जो संपूर्ण जगत के आधार हैं, उन भगवान विष्णु को मैं प्रणाम करता हूँ।',
    benefit: 'पारिवारिक सुख-शांति, गृह क्लेश निवारण, धर्म-वृद्धि एवं मोक्ष प्राप्ति।',
    japaCountRecommended: '108 बार (तुलसी की माला से)'
  },
  {
    id: 'hanuman',
    title: 'हनुमान मूल मंत्र',
    deity: 'श्री संकटमोचन हनुमान',
    sanskrit: 'ॐ हं हनुमते रुद्रात्मकाय हुं फट्॥',
    meaning: 'रुद्रावतार, असीम पराक्रमी एवं संकटमोचन भगवान श्री हनुमान जी को मेरा प्रणाम है, वे समस्त भयों और संकटों का संहार करें।',
    benefit: 'शत्रु बाधा, भय, भूत-पिशाच दोष व शनि की साढ़ेसाती में सुरक्षा।',
    japaCountRecommended: '108 बार'
  },
  {
    id: 'durga',
    title: 'माँ दुर्गा सर्वमंगल मंत्र',
    deity: 'माँ जगदम्बा दुर्गा',
    sanskrit: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    meaning: 'सब प्रकार का मंगल करने वाली, कल्याणमयी, समस्त पुरुषार्थों को सिद्ध करने वाली, शरणागतवत्सला, त्रिनेत्रा भगवती गौरी नारायणी को मेरा नमस्कार है।',
    benefit: 'संकट नाश, शक्ति-तेज वृद्धि, पारिवारिक रक्षा एवं सर्व कार्य सिद्धि।',
    japaCountRecommended: '108 बार'
  },
  {
    id: 'krishna',
    title: 'श्री कृष्ण क्लेशनाशक मंत्र',
    deity: 'भगवान श्री कृष्ण',
    sanskrit: 'कृष्णाय वासुदेवाय हरये परमात्मने। प्रणतः क्लेशनाशाय गोविन्दाय नमो नमः॥',
    meaning: 'वसुदेव नंदन भगवान श्री कृष्ण, समस्त दुखों को हरने वाले श्री हरि परमात्मा और शरणागत के क्लेशों का नाश करने वाले गोविंद को बारंबार प्रणाम है।',
    benefit: 'मानसिक क्लेश मुक्ति, संतान सुख, भक्ति और आनंद की प्राप्ति।',
    japaCountRecommended: '108 बार'
  },
  {
    id: 'saraswati',
    title: 'माँ सरस्वती विद्या मंत्र',
    deity: 'माँ शारदा सरस्वती',
    sanskrit: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता। या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥',
    meaning: 'जो कुंद के फूल, चंद्रमा और हिम के समान श्वेत हैं, शुभ्र वस्त्र धारण करती हैं और जिनके हाथों में वीणा शोभायमान है, वे माँ सरस्वती मेरी जड़ता को दूर करें।',
    benefit: 'शिक्षा व प्रतियोगी परीक्षाओं में सफलता, वाणी शुद्धि और ज्ञान वृद्धि।',
    japaCountRecommended: '108 बार'
  }
];

const NAVAGRAHA_LAUKIK_MANTRAS: MantraItem[] = [
  {
    id: 'sun_laukik',
    title: 'सूर्य देव लौकिक मंत्र',
    deity: 'भगवान सूर्य नारायण (रवि)',
    sanskrit: 'जपाकुसुम संकाशं काश्यपेयं महाद्युतिम्। तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥',
    meaning: 'गुड़हल के पुष्प के समान लाल कांति वाले, महर्षि कश्यप के तेजस्वी पुत्र, अंधकार के प्रबल शत्रु और समस्त पापों को हरने वाले भगवान सूर्य को मैं प्रणाम करता हूँ।',
    benefit: 'आत्मविश्वास, राजकीय मान-सम्मान, नेत्र सुरक्षा, पिता का सहयोग एवं हृदय स्वास्थ्य।',
    japaCountRecommended: '7,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'moon_laukik',
    title: 'चन्द्र देव लौकिक मंत्र',
    deity: 'भगवान चन्द्रमा (सोम)',
    sanskrit: 'दधिशंखतुषाराभं क्षीरोदार्णव संभवम्। नमामि शशिनं सोमं शम्भोर्मुकुट भूषणम्॥',
    meaning: 'दही, शंख और हिम के समान उज्ज्वल श्वेत, क्षीरसागर से प्रकट हुए तथा देवाधिदेव महादेव के मस्तक के मुकुट-आभूषण भगवान चंद्रमा को मैं नमन करता हूँ।',
    benefit: 'मानसिक शांति, तनाव व अनिद्रा निवारण, माता का स्वास्थ्य एवं चित्त स्थिरता।',
    japaCountRecommended: '11,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'mars_laukik',
    title: 'मंगल देव लौकिक मंत्र',
    deity: 'भगवान मंगल (भौम)',
    sanskrit: 'धरणीगर्भ संभूतं विद्युत्कान्ति समप्रभम्। कुमारं शक्तिहस्तं च मंगलं प्रणमाम्यहम्॥',
    meaning: 'पृथ्वी माता के गर्भ से उत्पन्न, बिजली के समान दैदीप्यमान कांति वाले, हाथ में शक्ति अस्त्र धारण करने वाले कुमार मंगल देव को मैं सादर प्रणाम करता हूँ।',
    benefit: 'मांगलिक दोष शांति, रक्त विकार निवारण, ऋण मुक्ति, साहस एवं भूमि-भवन लाभ।',
    japaCountRecommended: '10,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'mercury_laukik',
    title: 'बुध देव लौकिक मंत्र',
    deity: 'भगवान बुध (सौम्य)',
    sanskrit: 'प्रियंगुकलिकाश्यामं रूपेणाप्रतिमं बुधम्। सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्॥',
    meaning: 'प्रियंगु पुष्प की कली के समान हरित-श्याम वर्ण वाले, अनुपम रूपवान, परम सौम्य और शांत गुणों से युक्त बुध देव को मैं नमन करता हूँ।',
    benefit: 'तीक्ष्ण बुद्धि, वाक्पटुता, त्वचा विकार निवारण, वाणिज्य व व्यापार में अभूतपूर्व प्रगति।',
    japaCountRecommended: '9,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'jupiter_laukik',
    title: 'बृहस्पति देव लौकिक मंत्र',
    deity: 'देवगुरु बृहस्पति',
    sanskrit: 'देवानां च ऋषीणां च गुरुं काञ्चनसंनिभम्। बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥',
    meaning: 'समस्त देवताओं और महर्षियों के परम पूज्य गुरु, सुवर्ण के समान कांतिमान, बुद्धि के साक्षात स्वरूप और तीनों लोकों के स्वामी देवगुरु बृहस्पति को मैं प्रणाम करता हूँ।',
    benefit: 'ज्ञान, विवेक, उत्तम संतान सुख, विवाह बाधा निवारण, धन-समृद्धि एवं उच्च पद।',
    japaCountRecommended: '19,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'venus_laukik',
    title: 'शुक्र देव लौकिक मंत्र',
    deity: 'दैत्यगुरु शुक्र देव (भार्गव)',
    sanskrit: 'हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्। सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्॥',
    meaning: 'बर्फ, कुंद पुष्प और कमल की नाल के समान श्वेत कांति वाले, दैत्यों के पूज्य गुरु तथा समस्त शास्त्रों के मर्मज्ञ ज्ञाता महर्षि भृगुपुत्र शुक्र देव को मैं प्रणाम करता हूँ।',
    benefit: 'वैवाहिक सुख, ऐश्वर्य, आकर्षण, वाहन-भूमि सुख, कलात्मक सफलता व मधुमेह नियंत्रण।',
    japaCountRecommended: '16,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'saturn_laukik',
    title: 'शनि देव लौकिक मंत्र',
    deity: 'कर्मफलदाता शनि देव (सौरि)',
    sanskrit: 'नीलांजन समाभासं रविपुत्रं यमाग्रजम्। छायामार्तण्ड संभूतं तं नमामि शनैश्चरम्॥',
    meaning: 'नीले काजल के समान श्याम वर्ण वाले, भगवान सूर्य के पुत्र, यमराज के बड़े भ्राता तथा माता छाया व मार्तंड के पुत्र शनि देव को मैं बारंबार नमन करता हूँ।',
    benefit: 'साढ़ेसाती व ढैय्या शांति, असाध्य रोग-कष्ट निवारण, अनुशासन, न्याय एवं दीर्घायु।',
    japaCountRecommended: '23,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'rahu_laukik',
    title: 'राहु देव लौकिक मंत्र',
    deity: 'छाया ग्रह राहु (तमो)',
    sanskrit: 'अर्धकायं महावीर्यं चन्द्रादित्य विमर्दनम्। सिंहिकागर्भ संभूतं तं राहुं प्रणमाम्यहम्॥',
    meaning: 'आधे शरीर वाले, महापराक्रमी, सूर्य और चंद्रमा को अपनी छाया से ग्रसित करने वाले तथा माता सिंहिका के गर्भ से उत्पन्न राहु देव को मैं प्रणाम करता हूँ।',
    benefit: 'कालसर्प दोष शमन, आकस्मिक दुर्घटना-बाधा से रक्षा, गूढ़ शोध एवं विदेश सफलता।',
    japaCountRecommended: '18,000 बार (या नित्य 108 बार)'
  },
  {
    id: 'ketu_laukik',
    title: 'केतु देव लौकिक मंत्र',
    deity: 'मोक्षकारक केतु देव (शिखी)',
    sanskrit: 'पलाशपुष्प संकाशं तारकाग्रह मस्तकम्। रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम्॥',
    meaning: 'पलाश (ढाक) के लाल पुष्प के समान कांति वाले, नक्षत्रों व तारों के मस्तक स्वरूप तथा रौद्र व उग्र प्रकृति वाले मोक्षकारक केतु देव को मैं प्रणाम करता हूँ।',
    benefit: 'मोक्ष, आध्यात्मिक उत्थान, चर्म व गुप्त व्याधि निवारण, तंत्र-बाधा शांति एवं अंतर्दृष्टि।',
    japaCountRecommended: '17,000 बार (या नित्य 108 बार)'
  }
];

const FESTIVALS = [
  { name: 'अक्षय तृतीया', date: '19 अप्रैल 2026', paksha: 'वैशाख शुक्ल तृतीया', significance: 'अबूझ शुभ मुहूर्त, स्वर्ण खरीद एवं दान पुण्य का महापर्व।' },
  { name: 'गुरु पूर्णिमा', date: '29 जुलाई 2026', paksha: 'आषाढ़ शुक्ल पूर्णिमा', significance: 'महर्षि वेदव्यास जयंती एवं गुरु पूजन पर्व।' },
  { name: 'नाग पंचमी', date: '17 अगस्त 2026', paksha: 'श्रावण शुक्ल पंचमी', significance: 'कालसर्प दोष शांति पूजा एवं नाग देवता आराधना।' },
  { name: 'रक्षाबंधन', date: '28 अगस्त 2026', paksha: 'श्रावण शुक्ल पूर्णिमा', significance: 'भाई-बहन के पवित्र स्नेह एवं वैदिक रक्षासूत्र पर्व।' },
  { name: 'श्री कृष्ण जन्माष्टमी', date: '4 सितंबर 2026', paksha: 'भाद्रपद कृष्ण अष्टमी', significance: 'भगवान श्री कृष्ण का पावन जन्मोत्सव।' },
  { name: 'गणेश चतुर्थी', date: '14 सितंबर 2026', paksha: 'भाद्रपद शुक्ल चतुर्थी', significance: 'प्रथम पूज्य भगवान श्री गणेश स्थापना उत्सव।' },
  { name: 'शारदीय नवरात्रि प्रारंभ', date: '11 अक्टूबर 2026', paksha: 'आश्विन शुक्ल प्रतिपदा', significance: 'माँ दुर्गा के नौ स्वरूपों की शक्ति उपासना एवं कलश स्थापना।' },
  { name: 'विजयादशमी', date: '20 अक्टूबर 2026', paksha: 'आश्विन शुक्ल दशमी', significance: 'अधर्म पर धर्म की विजय एवं शस्त्र पूजन।' },
  { name: 'दीपावली महापर्व', date: '8 नवंबर 2026', paksha: 'कार्तिक अमावस्या', significance: 'श्री महालक्ष्मी-गणेश पूजन एवं दीपों का महापर्व।' },
  { name: 'देवउठनी एकादशी', date: '20 नवंबर 2026', paksha: 'कार्तिक शुक्ल एकादशी', significance: 'चातुर्मास समाप्त, तुलसी विवाह एवं मांगलिक कार्य प्रारंभ।' }
];

const INITIAL_VISIBLE_MANTRA_TABS = 4;

export default function DharmaView({ currentLang, onClosePage, onGoBack }: DharmaViewProps) {
  const [japaCount, setJapaCount] = useState<number>(0);
  const [malaCount, setMalaCount] = useState<number>(0);
  const [mantraTab, setMantraTab] = useState<'vedic' | 'navagraha'>('navagraha');
  const [selectedMantra, setSelectedMantra] = useState<MantraItem>(NAVAGRAHA_LAUKIK_MANTRAS[0]);
  const [isMantraTabsExpanded, setIsMantraTabsExpanded] = useState<boolean>(false);

  // Extended 15-Category Mantra, Stotra, Kavach, Sukta & Subhashita Library State
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>('all');
  const [copiedLibId, setCopiedLibId] = useState<string | null>(null);
  const [bookmarkTrigger, setBookmarkTrigger] = useState<number>(0);

  const handleJapaIncrement = () => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    } catch {
      // Ignore vibration error
    }

    if (japaCount + 1 > 108) {
      setJapaCount(1);
    } else if (japaCount + 1 === 108) {
      setJapaCount(108);
      setMalaCount((prev) => prev + 1);
    } else {
      setJapaCount((prev) => prev + 1);
    }
  };

  const handleResetJapa = () => {
    setJapaCount(0);
    setMalaCount(0);
  };

  const handleBookmarkLibraryItem = (item: MantraLibraryItem) => {
    togglePersonalLibraryBookmark({
      itemType: 'mantra',
      refId: item.id,
      title: item.titleHi,
      subtitle: `${item.category} • ${item.deityHi}`,
      sanskritOrContent: item.sanskritText,
      meaningOrNotes: `${item.meaningHi}\n\nसंदर्भ: ${item.sourceReference}`
    });
    setBookmarkTrigger((prev) => prev + 1);
  };

  const handleCopyLibraryItem = (item: MantraLibraryItem) => {
    const text = `${item.titleHi}\n\n${item.sanskritText}\n\nहिंदी अर्थ: ${item.meaningHi}\n(${item.sourceReference})`;
    navigator.clipboard?.writeText(text);
    setCopiedLibId(item.id);
    setTimeout(() => setCopiedLibId(null), 2000);
  };

  const filteredLibraryItems =
    selectedLibraryCategory === 'all'
      ? INITIAL_MANTRA_LIBRARY
      : INITIAL_MANTRA_LIBRARY.filter((m) => m.category === selectedLibraryCategory);

  const progressPercent = Math.min(100, Math.round((japaCount / 108) * 100));

  const currentMantraList =
    mantraTab === 'navagraha' ? NAVAGRAHA_LAUKIK_MANTRAS : VEDIC_MANTRAS;

  const displayedMantraTabs = isMantraTabsExpanded
    ? currentMantraList
    : currentMantraList.slice(0, INITIAL_VISIBLE_MANTRA_TABS);

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Card with Back and Close Buttons on One Row */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
        {/* Top Button Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="पिछले पृष्ठ पर वापस जाएं"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="पेज बंद करें"
          >
            <X className="w-4 h-4" />
            <span>{t('closePage', currentLang) || 'बंद करें'}</span>
          </button>
        </div>

        {/* Heading Row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7F33] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('dharma', currentLang) || 'सनातन धर्म, मंत्र, स्तोत्र एवं जप साधना'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              108 रुद्राक्ष जप माला, नवग्रह लौकिक मंत्र, 15-श्रेणी स्तोत्र-कवच-सूक्त पुस्तकालय एवं पर्व कैलेंडर
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Digital 108 Rudraksha Japa Mala (Single Card with All 108 Individual Beads & Progress Bar) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#112226] rounded-2xl p-5 border border-[#008080]/20 shadow-xs flex flex-col items-center justify-between gap-4">
          <div className="w-full">
            {/* Header: Label + Reset Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#008080]/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7F33] animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#008080] dark:text-teal-400">
                  डिजिटल 108 रुद्राक्ष जप माला
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetJapa}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>

            {/* 108-Bead Circular Rudraksha Mala Visual */}
            <div className="my-4 relative flex items-center justify-center">
              <div className="w-60 h-60 sm:w-64 sm:h-64 relative flex items-center justify-center">
                <svg
                  viewBox="0 0 260 260"
                  className="w-full h-full overflow-visible"
                  aria-label="108 रुद्राक्ष मनकों की माला"
                >
                  {/* Mala Thread Circle */}
                  <circle
                    cx="130"
                    cy="134"
                    r="108"
                    fill="none"
                    stroke="#FF7F33"
                    strokeOpacity="0.25"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />

                  {/* Top Sumeru (Guru) Bead above the 108 beads */}
                  <circle
                    cx="130"
                    cy="14"
                    r="6"
                    fill={japaCount === 108 ? '#FF7F33' : '#008080'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  >
                    <title>सुमेरु मनका (गुरु मनका)</title>
                  </circle>

                  {/* 108 Individual Rudraksha Beads around the circle */}
                  {Array.from({ length: 108 }).map((_, idx) => {
                    const beadNumber = idx + 1;
                    const angleDeg = -90 + (beadNumber * 360) / 108;
                    const angleRad = (angleDeg * Math.PI) / 180;
                    const radius = 108;
                    const cx = 130 + Math.cos(angleRad) * radius;
                    const cy = 134 + Math.sin(angleRad) * radius;
                    const isHighlighted = beadNumber <= japaCount;
                    const isCurrentBead = beadNumber === japaCount;

                    return (
                      <circle
                        key={beadNumber}
                        cx={cx}
                        cy={cy}
                        r={isCurrentBead ? 4.3 : isHighlighted ? 3.2 : 2.5}
                        fill={isHighlighted ? '#FF7F33' : '#7C3F1D'}
                        stroke={isCurrentBead ? '#FFF3E0' : isHighlighted ? '#E65100' : '#4E260E'}
                        strokeWidth={isCurrentBead ? 1.4 : 0.6}
                        opacity={isHighlighted ? 1 : 0.55}
                        className="transition-all duration-150"
                      >
                        <title>{`मनका ${beadNumber} / 108`}</title>
                      </circle>
                    );
                  })}
                </svg>

                {/* Inner Counter Center Display */}
                <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-[#008080]/30 flex flex-col items-center justify-center bg-white dark:bg-[#112226] shadow-inner text-center z-10 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-[#008080] dark:text-teal-300 tracking-tight font-mono">
                    {japaCount}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    / 108 दाने
                  </span>
                  <span className="text-[10px] font-extrabold text-[#FF7F33] mt-1">
                    {progressPercent}% पूर्ण
                  </span>
                </div>
              </div>
            </div>

            {/* Rudraksha Progress Bar Styled Cleanly */}
            <div className="space-y-1.5 px-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-[#FF7F33]" />
                  <span>माला प्रगति (प्रत्येक दाना नारंगी)</span>
                </span>
                <span className="text-[#008080] dark:text-teal-300 font-mono">
                  {japaCount} / 108
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-[#008080]/20 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#008080] via-[#FF7F33] to-amber-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  108 दाने पूर्ण होते ही माला संचित होगी
                </span>
                <span className="font-extrabold text-[#FF7F33]">
                  पूर्ण माला: {malaCount}
                </span>
              </div>
            </div>
          </div>

          {/* Big Tactile Japa Bead Button */}
          <button
            type="button"
            onClick={handleJapaIncrement}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF7F33] to-[#e66a20] hover:from-[#e66a20] hover:to-[#c85412] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>मनका फेरें / मंत्र जप (+1)</span>
          </button>
        </div>

        {/* 2. Vedic & Navagraha Laukik Mantra Sangrah (Single Card) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#112226] rounded-2xl p-5 border border-[#008080]/20 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#008080]" />
              सिद्ध मंत्र संग्रह
            </h2>

            {/* Category Tabs: Navagraha Laukik Mantras vs Vedic & Deity Mantras */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMantraTab('navagraha');
                  setSelectedMantra(NAVAGRAHA_LAUKIK_MANTRAS[0]);
                  setIsMantraTabsExpanded(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  mantraTab === 'navagraha'
                    ? 'bg-[#008080] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
                }`}
              >
                नवग्रह लौकिक मंत्र (9 ग्रह)
              </button>

              <button
                type="button"
                onClick={() => {
                  setMantraTab('vedic');
                  setSelectedMantra(VEDIC_MANTRAS[0]);
                  setIsMantraTabsExpanded(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  mantraTab === 'vedic'
                    ? 'bg-[#008080] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
                }`}
              >
                प्रमुख वैदिक एवं देव मंत्र ({VEDIC_MANTRAS.length})
              </button>
            </div>
          </div>

          {/* Mantra Selector Tabs: Shows 4 Tabs Initially + Expand/Collapse Tab for All Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {displayedMantraTabs.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMantra(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border shrink-0 ${
                  selectedMantra.id === m.id
                    ? 'bg-[#008080] text-white border-[#008080]'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#008080]/20 hover:border-[#008080]'
                }`}
              >
                {m.title.replace(' लौकिक मंत्र', '').replace(' महामंत्र', '')}
              </button>
            ))}

            {!isMantraTabsExpanded &&
              !displayedMantraTabs.some((m) => m.id === selectedMantra.id) && (
                <button
                  type="button"
                  onClick={() => setSelectedMantra(selectedMantra)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border shrink-0 bg-[#008080] text-white border-[#008080]"
                >
                  {selectedMantra.title.replace(' लौकिक मंत्र', '').replace(' महामंत्र', '')}
                </button>
              )}

            {currentMantraList.length > INITIAL_VISIBLE_MANTRA_TABS && (
              <button
                type="button"
                onClick={() => setIsMantraTabsExpanded((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer border border-[#FF7F33]/40 bg-[#FF7F33]/10 hover:bg-[#FF7F33] text-[#FF7F33] hover:text-white flex items-center gap-1 shrink-0"
              >
                <span>
                  {isMantraTabsExpanded
                    ? 'बंद करें (कम दिखाएं)'
                    : `+ सभी मंत्र देखें (${currentMantraList.length - INITIAL_VISIBLE_MANTRA_TABS} और)`}
                </span>
                {isMantraTabsExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Selected Mantra Full Details */}
          <div className="pt-3 border-t border-[#008080]/15 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedMantra.title}
                </h3>
                <span className="text-xs font-semibold text-[#FF7F33]">
                  अधिष्ठाता: {selectedMantra.deity}
                </span>
              </div>

              {selectedMantra.japaCountRecommended && (
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-[#008080] dark:text-teal-300 text-xs font-bold border border-[#008080]/20">
                  अनुशंसित जप: {selectedMantra.japaCountRecommended}
                </span>
              )}
            </div>

            {/* Sacred Sanskrit Text */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/25">
              <p className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200 text-center leading-relaxed tracking-wide font-serif">
                {selectedMantra.sanskrit}
              </p>
            </div>

            {/* Meaning & Benefits */}
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-[#008080]/15">
              <p className="leading-relaxed">
                <strong className="text-slate-900 dark:text-white">सरल भावार्थ:</strong>{' '}
                {selectedMantra.meaning}
              </p>
              <p className="text-[#008080] dark:text-teal-300 leading-relaxed font-semibold">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#FF7F33]" />
                <strong>जप फल एवं प्रभाव:</strong> {selectedMantra.benefit}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Extended 15-Category Mantra, Stotra, Kavach, Sukta, Aarti & Subhashita Library */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#008080]" />
              <span>मंत्र, स्तोत्र, कवच, सूक्त, आरती एवं संस्कृत सुभाषित पुस्तकालय (15 श्रेणियाँ)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              मूल संस्कृत पाठ, हिंदी-अंग्रेजी अर्थ, शास्त्र संदर्भ एवं "मेरा पुस्तकालय" बुकमार्क सुविधा
            </p>
          </div>
        </div>

        {/* 15 Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedLibraryCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLibraryCategory === 'all'
                ? 'bg-[#008080] text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#008080]'
            }`}
          >
            सभी १५ श्रेणियाँ ({INITIAL_MANTRA_LIBRARY.length})
          </button>
          {MANTRA_LIBRARY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedLibraryCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedLibraryCategory === cat
                  ? 'bg-[#FF7F33] text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#FF7F33]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Library Items */}
        <div className="space-y-3" data-trigger={bookmarkTrigger}>
          {filteredLibraryItems.map((item) => {
            const saved = isItemBookmarked(item.id);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-[#008080]/15 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#008080]/15 text-[#008080] dark:text-teal-300 text-[10px] font-bold">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-semibold text-[#FF7F33]">
                        • {item.deityHi}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {item.titleHi}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleBookmarkLibraryItem(item)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        saved
                          ? 'bg-[#FF7F33]/15 border-[#FF7F33] text-[#FF7F33]'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#008080]'
                      }`}
                      title="मेरा पुस्तकालय में सहेजें"
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLibraryItem(item)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#008080] cursor-pointer"
                      title="मंत्र कॉपी करें"
                    >
                      {copiedLibId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-[#FF7F33]">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-100 whitespace-pre-line leading-relaxed">
                    {item.sanskritText}
                  </p>
                </div>

                {/* Strictly render audio player ONLY when a real non-empty audioUrl exists */}
                {item.audioUrl && item.audioUrl.trim().length > 0 && (
                  <audio controls src={item.audioUrl} className="w-full h-9 mt-1" />
                )}

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>हिंदी अर्थ: </strong>
                  {item.meaningHi}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-[#008080]/10">
                  <span>
                    <strong className="text-[#008080] dark:text-teal-400">फलश्रुति:</strong>{' '}
                    {item.benefitsHi}
                  </span>
                  <span>संदर्भ: {item.sourceReference}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Upcoming Festivals & Ekadashi Calendar (Single Card with Flat Divider Rows & Year Included) */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 pb-2.5 border-b border-[#008080]/15 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FF7F33]" />
          प्रमुख सनातन व्रत एवं त्यौहार कैलेंडर (2026)
        </h2>

        <div className="divide-y divide-[#008080]/15">
          {FESTIVALS.map((fest, i) => (
            <div
              key={i}
              className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {fest.name}
                </h3>
                <p className="text-[11px] font-semibold text-[#008080] dark:text-teal-400 mt-0.5">
                  {fest.paksha}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {fest.significance}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#FF7F33]/15 text-[#FF7F33] text-xs font-bold whitespace-nowrap shrink-0">
                {fest.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


