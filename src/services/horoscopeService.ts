/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HoroscopePrediction, RashifalPeriod, TransitInfo } from '../types';

const STORAGE_KEY_HOROSCOPE = 'jyotishwala_rashifal_v3_';

export const INITIAL_DAILY_HOROSCOPE: HoroscopePrediction[] = [
  {
    signIndex: 0,
    signName: 'Aries',
    hindiName: 'मेष',
    symbol: '♈',
    dateRange: '21 मार्च - 19 अप्रैल',
    ruler: 'मंगल',
    element: 'अग्नि',
    general: 'आज आपका आत्मविश्वास प्रबल रहेगा। रुके हुए कार्य गति पकड़ेंगे और कार्यक्षेत्र में आपकी प्रशंसा होगी।',
    career: 'नवीन योजनाओं पर कार्य प्रारंभ करने के लिए अनुकूल समय है। वरिष्ठ अधिकारियों का पूर्ण सहयोग प्राप्त होगा।',
    love: 'जीवनसाथी के साथ सामंजस्य बढ़ेगा। परिवार में किसी मांगलिक आयोजन की रूपरेखा बनेगी।',
    health: 'ऊर्जावान महसूस करेंगे। मौसमी परिवर्तनों से सावधान रहें और जल का सेवन प्रचुर मात्रा में करें।',
    finance: 'आर्थिक स्थिति सुदृढ़ होगी। पूर्व में किए गए निवेश से आकस्मिक लाभ के शुभ संकेत हैं।',
    luckyNumber: 9,
    luckyColor: 'लाल',
    luckyColorHex: '#EF4444',
    luckyTime: 'प्रातः 09:15 - 11:00',
    remedy: 'हनुमान जी को सिन्दूर अर्पित करें और हनुमान चालीसा का पाठ करें।',
    rating: { career: 5, love: 4, health: 4, finance: 5 }
  },
  {
    signIndex: 1,
    signName: 'Taurus',
    hindiName: 'वृषभ',
    symbol: '♉',
    dateRange: '20 अप्रैल - 20 मई',
    ruler: 'शुक्र',
    element: 'पृथ्वी',
    general: 'धैर्य और समझदारी से काम लें। आज कला, संगीत और रचनात्मक कार्यों में आपकी विशेष रुचि रहेगी।',
    career: 'सहकर्मियों के साथ मिलकर किए गए कार्यों में सफलता मिलेगी। विवादों से दूरी बनाकर रखें।',
    love: 'प्रेम संबंधों में मधुरता रहेगी। किसी प्रियजन से उपहार मिलने के सुंदर योग हैं।',
    health: 'गले और कफ संबंधी विकार से बचें। शीतल पेय पदार्थों से परहेज करें।',
    finance: 'सुख-सुविधा की वस्तुओं पर व्यय हो सकता है। बजट बनाकर चलना श्रेयस्कर रहेगा।',
    luckyNumber: 6,
    luckyColor: 'सफेद',
    luckyColorHex: '#E2E8F0',
    luckyTime: 'दोपहर 01:30 - 03:00',
    remedy: 'मां महालक्ष्मी को सफेद पुष्प अथवा खीर का भोग लगाएं।',
    rating: { career: 4, love: 5, health: 4, finance: 4 }
  },
  {
    signIndex: 2,
    signName: 'Gemini',
    hindiName: 'मिथुन',
    symbol: '♊',
    dateRange: '21 मई - 20 जून',
    ruler: 'बुध',
    element: 'वायु',
    general: 'वाणी में मधुरता और बौद्धिक आकर्षण रहेगा। मित्रों और व्यापारिक साझेदारों से महत्वपूर्ण चर्चा होगी।',
    career: 'मीडिया, शिक्षा और लेखन क्षेत्र से जुड़े लोगों के लिए आज का दिन उपलब्धियां लाएगा।',
    love: 'पुराने मतभेद सुलझेंगे। परस्पर संवाद से प्रेम में प्रगाढ़ता आएगी।',
    health: 'मानसिक तनाव से मुक्ति मिलेगी। प्रातःकाल ध्यान और प्राणायाम करना लाभदायक सिद्ध होगा।',
    finance: 'लेन-देन में सावधानी बरतें। नया अनुबंध प्राप्त होने से धन प्रवाह बढ़ेगा।',
    luckyNumber: 5,
    luckyColor: 'हरा',
    luckyColorHex: '#10B981',
    luckyTime: 'सायं 04:00 - 05:30',
    remedy: 'गाय को हरा चारा खिलाएं और गणेश जी की उपासना करें।',
    rating: { career: 5, love: 4, health: 4, finance: 4 }
  },
  {
    signIndex: 3,
    signName: 'Cancer',
    hindiName: 'कर्क',
    symbol: '♋',
    dateRange: '21 जून - 22 जुलाई',
    ruler: 'चन्द्र',
    element: 'जल',
    general: 'भावुकता पर नियंत्रण रखें। माताजी का आशीर्वाद प्राप्त होगा और गृहस्थ जीवन में शांति का वास रहेगा।',
    career: 'कार्यस्थल पर अतिरिक्त जिम्मेदारियां मिल सकती हैं, जिन्हें आप सफलतापूर्वक निभाएंगे।',
    love: 'दाम्पत्य जीवन में सौहार्द रहेगा। जीवनसाथी के स्वास्थ्य का ध्यान रखें।',
    health: 'उदर विकार से बचें। सात्विक आहार ग्रहण करें।',
    finance: 'पैतृक संपत्ति से लाभ की संभावना। अनावश्यक खर्चों पर नियंत्रण आवश्यक है।',
    luckyNumber: 2,
    luckyColor: 'दूधिया सफेद',
    luckyColorHex: '#F8FAFC',
    luckyTime: 'प्रातः 07:30 - 09:00',
    remedy: 'शिवलिंग पर कच्चा दूध एवं जल अर्पित करें।',
    rating: { career: 4, love: 4, health: 4, finance: 4 }
  },
  {
    signIndex: 4,
    signName: 'Leo',
    hindiName: 'सिंह',
    symbol: '♌',
    dateRange: '23 जुलाई - 22 अगस्त',
    ruler: 'सूर्य',
    element: 'अग्नि',
    general: 'प्रशासनिक और नेतृत्व क्षमता में वृद्धि होगी। समाज में मान-सम्मान बढ़ेगा और प्रतिष्ठा में वृद्धि होगी।',
    career: 'अटके हुए सरकारी कार्य पूरे होंगे। पदोन्नति अथवा वेतन वृद्धि के अनुकूल योग बन रहे हैं।',
    love: 'क्रोध पर संयम रखें। संबंधों में मधुरता बनाए रखें।',
    health: 'पर्याप्त विश्राम लें और नेत्र स्वास्थ्य का ध्यान रखें।',
    finance: 'आय के नए स्रोत बनेंगे। राजकीय कार्यों से धन की प्राप्ति होगी।',
    luckyNumber: 1,
    luckyColor: 'केसरिया',
    luckyColorHex: '#F59E0B',
    luckyTime: 'प्रातः 06:30 - 08:00',
    remedy: 'प्रातःकाल सूर्य नारायण को तांबे के पात्र से जल अर्घ्य दें।',
    rating: { career: 5, love: 4, health: 4, finance: 5 }
  },
  {
    signIndex: 5,
    signName: 'Virgo',
    hindiName: 'कन्या',
    symbol: '♍',
    dateRange: '23 अगस्त - 22 सितंबर',
    ruler: 'बुध',
    element: 'पृथ्वी',
    general: 'सूक्ष्म विश्लेषण की क्षमता आज आपको आगे रखेगी। कठिन समस्याओं का सरल समाधान निकलेगा।',
    career: 'लेखा, शोध और तकनीकी कार्यों में बड़ी सफलता हाथ लगेगी।',
    love: 'जीवनसाथी के सहयोग से पारिवारिक उलझन सुलझेगी। संबंध मजबूत होंगे।',
    health: 'दिनचर्या में योग को शामिल करें।',
    finance: 'बचत में वृद्धि होगी। किसी पुरानी देनदारी से मुक्ति मिलने का समय है।',
    luckyNumber: 5,
    luckyColor: 'हल्का हरा',
    luckyColorHex: '#34D399',
    luckyTime: 'दोपहर 02:00 - 03:30',
    remedy: 'बुधवार के दिन साबुत मूंग की दाल का दान करें।',
    rating: { career: 5, love: 4, health: 4, finance: 4 }
  },
  {
    signIndex: 6,
    signName: 'Libra',
    hindiName: 'तुला',
    symbol: '♎',
    dateRange: '23 सितंबर - 22 अक्टूबर',
    ruler: 'शुक्र',
    element: 'वायु',
    general: 'संतुलन और न्यायप्रियता आपके व्यक्तित्व को प्रभावशाली बनाएगी। सामाजिक दायरा बढ़ेगा।',
    career: 'साझेदारी के व्यापार में मुनाफा हो सकता है। कानूनी मामलों में स्थिति अनुकूल होगी।',
    love: 'वैवाहिक जीवन में सुखद अनुभव। अविवाहितों के लिए शुभ विवाह प्रस्ताव आ सकते हैं।',
    health: 'कमर दर्द से बचाव के लिए सही मुद्रा में बैठें।',
    finance: 'वस्त्र अथवा आभूषण पर व्यय होगा। आर्थिक स्थिति संतुलित रहेगी।',
    luckyNumber: 6,
    luckyColor: 'गुलाबी',
    luckyColorHex: '#F472B6',
    luckyTime: 'दोपहर 12:00 - 01:30',
    remedy: 'मां दुर्गा को सुगंधित पुष्प व मिश्री अर्पित करें।',
    rating: { career: 4, love: 5, health: 4, finance: 4 }
  },
  {
    signIndex: 7,
    signName: 'Scorpio',
    hindiName: 'वृश्चिक',
    symbol: '♏',
    dateRange: '23 अक्टूबर - 21 नवंबर',
    ruler: 'मंगल',
    element: 'जल',
    general: 'दृढ़ इच्छाशक्ति और एकाग्रता से कठिन कार्य भी सिद्ध होंगे। अध्यात्म में रुचि बढ़ेगी।',
    career: 'अनुसंधान और योजनाओं में सफलता मिलेगी। कार्यक्षेत्र में प्रभाव बढ़ेगा।',
    love: 'भावनात्मक जुड़ाव मजबूत होगा। संवाद स्पष्ट रखें।',
    health: 'रक्तचाप व क्रोध पर नियंत्रण रखें।',
    finance: 'रुका हुआ धन प्राप्त हो सकता है। जोखिम भरे निवेश से बचें।',
    luckyNumber: 9,
    luckyColor: 'गहरा लाल',
    luckyColorHex: '#991B1B',
    luckyTime: 'सायं 06:00 - 07:30',
    remedy: 'हनुमान जी के मंदिर में चमेली के तेल का दीपक जलाएं।',
    rating: { career: 5, love: 4, health: 4, finance: 4 }
  },
  {
    signIndex: 8,
    signName: 'Sagittarius',
    hindiName: 'धनु',
    symbol: '♐',
    dateRange: '22 नवंबर - 21 दिसंबर',
    ruler: 'गुरु',
    element: 'अग्नि',
    general: 'ज्ञान, दर्शन और धर्म के प्रति झुकाव बढ़ेगा। गुरुजनों का सान्निध्य और मार्गदर्शन मिलेगा।',
    career: 'उच्च शिक्षा, परामर्श और अध्यापन से जुड़े लोगों को मान-सम्मान व प्रगति मिलेगी।',
    love: 'दांपत्य में मर्यादा और आदर बना रहेगा। परिवार में खुशहाली रहेगी।',
    health: 'स्वास्थ्य उत्तम रहेगा। प्रातः भ्रमण करें।',
    finance: 'धार्मिक और परोपकारी कार्यों में धन खर्च होगा, जिससे आत्मिक संतोष मिलेगा।',
    luckyNumber: 3,
    luckyColor: 'पीला',
    luckyColorHex: '#EAB308',
    luckyTime: 'प्रातः 10:00 - 11:30',
    remedy: 'माथे पर केसर अथवा हल्दी का तिलक लगाएं।',
    rating: { career: 5, love: 4, health: 5, finance: 4 }
  },
  {
    signIndex: 9,
    signName: 'Capricorn',
    hindiName: 'मकर',
    symbol: '♑',
    dateRange: '22 दिसंबर - 19 जनवरी',
    ruler: 'शनि',
    element: 'पृथ्वी',
    general: 'कठोर परिश्रम का शुभ फल मिलने का समय आ गया है। अनुशासन से हर बाधा को पार करेंगे।',
    career: 'उद्योग, निर्माण और प्रबंधन क्षेत्र में बड़ी सफलता की संभावना।',
    love: 'रिश्तों में गंभीरता और समर्पण बढ़ेगा। अपनों के साथ समय व्यतीत करें।',
    health: 'जोड़ों अथवा घुटनों का ध्यान रखें।',
    finance: 'स्थायी संपत्ति खरीदने के योग बन रहे हैं। वित्तीय स्थिति मजबूत होगी।',
    luckyNumber: 8,
    luckyColor: 'नीला',
    luckyColorHex: '#1E3A8A',
    luckyTime: 'सायं 05:00 - 06:30',
    remedy: 'शनिवार की शाम पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं।',
    rating: { career: 5, love: 4, health: 4, finance: 5 }
  },
  {
    signIndex: 10,
    signName: 'Aquarius',
    hindiName: 'कुम्भ',
    symbol: '♒',
    dateRange: '20 जनवरी - 18 फरवरी',
    ruler: 'शनि',
    element: 'वायु',
    general: 'नवीन और रचनात्मक विचार मन में आएंगे। सामाजिक कल्याण के कार्यों में सहभागिता बढ़ेगी।',
    career: 'तकनीक और नवाचार से जुड़े लोगों को विशेष लाभ होगा।',
    love: 'मित्रवत व्यवहार प्रेम को दीर्घायु बनाएगा। साथी की भावनाओं का आदर करें।',
    health: 'नियमित व्यायाम और टहलने का नियम बनाएं।',
    finance: 'आय के कई मार्ग खुलेंगे। मित्रों से सहयोग मिलेगा।',
    luckyNumber: 8,
    luckyColor: 'आसमानी',
    luckyColorHex: '#0284C7',
    luckyTime: 'दोपहर 03:00 - 04:30',
    remedy: 'निर्धनों को अन्न व काले तिल का दान करें।',
    rating: { career: 4, love: 4, health: 4, finance: 5 }
  },
  {
    signIndex: 11,
    signName: 'Pisces',
    hindiName: 'मीन',
    symbol: '♓',
    dateRange: '19 फरवरी - 20 मार्च',
    ruler: 'गुरु',
    element: 'जल',
    general: 'अध्यात्म, कल्पनाशीलता और सात्विकता में वृद्धि होगी। तीर्थ यात्रा का योग बन सकता है।',
    career: 'शिक्षा, कला, चिकित्सा और सेवा से जुड़े व्यक्तियों को ख्याति प्राप्त होगी।',
    love: 'प्रेम जीवन में मधुर वातावरण रहेगा। परस्पर विश्वास की नींव मजबूत होगी।',
    health: 'सोने से पूर्व ध्यान करें, निद्रा उत्तम रहेगी।',
    finance: 'शुभ कार्यों में व्यय होगा। दूरस्थ स्थान से धन लाभ होगा।',
    luckyNumber: 3,
    luckyColor: 'नारंगी',
    luckyColorHex: '#F97316',
    luckyTime: 'प्रातः 08:30 - 10:00',
    remedy: 'गुरुवार को चने की दाल और पीले फल का दान करें।',
    rating: { career: 4, love: 5, health: 4, finance: 4 }
  }
];

export const DAILY_HOROSCOPE = INITIAL_DAILY_HOROSCOPE;

export function getHoroscopesByPeriod(period: RashifalPeriod): HoroscopePrediction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HOROSCOPE + period);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Guarantee 100% unique signIndex [0..11] even if server or storage had duplicated keys
        const seen = new Set<number>();
        const clean: HoroscopePrediction[] = [];
        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          if (!item) continue;
          let sIdx = Number.isInteger(item.signIndex) && item.signIndex >= 0 && item.signIndex < 12
            ? item.signIndex
            : i % 12;
          if (seen.has(sIdx)) {
            // Find next available signIndex 0..11
            for (let cand = 0; cand < 12; cand++) {
              if (!seen.has(cand)) {
                sIdx = cand;
                break;
              }
            }
          }
          seen.add(sIdx);
          const fallback = INITIAL_DAILY_HOROSCOPE[sIdx] || INITIAL_DAILY_HOROSCOPE[0];
          clean.push({
            ...fallback,
            ...item,
            signIndex: sIdx,
            signName: item.signName || fallback.signName,
            hindiName: item.hindiName || fallback.hindiName,
            symbol: item.symbol || fallback.symbol
          });
        }
        if (clean.length > 0) {
          return clean.slice(0, 12);
        }
      }
    }
    if (period === 'monthly') {
      const monthlyColors = [
        'सिंदूरी लाल', 'रजत श्वेत', 'पन्ना हरा', 'मोती सफेद', 'सुनहरा पीला', 'हल्का हरा',
        'गुलाबी', 'केसरिया', 'पीतांबरी', 'नीला', 'आसमानी', 'हल्दी पीला'
      ];
      const monthly = INITIAL_DAILY_HOROSCOPE.map((item, idx) => ({
        ...item,
        signIndex: idx,
        general: `मासिक राशिफल: इस माह ${item.hindiName} राशि के जातकों के लिए ग्रहों का गोचर नई उपलब्धियां, पारिवारिक सुख और विशेष उन्नति लेकर आ रहा है। महीने के मध्य में रुके हुए कार्य पूर्ण होंगे।`,
        career: 'माह के पूर्वार्ध में कार्यक्षेत्र में विस्तार होगा तथा उत्तरार्ध में पदोन्नति, नई जिम्मेदारी और मान-सम्मान के प्रबल योग हैं।',
        love: 'इस पूरे माह पारिवारिक जीवन में आपसी सामंजस्य और स्नेह बना रहेगा। घर में शुभ अथवा मांगलिक कार्य की योजना सफल होगी।',
        health: 'माह भर स्वास्थ्य उत्तम रहेगा। नियमित योग, प्राणायाम और सात्विक आहार से मानसिक प्रसन्नता बढ़ेगी।',
        finance: 'मासिक बजट संतुलित रहेगा। भूमि, भवन अथवा दीर्घकालिक निवेश से स्थायी आर्थिक लाभ प्राप्त होगा।',
        luckyNumber: ((item.luckyNumber + 2) % 9) + 1,
        luckyColor: monthlyColors[idx % monthlyColors.length],
        luckyTime: 'प्रातः 10:15 - दोपहर 12:30',
        remedy: `प्रत्येक मंगलवार एवं शनिवार को ${item.ruler} ग्रह के वैदिक मंत्र का जप करें तथा मंदिर में दीपदान करें।`
      }));
      localStorage.setItem(STORAGE_KEY_HOROSCOPE + period, JSON.stringify(monthly));
      return monthly;
    }
    if (period === 'yearly') {
      const yearlyColors = [
        'अरुण लाल', 'चमकीला सफेद', 'तोतिया हरा', 'दूधिया सफेद', 'स्वर्ण केसरिया', 'धानी हरा',
        'क्रीम श्वेत', 'गहरा लाल', 'केसरिया पीला', 'गहरा नीला', 'मयूर नीला', 'स्वर्ण पीला'
      ];
      const yearly = INITIAL_DAILY_HOROSCOPE.map((item, idx) => ({
        ...item,
        signIndex: idx,
        general: `वार्षिक राशिफल: यह संपूर्ण वर्ष ${item.hindiName} राशि के जातकों के लिए स्वास्थ्य, करियर, धन-धान्य और पारिवारिक समृद्धि की दृष्टि से अत्यंत महत्वपूर्ण एवं भाग्योदयकारी रहेगा।`,
        career: 'वर्ष के मध्य में देवगुरु बृहस्पति और शनि के शुभ प्रभाव से व्यापार, नौकरी व आजीविका में ऐतिहासिक प्रगति और प्रतिष्ठा प्राप्त होगी।',
        love: 'संपूर्ण वर्ष दांपत्य एवं पारिवारिक संबंधों में प्रगाढ़ता रहेगी। अविवाहित जातकों के लिए विवाह के शुभ संयोग बनेंगे।',
        health: 'वार्षिक स्वास्थ्य चक्र अनुकूल रहेगा। ऋतु परिवर्तन के समय संयमित दिनचर्या रखने से पूरे वर्ष उत्तम ऊर्जा बनी रहेगी।',
        finance: 'वार्षिक आय में निरंतर वृद्धि होगी। पैतृक संपत्ति, स्वर्ण और नवीन निवेशों से दीर्घकालिक आर्थिक सुदृढ़ता मिलेगी।',
        luckyNumber: ((item.luckyNumber + 5) % 9) + 1,
        luckyColor: yearlyColors[idx % yearlyColors.length],
        luckyTime: 'अभिजीत मुहूर्त (दोपहर 11:45 - 12:35)',
        remedy: `वर्ष भर ${item.ruler} की शांति एवं शुभत्व हेतु नित्य इष्टदेव की आराधना करें और पूर्णिमा को अन्न दान करें।`
      }));
      localStorage.setItem(STORAGE_KEY_HOROSCOPE + period, JSON.stringify(yearly));
      return yearly;
    }
    localStorage.setItem(STORAGE_KEY_HOROSCOPE + period, JSON.stringify(INITIAL_DAILY_HOROSCOPE));
    return INITIAL_DAILY_HOROSCOPE;
  } catch {
    return INITIAL_DAILY_HOROSCOPE;
  }
}

export function saveHoroscopeForPeriod(
  period: RashifalPeriod,
  updatedPrediction: HoroscopePrediction
) {
  const list = getHoroscopesByPeriod(period);
  const idx = list.findIndex((item) => item.signIndex === updatedPrediction.signIndex);
  if (idx >= 0) {
    list[idx] = updatedPrediction;
  } else {
    list.push(updatedPrediction);
  }
  localStorage.setItem(STORAGE_KEY_HOROSCOPE + period, JSON.stringify(list));
}

export const CURRENT_TRANSITS: TransitInfo[] = [
  {
    planet: 'सूर्य',
    hindiName: 'सूर्य नारायण (रवि)',
    currentSign: 'तुला',
    nextSign: 'वृश्चिक',
    transitDate: '16 नवंबर 2026',
    transitChangeDate: 'प्रत्येक माह की 14-17 तारीख (संक्रांति)',
    retrograde: false,
    swarashi: 'सिंह',
    uchhaRashi: 'मेष (10°)',
    neechRashi: 'तुला (10°)',
    impactSummary: 'संक्रांति के पश्चात मान-सम्मान, पद-प्रतिष्ठा और आत्मबल में अत्यधिक वृद्धि होगी।',
    auspiciousRashis: ['सिंह', 'धनु', 'मेष']
  },
  {
    planet: 'चंद्र',
    hindiName: 'चंद्रमा (सोम)',
    currentSign: 'कन्या',
    nextSign: 'तुला',
    transitDate: 'सवा दो दिन (2.25 दिन)',
    transitChangeDate: 'प्रत्येक 54 घंटे में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'कर्क',
    uchhaRashi: 'वृषभ (03°)',
    neechRashi: 'वृश्चिक (03°)',
    impactSummary: 'मानसिक प्रसन्नता, कल्पनाशीलता, माता का सहयोग और त्वरित निर्णय लेने में सफलता।',
    auspiciousRashis: ['कर्क', 'वृषभ', 'मीन']
  },
  {
    planet: 'मंगल',
    hindiName: 'भौम मंगल देव',
    currentSign: 'कर्क',
    nextSign: 'सिंह',
    transitDate: 'जनवरी 2027',
    transitChangeDate: 'लगभग 45 दिनों में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'मेष, वृश्चिक',
    uchhaRashi: 'मकर (28°)',
    neechRashi: 'कर्क (28°)',
    impactSummary: 'साहस, पराक्रम और तकनीकी कौशल में वृद्धि। संयमित वाणी व क्रोध पर नियंत्रण रखें।',
    auspiciousRashis: ['मेष', 'वृश्चिक', 'धनु']
  },
  {
    planet: 'बुध',
    hindiName: 'बुध देव (सौम्य)',
    currentSign: 'वृश्चिक',
    nextSign: 'धनु',
    transitDate: '27 नवंबर 2026',
    transitChangeDate: 'लगभग 21-30 दिनों में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'मिथुन, कन्या',
    uchhaRashi: 'कन्या (15°)',
    neechRashi: 'मीन (15°)',
    impactSummary: 'बुद्धि, वाणिज्य, संचार कौशल, लेखन और व्यापारिक अनुबंधों में लाभप्रद योग।',
    auspiciousRashis: ['मिथुन', 'कन्या', 'कुम्भ']
  },
  {
    planet: 'बृहस्पति',
    hindiName: 'देवगुरु बृहस्पति',
    currentSign: 'वृषभ',
    nextSign: 'मिथुन',
    transitDate: 'मई 2026',
    transitChangeDate: 'लगभग 12-13 माह में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'धनु, मीन',
    uchhaRashi: 'कर्क (05°)',
    neechRashi: 'मकर (05°)',
    impactSummary: 'आर्थिक स्थिरता, उच्च शिक्षा, संतान सुख, धर्म-कर्म व ज्ञान में अभूतपूर्व विस्तार।',
    auspiciousRashis: ['कर्क', 'कन्या', 'वृश्चिक', 'मकर']
  },
  {
    planet: 'शुक्र',
    hindiName: 'दैत्यगुरु शुक्र देव',
    currentSign: 'वृश्चिक',
    nextSign: 'धनु',
    transitDate: '11 दिसंबर 2026',
    transitChangeDate: 'लगभग 25-30 दिनों में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'वृषभ, तुला',
    uchhaRashi: 'मीन (27°)',
    neechRashi: 'कन्या (27°)',
    impactSummary: 'कला, प्रेम, सौंदर्य, वाहन-भूमि सुख, आकर्षण और भौतिक ऐश्वर्य में वृद्धि।',
    auspiciousRashis: ['वृषभ', 'तुला', 'मीन']
  },
  {
    planet: 'शनि',
    hindiName: 'कर्मफलदाता शनि देव',
    currentSign: 'कुम्भ',
    nextSign: 'मीन',
    transitDate: '29 मार्च 2026',
    transitChangeDate: 'लगभग 2.5 वर्ष (ढाई साल) में राशि परिवर्तन',
    retrograde: false,
    swarashi: 'मकर, कुम्भ',
    uchhaRashi: 'तुला (20°)',
    neechRashi: 'मेष (20°)',
    impactSummary: 'न्यायप्रिय शनि का प्रभाव कर्मठता, अनुशासन, धैर्य व दीर्घकालिक स्थायी सफलता देगा।',
    auspiciousRashis: ['मेष', 'मिथुन', 'तुला', 'धनु']
  },
  {
    planet: 'राहु',
    hindiName: 'छाया ग्रह राहु',
    currentSign: 'मीन',
    nextSign: 'कुम्भ',
    transitDate: '18 मई 2026',
    transitChangeDate: 'लगभग 18 माह में वक्र गति से राशि परिवर्तन',
    retrograde: true,
    swarashi: 'कुम्भ (सह-आधिपत्य)',
    uchhaRashi: 'वृषभ / मिथुन',
    neechRashi: 'वृश्चिक / धनु',
    impactSummary: 'गूढ़ अनुसंधान, विदेश यात्रा, आधुनिक तकनीकी कार्य व अप्रत्याशित लाभ के योग।',
    auspiciousRashis: ['वृषभ', 'सिंह', 'मकर']
  },
  {
    planet: 'केतु',
    hindiName: 'मोक्षकारक केतु देव',
    currentSign: 'कन्या',
    nextSign: 'सिंह',
    transitDate: '18 मई 2026',
    transitChangeDate: 'लगभग 18 माह में वक्र गति से राशि परिवर्तन',
    retrograde: true,
    swarashi: 'वृश्चिक (सह-आधिपत्य)',
    uchhaRashi: 'वृश्चिक / धनु',
    neechRashi: 'वृषभ / मिथुन',
    impactSummary: 'आध्यात्मिक अंतर्दृष्टि, वैराग्य, आत्म-अन्वेषण और अंतःकरण की शुद्धि का मार्ग।',
    auspiciousRashis: ['मेष', 'धनु', 'मीन']
  }
];
