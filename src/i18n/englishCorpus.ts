/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Comprehensive Hindi -> Natural English translation corpus for JyotishWala.
 * Covers all Daily/Monthly/Yearly Horoscopes, Planetary Transits, Home Slides,
 * Sankalp/About/Privacy Content, User Reviews & Replies, Photo Gallery,
 * Pandit Profiles, Dharma Mantras/Gita/Puja Steps, Calculators (Ratna/Numerology/Vastu/Sade Sati),
 * Articles, Annual Tyohar Festivals, Kundli/Milan Analysis, and UI labels.
 */

import { GENERATED_HI_TO_EN_DICT } from './generatedEnglishDict';

export const EXACT_HI_TO_EN_MAP: Record<string, string> = {
  ...GENERATED_HI_TO_EN_DICT,
  // ============================================================================
  // 1. DAILY HOROSCOPE (horoscopeService.ts) - ALL 12 ZODIAC SIGNS
  // ============================================================================
  // Aries (मेष)
  '21 मार्च - 19 अप्रैल': '21 March - 19 April',
  'आज आपका आत्मविश्वास प्रबल रहेगा। रुके हुए कार्य गति पकड़ेंगे और कार्यक्षेत्र में आपकी प्रशंसा होगी।':
    'Your self-confidence will be strong today. Stalled tasks will pick up speed, and you will be praised in your workplace.',
  'वरिष्ठ अधिकारियों का सहयोग मिलेगा। नई परियोजना की जिम्मेदारी मिल सकती है।':
    'You will receive support from senior officials. You may be entrusted with the responsibility of a new project.',
  'जीवनसाथी के साथ मधुर संवाद होगा। पारिवारिक वातावरण सुखद रहेगा।':
    'There will be sweet communication with your spouse. The family atmosphere will remain pleasant.',
  'ऊर्जा का स्तर उत्तम रहेगा, परंतु सिरदर्द या आंखों में थकान से बचें।':
    'Your energy levels will remain excellent, but avoid headaches or eye strain.',
  'आकस्मिक धन लाभ के योग हैं। निवेश के लिए दोपहर बाद का समय शुभ है।':
    'There are strong indications of sudden financial gains. The afternoon is auspicious for investments.',
  'सिंदूरी लाल': 'Vermilion Red',
  'प्रातः 10:30 से 12:00 बजे': '10:30 AM to 12:00 PM',
  'हनुमान जी को सिंदूर और चमेली का तेल अर्पित करें तथा गुड़ का दान करें।':
    'Offer vermilion and jasmine oil to Lord Hanuman and donate jaggery.',

  // Taurus (वृषभ)
  '20 अप्रैल - 20 मई': '20 April - 20 May',
  'आज धैर्य और संयम से काम लेने का दिन है। आर्थिक मामलों में स्थिरता आएगी और मन प्रसन्न रहेगा।':
    'Today is a day to act with patience and restraint. Stability will come in financial matters and your mind will remain cheerful.',
  'व्यापार में साझेदारी से लाभ होगा। नौकरीपेशा जातकों को पदोन्नति के संकेत मिलेंगे।':
    'Partnerships in business will bring profit. Salaried individuals will see indications of promotion.',
  'प्रेम संबंधों में प्रगाढ़ता आएगी। अविवाहितों के लिए विवाह प्रस्ताव आ सकते हैं।':
    'Love relationships will deepen. Marriage proposals may come for unmarried individuals.',
  'गले या कफ से संबंधित हल्की परेशानी हो सकती है, ठंडी चीजों से परहेज करें।':
    'Mild throat or phlegm-related discomfort may occur; avoid cold food and drinks.',
  'भौतिक सुख-सुविधाओं पर खर्च बढ़ेगा, किंतु आय के नए स्रोत भी बनेंगे।':
    'Expenditure on material comforts will increase, but new sources of income will also open up.',
  'दूधिया सफेद': 'Milky White',
  'दोपहर 01:15 से 02:45 बजे': '01:15 PM to 02:45 PM',
  'मां लक्ष्मी को खीर का भोग लगाएं और सफेद वस्त्र धारण करें।':
    'Offer Kheer to Goddess Lakshmi and wear white attire.',

  // Gemini (मिथुन)
  '21 मई - 20 जून': '21 May - 20 June',
  'आपकी वाणी और बौद्धिक कौशल आज आपको विशेष सफलता दिलाएंगे। सामाजिक प्रतिष्ठा में वृद्धि होगी।':
    'Your speech and intellectual skills will bring you special success today. Social prestige will increase.',
  'लेखन, मीडिया, आईटी और शिक्षा से जुड़े लोगों के लिए आज का दिन अत्यंत फलदायी है।':
    'Today is highly fruitful for people associated with writing, media, IT, and education.',
  'मित्रों और जीवनसाथी के साथ भ्रमण की योजना बनेगी। आपसी गलतफहमियां दूर होंगी।':
    'Plans for an outing with friends and spouse will be made. Mutual misunderstandings will be resolved.',
  'कंधों और नसों में हल्का खिंचाव रह सकता है, प्राणायाम अवश्य करें।':
    'Mild strain in the shoulders and nerves may persist; make sure to practice Pranayama.',
  'व्यापारिक सौदों में लाभ होगा। उधार दिया हुआ धन वापस मिलने की संभावना है।':
    'Business deals will be profitable. Money lent earlier is likely to be recovered.',
  'पन्ना हरा': 'Emerald Green',
  'प्रातः 09:00 से 10:30 बजे': '09:00 AM to 10:30 AM',
  'भगवान गणेश को दूर्वा अर्पित करें और गौ माता को हरा चारा खिलाएं।':
    'Offer Durva grass to Lord Ganesha and feed green fodder to a cow.',

  // Cancer (कर्क)
  '21 जून - 22 जुलाई': '21 June - 22 July',
  'आज पारिवारिक सुख और मानसिक शांति का अनुभव करेंगे। माता जी का आशीर्वाद आपके कार्यों को सिद्ध करेगा।':
    'Today you will experience family happiness and mental peace. Your mother’s blessings will bring success to your endeavors.',
  'कार्यस्थल पर सहकर्मियों का पूर्ण सहयोग प्राप्त होगा। स्थान परिवर्तन के योग बन रहे हैं।':
    'You will receive full cooperation from colleagues at the workplace. Chances of relocation or transfer are forming.',
  'संबंधों में भावनात्मक जुड़ाव गहरा होगा। संतान पक्ष से शुभ समाचार मिलेगा।':
    'Emotional bonding in relationships will deepen. Good news will arrive from your children.',
  'पाचन तंत्र का ध्यान रखें और पर्याप्त जल ग्रहण करें।':
    'Take care of your digestive system and drink plenty of water.',
  'अचल संपत्ति या वाहन खरीदने के लिए विचार-विमर्श सार्थक रहेगा।':
    'Discussions regarding purchasing real estate or a vehicle will prove fruitful.',
  'चांदी जैसा सफेद': 'Silvery White',
  'सायं 04:00 से 05:30 बजे': '04:00 PM to 05:30 PM',
  'शिवलिंग पर कच्चा दूध और जल अर्पित करें तथा "ॐ नमः शिवाय" का जप करें।':
    'Offer raw milk and water on the Shiva Linga and chant "Om Namah Shivaya".',

  // Leo (सिंह)
  '23 जुलाई - 22 अगस्त': '23 July - 22 August',
  'आपकी नेतृत्व क्षमता और पराक्रम में वृद्धि होगी। राजकीय एवं प्रशासनिक कार्यों में सफलता मिलेगी।':
    'Your leadership ability and valor will increase. You will achieve success in government and administrative works.',
  'उच्च पद की प्राप्ति या महत्वपूर्ण निर्णय लेने का अवसर मिलेगा। प्रतिद्वंद्वी परास्त होंगे।':
    'You will get an opportunity to attain a high position or make key decisions. Competitors will be defeated.',
  'वैवाहिक जीवन में थोड़ा अहंकार त्यागने से मधुरता बनी रहेगी।':
    'Letting go of ego slightly in married life will maintain sweetness and harmony.',
  'हृदय और रक्तचाप के रोगी नियमित दिनचर्या का पालन करें।':
    'Heart and blood pressure patients should follow a regular daily routine.',
  'पैतृक संपत्ति से लाभ मिलने के प्रबल योग हैं। सरकारी क्षेत्र से धन लाभ होगा।':
    'Strong indications of gain from ancestral property. Financial gains will come from the government sector.',
  'सुनहरा नारंगी': 'Golden Orange',
  'प्रातः 08:00 से 09:30 बजे': '08:00 AM to 09:30 AM',
  'तांबे के लोटे से सूर्य देव को अर्घ्य दें और आदित्य हृदय स्तोत्र का पाठ करें।':
    'Offer water (Arghya) to Lord Surya from a copper vessel and recite the Aditya Hridaya Stotra.',

  // Virgo (कन्या)
  '23 अगस्त - 22 सितंबर': '23 August - 22 September',
  'आज आपकी विश्लेषणात्मक क्षमता से जटिल समस्याओं का समाधान निकलेगा। अनुशासन से कार्य पूर्ण होंगे।':
    'Your analytical ability will solve complex problems today. Tasks will be completed through discipline.',
  'लेखा-जोखा, बैंकिंग, वकालत और प्रबंधन से जुड़े जातकों को विशेष उपलब्धि मिलेगी।':
    'Individuals associated with accounting, banking, law, and management will achieve special success.',
  'जीवनसाथी आपकी भावनाओं का सम्मान करेगा। घर में मांगलिक कार्य की रूपरेखा बनेगी।':
    'Your spouse will respect your feelings. Plans for an auspicious ceremony at home will take shape.',
  'पेट व त्वचा संबंधी एलर्जी से सावधान रहें, सात्विक भोजन ग्रहण करें।':
    'Be cautious of stomach and skin allergies; consume pure vegetarian (Sattvic) food.',
  'बचत योजनाओं में निवेश लाभकारी रहेगा। अनावश्यक खर्चों पर नियंत्रण रहेगा।':
    'Investing in savings schemes will be beneficial. Unnecessary expenses will remain under control.',
  'हल्का हरा': 'Light Green',
  'दोपहर 12:00 से 01:30 बजे': '12:00 PM to 01:30 PM',
  'भगवान विष्णु की आराधना करें और तुलसी के पौधे में घी का दीपक जलाएं।':
    'Worship Lord Vishnu and light a ghee lamp near the Tulsi plant.',

  // Libra (तुला)
  '23 सितंबर - 22 अक्टूबर': '23 September - 22 October',
  'आज संतुलन और सामंजस्य का दिन है। कला, सौंदर्य और सृजनात्मक क्षेत्रों में आपकी ख्याति बढ़ेगी।':
    'Today is a day of balance and harmony. Your reputation will grow in art, beauty, and creative fields.',
  'व्यापारिक विस्तार के लिए नई योजनाएं सफल होंगी। विदेश से जुड़े कार्यों में प्रगति होगी।':
    'New plans for business expansion will succeed. Works connected with foreign lands will progress.',
  'प्रेम जीवन में रोमांस और विश्वास बढ़ेगा। जीवनसाथी से कोई सुंदर उपहार मिल सकता है।':
    'Romance and trust will grow in your love life. You may receive a lovely gift from your partner.',
  'कमर दर्द या किडनी से जुड़ी समस्या से बचने के लिए तरल पदार्थों का सेवन बढ़ाएं।':
    'Increase intake of fluids to avoid back pain or kidney-related issues.',
  'आर्थिक स्थिति सुदृढ़ होगी। आभूषण या वस्त्रों की खरीदारी के योग हैं।':
    'Financial position will strengthen. There are prospects of buying jewelry or clothes.',
  'गुलाबी व क्रीम': 'Pink & Cream',
  'दोपहर 02:30 से 04:00 बजे': '02:30 PM to 04:00 PM',
  'छोटी कन्याओं को मिश्री या सफेद मिठाई भेंट करें और माता लक्ष्मी का ध्यान करें।':
    'Offer rock sugar (Mishri) or white sweets to young girls and meditate on Goddess Lakshmi.',

  // Scorpio (वृश्चिक)
  '23 अक्टूबर - 21 नवंबर': '23 October - 21 November',
  'आज साहस और दृढ़ संकल्प से आप कठिन कार्यों को भी सरल बना लेंगे। गूढ़ विद्याओं में रुचि बढ़ेगी।':
    'With courage and determination today, you will make even difficult tasks easy. Interest in esoteric sciences will grow.',
  'शोध, चिकित्सा, सेना और तकनीकी क्षेत्र के जातकों को बड़ी सफलता मिलेगी।':
    'Individuals in research, medicine, defense, and technical fields will achieve major success.',
  'संबंधों में स्पष्टवादिता रखें, संदेह से बचें। सायंकाल परिवार के साथ बिताएं।':
    'Maintain transparency in relationships and avoid suspicion. Spend the evening with your family.',
  'रक्त विकार या चोट लगने से सावधान रहें। वाहन सावधानीपूर्वक चलाएं।':
    'Be careful of blood disorders or minor injuries. Drive vehicles carefully.',
  'गुप्त स्रोतों या बीमा/पीएफ से धन प्राप्ति के योग बन रहे हैं।':
    'Prospects of receiving money from unexpected sources or insurance/PF are forming.',
  'गहरा मैरून': 'Deep Maroon',
  'प्रातः 11:00 से 12:30 बजे': '11:00 AM to 12:30 PM',
  'हनुमान चालीसा का 7 बार पाठ करें और लाल मसूर की दाल दान करें।':
    'Recite the Hanuman Chalisa 7 times and donate red lentils (Masoor Dal).',

  // Sagittarius (धनु)
  '22 नवंबर - 21 दिसंबर': '22 November - 21 December',
  'भाग्य का पूरा साथ मिलेगा। धर्म, अध्यात्म और उच्च शिक्षा के क्षेत्र में उन्नति के द्वार खुलेंगे।':
    'Luck will fully support you. Doors of advancement will open in religion, spirituality, and higher education.',
  'गुरुजनों और वरिष्ठों के मार्गदर्शन से करियर में नई दिशा मिलेगी। लंबी यात्रा सुखद रहेगी।':
    'Guidance from mentors and seniors will give a new direction to your career. Long journeys will be pleasant.',
  'परिवार में उत्सव जैसा माहौल रहेगा। जीवनसाथी के साथ धार्मिक स्थल की यात्रा संभव है।':
    'A festive atmosphere will prevail at home. Visiting a religious place with your spouse is likely.',
  'स्वास्थ्य उत्तम रहेगा, केवल जांघों या लिवर से संबंधित खान-पान का ध्यान रखें।':
    'Health will remain good; just be mindful of diet related to liver and thigh stiffness.',
  'धन संचय में सफलता मिलेगी। धार्मिक कार्यों में सात्विक व्यय होगा।':
    'You will succeed in accumulating wealth. Virtuous expenditure will be made on religious activities.',
  'हल्दी पीला': 'Turmeric Yellow',
  'प्रातः 09:30 से 11:00 बजे': '09:30 AM to 11:00 AM',
  'माथे पर केसर या हल्दी का तिलक लगाएं और केले के वृक्ष की पूजा करें।':
    'Apply a saffron or turmeric Tilak on your forehead and worship the banana tree.',

  // Capricorn (मकर)
  '22 दिसंबर - 19 जनवरी': '22 December - 19 January',
  'कर्मप्रधान दिन रहेगा। आपकी मेहनत और निष्ठा का ठोस परिणाम आज देखने को मिलेगा।':
    'Today will be an action-oriented day. Concrete results of your hard work and dedication will be seen today.',
  'निर्माण, लोहा, मशीनरी और प्रशासन से जुड़े कार्यों में विशेष प्रगति होगी।':
    'Special progress will be achieved in works related to construction, iron, machinery, and administration.',
  'व्यस्तता के बावजूद परिवार के लिए समय निकालें, जीवनसाथी का सहयोग संबल देगा।':
    'Despite a busy schedule, make time for your family; your spouse’s support will give you strength.',
  'घुटनों और जोड़ों के दर्द में राहत के लिए हल्का व्यायाम और तेल मालिश करें।':
    'Do light exercise and oil massage for relief from knee and joint pain.',
  'दीर्घकालिक निवेश (भूमि, भवन, शेयर) के लिए आज का दिन अत्यंत अनुकूल है।':
    'Today is highly favorable for long-term investments (land, property, or shares).',
  'नीला व स्लेटी': 'Blue & Slate Grey',
  'सायं 05:00 से 06:30 बजे': '05:00 PM to 06:30 PM',
  'पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और शनि मंत्र का जप करें।':
    'Light a mustard oil lamp under a Peepal tree and chant the Shani Mantra.',

  // Aquarius (कुंभ)
  '20 जनवरी - 18 फरवरी': '20 January - 18 February',
  'नवीन विचारों और नवाचार से आज आप सबको प्रभावित करेंगे। सामाजिक कार्यों में मान-सम्मान मिलेगा।':
    'You will impress everyone today with fresh ideas and innovation. You will gain honor in social activities.',
  'स्टार्टअप, विज्ञान और जनसंपर्क के कार्यों में बड़ी उपलब्धि हासिल होगी।':
    'Major achievements will be gained in startups, science, and public relations.',
  'मित्रों के साथ संबंध मजबूत होंगे। वैवाहिक जीवन में आपसी समझ और विश्वास बढ़ेगा।':
    'Bonds with friends will grow stronger. Mutual understanding and trust will increase in married life.',
  'अनिद्रा या मानसिक तनाव से बचने के लिए रात्रि में ध्यान (मेडिटेशन) करें।':
    'Practice meditation at night to avoid insomnia or mental stress.',
  'आय के एकाधिक स्रोतों से धन आगमन होगा। आर्थिक योजनाएं सफल रहेंगी।':
    'Income will flow from multiple sources. Financial plans will prove successful.',
  'आसमानी नीला': 'Sky Blue',
  'दोपहर 03:00 से 04:30 बजे': '03:00 PM to 04:30 PM',
  'पक्षियों को सात प्रकार का अनाज (सप्तधान्य) डालें और जरूरतमंदों की सहायता करें।':
    'Feed seven types of grains (Saptadhanya) to birds and help those in need.',

  // Pisces (मीन)
  '19 फरवरी - 20 मार्च': '19 February - 20 March',
  'आध्यात्मिक झुकाव और अंतर्ज्ञान आज आपको सही निर्णय लेने में मदद करेगा। मन शांत और आनंदित रहेगा।':
    'Spiritual inclination and intuition will help you make the right decisions today. Your mind will remain calm and joyful.',
  'शिक्षा, परामर्श, चिकित्सा और कला के क्षेत्र में कार्यरत जातकों को सम्मान मिलेगा।':
    'Individuals working in education, consulting, medicine, and arts will receive recognition.',
  'प्रेम और दांपत्य जीवन में अत्यंत मधुरता रहेगी। परिवार में सुख-शांति का वास होगा।':
    'There will be deep sweetness in love and married life. Peace and happiness will prevail in the family.',
  'पैरों में थकान या जलन हो सकती है, रात्रि में गुनगुने पानी से पैर धोएं।':
    'Fatigue or burning sensation in the feet may occur; wash your feet with lukewarm water at night.',
  'रुका हुआ धन प्राप्त होगा और शुभ कार्यों में धन का सदुपयोग होगा।':
    'Stuck money will be recovered and wealth will be utilized well in auspicious works.',
  'केसरिया पीला': 'Saffron Yellow',
  'प्रातः 10:00 से 11:30 बजे': '10:00 AM to 11:30 AM',
  'भगवान विष्णु को पीले पुष्प और चने की दाल व गुड़ अर्पित करें।':
    'Offer yellow flowers, split Bengal gram (Chana Dal), and jaggery to Lord Vishnu.',

  // ============================================================================
  // 2. PLANETARY TRANSITS (CURRENT_TRANSITS in horoscopeService.ts)
  // ============================================================================
  'मीन राशि (उत्तराभाद्रपद नक्षत्र)': 'Pisces (Uttara Bhadrapada Nakshatra)',
  '29 मार्च 2025 – 03 जून 2027': '29 March 2025 – 03 June 2027',
  'शनि का मीन राशि में गोचर अध्यात्म, न्याय, अनुशासन और कर्मफल की प्रधानता ला रहा है। वृषभ, मिथुन, तुला और मकर राशि के लिए विशेष लाभकारी।':
    'Saturn’s transit in Pisces brings prominence to spirituality, justice, discipline, and karmic rewards. Especially beneficial for Taurus, Gemini, Libra, and Capricorn.',
  'मिथुन राशि (पुनर्वसु नक्षत्र)': 'Gemini (Punarvasu Nakshatra)',
  '14 मई 2025 – 18 अक्टूबर 2025': '14 May 2025 – 18 October 2025',
  'देवगुरु बृहस्पति का मिथुन में गोचर बौद्धिक विकास, शिक्षा, व्यापार विस्तार और संवाद कौशल में वृद्धि कर रहा है। मेष, सिंह, तुला और कुंभ को विशेष लाभ।':
    'Jupiter’s transit in Gemini enhances intellectual growth, education, business expansion, and communication skills. Special benefits for Aries, Leo, Libra, and Aquarius.',
  'कुंभ राशि (शतभिषा नक्षत्र)': 'Aquarius (Shatabhisha Nakshatra)',
  '18 मई 2025 – 05 दिसंबर 2026': '18 May 2025 – 05 December 2026',
  'राहु का स्वराशि कुंभ में गोचर तकनीकी नवाचार, विज्ञान, कृत्रिम बुद्धिमत्ता और आकस्मिक धन लाभ के नए अवसर खोल रहा है।':
    'Rahu’s transit in its own sign Aquarius opens new opportunities in technological innovation, science, artificial intelligence, and sudden financial gains.',
  'सिंह राशि (मघा नक्षत्र)': 'Leo (Magha Nakshatra)',
  'केतु का सिंह राशि में गोचर आत्मचिंतन, वैराग्य, गूढ़ ज्ञान और आध्यात्मिक उन्नति को बल प्रदान कर रहा है।':
    'Ketu’s transit in Leo strengthens introspection, detachment, esoteric knowledge, and spiritual progress.',
  'मेष राशि (उच्च राशि - अश्विनी नक्षत्र)': 'Aries (Exalted - Ashwini Nakshatra)',
  '14 अप्रैल – 14 मई (मासिक संक्रांति)': '14 April – 14 May (Monthly Sankranti)',
  'सूर्य देव अपनी उच्च राशि मेष में विराजमान होकर आत्मबल, राज्यकृपा, प्रशासनिक सफलता और आरोग्य प्रदान कर रहे हैं।':
    'Situated in its exalted sign Aries, Lord Surya bestows self-confidence, state favor, administrative success, and good health.',
  'कर्क राशि (पुष्य नक्षत्र)': 'Cancer (Pushya Nakshatra)',
  '20 अप्रैल – 06 जून': '20 April – 06 June',
  'मंगल के गोचर से भूमि-भवन के कार्यों में गति आएगी, किंतु क्रोध और जल्दबाजी पर नियंत्रण रखना आवश्यक होगा।':
    'Mars’s transit will accelerate land and property matters, though keeping anger and haste under control will be essential.',
  'मीन राशि (उच्च राशि - रेवती नक्षत्र)': 'Pisces (Exalted - Revati Nakshatra)',
  '31 मार्च – 26 अप्रैल': '31 March – 26 April',
  'शुक्र का अपनी उच्च राशि मीन में गोचर कला, प्रेम, दांपत्य सुख, ऐश्वर्य और भौतिक समृद्धि में अपार वृद्धि कर रहा है।':
    'Venus transiting its exalted sign Pisces brings immense growth in art, love, marital bliss, luxury, and material prosperity.',
  'मेष राशि (भरणी नक्षत्र)': 'Aries (Bharani Nakshatra)',
  '07 अप्रैल – 25 अप्रैल': '07 April – 25 April',
  'बुध का गोचर व्यापारिक निर्णय, बैंकिंग, शेयर बाजार और तार्किक क्षमता को तीव्र बना रहा है।':
    'Mercury’s transit sharpens business decisions, banking, stock market acumen, and logical reasoning.',
  'सवा दो दिन (निरंतर गतिमान)': '2.25 Days (Continuously Moving)',
  'चंद्रमा अपनी स्वराशि कर्क में गोचर करते हुए मानसिक शांति, करुणा और पारिवारिक सौहार्द प्रदान कर रहे हैं।':
    'Transiting its own sign Cancer, the Moon bestows mental peace, compassion, and family harmony.',

  // ============================================================================
  // 3. SITE CONTENT (siteContentService.ts) - SLIDES, SANKALP, ABOUT, PRIVACY
  // ============================================================================
  'दैनिक वैदिक पंचांग एवं शुभ मुहूर्त': 'Daily Vedic Panchang & Auspicious Muhurat',
  'तिथि, नक्षत्र, योग, करण, चौघड़िया और राहुकाल की सटीक गणना अपने शहर के अनुसार जानें।':
    'Get accurate calculations of Tithi, Nakshatra, Yoga, Karana, Chaughadiya, and Rahu Kaal according to your city.',
  'निःशुल्क लग्न कुंडली एवं दोष विश्लेषण': 'Free Lagna Kundli & Dosha Analysis',
  'जन्म तिथि, समय और स्थान से अपनी संपूर्ण वैदिक कुंडली, ग्रह स्थिति और विंशोत्तरी दशा तुरंत प्राप्त करें।':
    'Instantly generate your complete Vedic Kundli, planetary positions, and Vimshottari Dasha from your birth date, time, and place.',
  'अष्टकूट ३६ गुण एवं मांगलिक मिलान': 'Ashtakoot 36 Guna & Manglik Matching',
  'विवाह के लिए वर-वधू की कुंडलियों का शास्त्रीय अष्टकूट मिलान, नाड़ी दोष और मंगल दोष परिहार जानें।':
    'Check classical Ashtakoot matching, Nadi Dosha, and Mangal Dosha remedies for the bride and groom’s horoscopes.',
  'अनुभवी वैदिक आचार्यों से सीधा संवाद': 'Direct Consultation with Experienced Vedic Acharyas',
  'करियर, विवाह, व्यापार और ग्रह शांति के लिए काशी एवं ऋषिकेश के विद्वान पंडितों से परामर्श लें।':
    'Consult learned Pandits from Kashi and Rishikesh for career, marriage, business, and planetary peace remedies.',
  'पूजा-पाठ, अनुष्ठान एवं ज्योतिष फोटो गैलरी': 'Puja, Anushthan & Astrology Photo Gallery',
  'हमारे संस्थान द्वारा संपन्न वैदिक अनुष्ठान, रुद्राभिषेक, महायज्ञ और ज्योतिष सम्मेलनों की झलकियां देखें।':
    'View glimpses of Vedic rituals, Rudrabhishek, Mahayagya, and astrology conferences conducted by our institution.',
  'अद्य सनातन धर्मस्य प्रचार-प्रसारार्थं तथा च आत्म-कल्याणार्थं श्री भगवतः प्रीत्यर्थं अहं पूजनं/जपं करिष्यामि।':
    'Today, for the propagation of Sanatana Dharma, for spiritual welfare, and to please the Supreme Lord, I resolve to perform this worship/chanting.',
  'ज्योतिषीय परामर्श एवं अनुष्ठान': 'Astrological Consultation & Vedic Rituals',
  'JyotishWala सनातन वैदिक परंपरा, विशुद्ध दृक्-गणित पंचांग और प्रामाणिक ज्योतिषीय मार्गदर्शन को समर्पित एक विश्वसनीय डिजिटल मंच है। हमारा उद्देश्य प्राचीन ऋषि-मुनियों द्वारा प्रदत्त ज्योतिष एवं धर्म शास्त्र के ज्ञान को आधुनिक तकनीक के माध्यम से सरल, सटीक और सर्वसुलभ बनाना है।':
    'JyotishWala is a trusted digital platform dedicated to the Sanatana Vedic tradition, pure Drik-Ganita Panchang, and authentic astrological guidance. Our mission is to make the wisdom of Vedic astrology and Dharma Shastras passed down by ancient sages simple, accurate, and accessible through modern technology.',
  'हमारे मंच पर दैनिक ऋषिकेश पंचांग, जन्म कुंडली निर्माण, अष्टकूट ३६ गुण मिलान, दैनिक-मासिक-वार्षिक राशिफल, ग्रह गोचर, रत्न एवं अंक ज्योतिष कैलकुलेटर, सनातन व्रत-त्योहार कैलेंडर तथा प्रामाणिक वैदिक मंत्रों का संकलन उपलब्ध है।':
    'Our platform offers the daily Rishikesh Panchang, Janma Kundli generation, Ashtakoot 36 Guna Milan, Daily-Monthly-Yearly Horoscopes, Planetary Transits, Gemstone & Numerology Calculators, Sanatana Vrat-Tyohar Calendar, and a curated collection of authentic Vedic Mantras.',
  'काशी, ऋषिकेश, हरिद्वार और उज्जैन के लब्धप्रतिष्ठित आचार्यों के मार्गदर्शन में हम प्रत्येक गणना और धार्मिक जानकारी की प्रामाणिकता सुनिश्चित करते हैं।':
    'Under the guidance of distinguished Acharyas from Kashi, Rishikesh, Haridwar, and Ujjain, we ensure the authenticity of every calculation and scriptural insight.',
  'JyotishWala में हम आपके व्यक्तिगत डेटा और जन्म विवरण (जन्म तिथि, जन्म समय एवं जन्म स्थान) की गोपनीयता का पूर्ण सम्मान करते हैं।':
    'At JyotishWala, we fully respect the privacy of your personal data and birth details (date of birth, time of birth, and place of birth).',
  '१. डेटा संग्रह एवं उपयोग: आपके द्वारा कुंडली निर्माण या पंचांग गणना हेतु दर्ज किया गया जन्म विवरण और स्थान केवल सटीक ज्योतिषीय गणना प्रस्तुत करने के लिए ही उपयोग किया जाता है।':
    '1. Data Collection & Use: The birth details and location entered by you for Kundli generation or Panchang calculation are used strictly to provide accurate astrological calculations.',
  '२. डेटा सुरक्षा: आपकी व्यक्तिगत जानकारी किसी भी तृतीय पक्ष (Third-Party) को बेची या साझा नहीं की जाती है। आपकी सहेजी गई कुंडलियां और प्राथमिकताएं आपके डिवाइस में सुरक्षित रहती हैं।':
    '2. Data Security: Your personal information is never sold or shared with any third party. Your saved Kundlis and preferences remain securely stored on your device.',
  '३. परामर्श गोपनीयता: आचार्यों एवं पंडित जी के साथ किया गया आपका संवाद एवं ज्योतिषीय परामर्श पूर्णतः गोपनीय रखा जाता है।':
    '3. Consultation Confidentiality: Your communication and astrological consultation with our Acharyas and Pandits are kept completely confidential.',

  // ============================================================================
  // 4. REVIEWS & ADMIN REPLIES (reviewService.ts)
  // ============================================================================
  'जन्म कुंडली एवं परामर्श': 'Janma Kundli & Consultation',
  'अष्टकूट कुंडली मिलान': 'Ashtakoot Kundli Matching',
  'दैनिक पंचांग एवं मुहूर्त': 'Daily Panchang & Muhurat',
  'पंडित जी से परामर्श': 'Pandit Ji Consultation',
  'रत्न एवं साढ़ेसाती गणना': 'Gemstone & Sade Sati Calculator',
  'रुद्राभिषेक एवं पूजन': 'Rudrabhishek & Puja',
  'राशिफल एवं ग्रह गोचर': 'Horoscope & Planetary Transit',
  'व्रत एवं त्योहार कैलेंडर': 'Vrat & Festival Calendar',
  'धर्म, माला जप एवं मंत्र': 'Dharma, Mala Japa & Mantras',
  'गृह प्रवेश मुहूर्त': 'Griha Pravesh Muhurat',
  'वास्तु एवं अंक ज्योतिष': 'Vastu & Numerology',
  'सामान्य अनुभव': 'General Experience',
  '12 अक्टूबर 2025': '12 October 2025',
  '08 अक्टूबर 2025': '08 October 2025',
  '03 अक्टूबर 2025': '03 October 2025',
  '28 सितंबर 2025': '28 September 2025',
  '21 सितंबर 2025': '21 September 2025',
  '15 सितंबर 2025': '15 September 2025',
  '09 सितंबर 2025': '09 September 2025',
  '02 सितंबर 2025': '02 September 2025',
  '25 अगस्त 2025': '25 August 2025',
  '18 अगस्त 2025': '18 August 2025',

  'ज्योतिषवाला ऐप पर मेरी जन्म कुंडली की गणना और विंशोत्तरी दशा का विश्लेषण अत्यंत सटीक निकला। आचार्य जी द्वारा बताए गए वैदिक उपायों से मेरे व्यापार में रुके हुए कार्य पुनः प्रारंभ हो गए। हृदय से आभार!':
    'The calculation of my Janma Kundli and analysis of Vimshottari Dasha on the JyotishWala app turned out to be remarkably accurate. With the Vedic remedies suggested by Acharya Ji, stalled works in my business resumed smoothly. Heartfelt gratitude!',
  'राकेश जी, आपके विश्वास और स्नेह के लिए कोटिशः धन्यवाद। भगवान विश्वनाथ की कृपा आप पर सदैव बनी रहे।':
    'Rakesh Ji, thank you immensely for your trust and affection. May the blessings of Lord Vishwanath always remain with you.',

  'मेरी पुत्री के विवाह के लिए हमने यहाँ अष्टकूट ३६ गुण मिलान किया। नाड़ी दोष और भकूट के परिहार की इतनी स्पष्ट शास्त्रीय जानकारी अन्यत्र कहीं नहीं मिली। यह ऐप वास्तव में प्रामाणिक है।':
    'We performed the Ashtakoot 36 Guna matching here for our daughter’s marriage. Such clear scriptural explanation of Nadi Dosha and Bhakoot remedies was not found anywhere else. This app is truly authentic.',
  'सुनीता जी, आपकी पुत्री के सुखद एवं मंगलमय वैवाहिक जीवन के लिए हमारी ढेर सारी शुभकामनाएं।':
    'Sunita Ji, our warmest wishes for your daughter’s happy and blessed married life.',

  'मैं प्रतिदिन सुबह पूजा से पहले ज्योतिषवाला का ऋषिकेश पंचांग और संकल्प मंत्र देखता हूँ। शहर के अनुसार सूर्योदय, राहुकाल और चौघड़िया का समय बिल्कुल सटीक रहता है।':
    'Every morning before worship, I check JyotishWala’s Rishikesh Panchang and Sankalp Mantra. The timings of sunrise, Rahu Kaal, and Chaughadiya according to my city are always spot on.',

  'करियर में असमंजस की स्थिति थी। पंडित जी से बात करके और रत्न परामर्श कैलकुलेटर से मार्गदर्शन लेकर मैंने पन्ना धारण किया, जिससे आत्मविश्वास और कार्यक्षेत्र में सकारात्मक बदलाव आया।':
    'I was facing uncertainty in my career. After speaking with Pandit Ji and taking guidance from the Gemstone Calculator, I wore an Emerald, which brought confidence and positive change at work.',
  'विकास जी, आपके उज्ज्वल भविष्य एवं करियर में निरंतर प्रगति की कामना करते हैं।':
    'Vikas Ji, we wish you a bright future and continuous progress in your career.',

  'शनि साढ़ेसाती के चरण और उसके सरल सात्विक उपायों की जानकारी बहुत ही सहज भाषा में दी गई है। किसी प्रकार का भय दिखाने के बजाय सकारात्मक मार्गदर्शन दिया जाता है।':
    'Information on the phases of Shani Sade Sati and its simple Sattvic remedies is presented in very accessible language. Instead of creating fear, positive spiritual guidance is provided.',

  'हमारे नए घर के गृह प्रवेश और रुद्राभिषेक अनुष्ठान के लिए ज्योतिषवाला के आचार्यों ने अद्भुत वैदिक विधि से पूजन संपन्न कराया। फोटो गैलरी में भी उन पलों को देखकर मन प्रसन्न हो जाता है।':
    'For our new home’s Griha Pravesh and Rudrabhishek ceremony, the Acharyas of JyotishWala conducted the worship with wonderful Vedic rituals. Seeing those moments in the photo gallery fills the heart with joy.',
  'मनोज जी, आपके नूतन गृह में सुख, शांति और समृद्धि का सदैव वास रहे। सादर प्रणाम!':
    'Manoj Ji, may happiness, peace, and prosperity always reside in your new home. Warm regards!',

  'दैनिक और मासिक राशिफल की सटीकता अद्भुत है। ग्रह गोचर का प्रभाव और शुभ समय देखकर मैं अपने महत्वपूर्ण व्यापारिक निर्णय लेती हूँ।':
    'The accuracy of the daily and monthly horoscope is remarkable. I make my important business decisions after checking the planetary transit impacts and auspicious timings.',

  'साल भर के सभी प्रमुख व्रत, एकादशी और त्योहारों की तिथि व पूजा विधि एक ही स्थान पर मिल जाती है। एकादशी पारण और शुभ मुहूर्त जानने के लिए यह सर्वश्रेष्ठ ऐप है।':
    'The dates and worship methods for all major fasts, Ekadashis, and festivals throughout the year are available in one place. This is the best app for checking Ekadashi Parana and auspicious Muhurats.',

  'डिजिटल रुद्राक्ष माला जप और भगवद गीता के श्लोकों का संकलन मुझे बहुत पसंद आया। यात्रा के समय भी मैं अपनी दैनिक १०८ जप की साधना आसानी से पूरी कर पाता हूँ।':
    'I really loved the digital Rudraksha Mala Japa and the collection of Bhagavad Gita Shlokas. Even while traveling, I can easily complete my daily spiritual practice of 108 chants.',

  'बिना किसी भ्रम के शुद्ध वैदिक गणित पर आधारित कुंडली और मुहूर्त दिखाने वाला एकमात्र ऐप। इसका इंटरफ़ेस बहुत ही शांत, सुंदर और उपयोग में सरल है।':
    'The only app that displays Kundli and Muhurat based on pure Vedic astronomy without any confusion. Its interface is very peaceful, clean, and easy to use.',

  // ============================================================================
  // 5. PHOTO GALLERY (galleryService.ts)
  // ============================================================================
  'वैदिक अनुष्ठान, पूजा-पाठ एवं ज्योतिष गैलरी': 'Vedic Rituals, Puja-Paath & Astrology Gallery',
  'हमारे संस्थान द्वारा काशी, ऋषिकेश, उज्जैन एवं हरिद्वार में संपन्न कराए गए महायज्ञ, रुद्राभिषेक, ग्रह शांति, कुंडली परामर्श और मांगलिक अनुष्ठानों की प्रामाणिक झलकियां।':
    'Authentic glimpses of Mahayagyas, Rudrabhishek, Graha Shanti, Kundli consultations, and auspicious rituals conducted by our institution in Kashi, Rishikesh, Ujjain, and Haridwar.',
  'संपन्न वैदिक अनुष्ठान': 'Completed Vedic Rituals',
  'तीर्थ एवं ज्योतिष केंद्र': 'Pilgrimage & Astrology Centers',
  'आचार्य एवं विद्वान ब्राह्मण': 'Acharyas & Learned Brahmins',
  'अपना अनुष्ठान या पूजा बुक करना चाहते हैं?': 'Want to Book Your Own Ritual or Puja?',
  'रुद्राभिषेक, नवग्रह शांति, महामृत्युंजय जप या कुंडली परामर्श के लिए हमारे अनुभवी आचार्यों से सीधे जुड़ें।':
    'Connect directly with our experienced Acharyas for Rudrabhishek, Navagraha Shanti, Mahamrityunjaya Japa, or Kundli consultation.',
  'पंडित जी से संपर्क करें': 'Contact Pandit Ji',
  'रुद्राभिषेक एवं शिव पूजन': 'Rudrabhishek & Shiva Puja',
  'हवन एवं महायज्ञ': 'Havan & Mahayagya',
  'ज्योतिष एवं कुंडली परामर्श': 'Astrology & Kundli Consultation',
  'गंगा आरती एवं तीर्थ अनुष्ठान': 'Ganga Aarti & Tirtha Rituals',
  'ग्रह शांति एवं रत्न संस्कार': 'Graha Shanti & Gemstone Consecration',
  'विवाह एवं मांगलिक कार्य': 'Marriage & Auspicious Ceremonies',
  'वेद पाठ एवं ब्राह्मण भोज': 'Veda Paath & Brahmin Bhoj',

  // Gallery Titles & Locations
  'काशी विश्वनाथ रुद्राभिषेक महापूजन': 'Kashi Vishwanath Rudrabhishek Mahapujan',
  'दशाश्वमेध घाट, वाराणसी': 'Dashashwamedh Ghat, Varanasi',
  'आचार्य पं. विश्वनाथ शास्त्री': 'Acharya Pt. Vishwanath Shastri',
  'नवग्रह शांति एवं महामृत्युंजय हवन': 'Navagraha Shanti & Mahamrityunjaya Havan',
  'परमार्थ निकेतन, ऋषिकेश': 'Parmarth Niketan, Rishikesh',
  'आचार्य डॉ. राघवेंद्र जोशी': 'Acharya Dr. Raghavendra Joshi',
  'संध्याकालीन भव्य गंगा महाआरती अनुष्ठान': 'Grand Evening Ganga Maha Aarti Ceremony',
  'हर की पौड़ी, हरिद्वार': 'Har Ki Pauri, Haridwar',
  'पं. शिवकुमार त्रिपाठी': 'Pt. Shivkumar Tripathi',
  'पारंपरिक ताड़पत्र एवं हस्तलिखित जन्म कुंडली निर्माण': 'Traditional Palm-Leaf & Handwritten Janma Kundli Preparation',
  'ज्योतिषवाला केंद्र, वाराणसी': 'JyotishWala Center, Varanasi',
  'महालक्ष्मी कुबेर धनतेरस विशेष दीपोत्सव पूजन': 'Mahalakshmi Kuber Dhanteras Special Deepotsav Puja',
  'राम घाट, उज्जैन': 'Ram Ghat, Ujjain',
  'पं. कैलाश नारायण मिश्र': 'Pt. Kailash Narayan Mishra',
  'वैदिक नवरत्न अभिमंत्रण एवं प्राण-प्रतिष्ठा संस्कार': 'Vedic Navaratna Consecration & Prana-Pratishtha Ceremony',
  'प्रयागराज संगम क्षेत्र': 'Prayagraj Sangam Kshetra',
  'वैदिक रीति से सप्तपदी एवं शुभ विवाह संस्कार': 'Saptapadi & Auspicious Wedding Ceremony by Vedic Rites',
  'जयपुर, राजस्थान': 'Jaipur, Rajasthan',
  'आचार्य पं. गोविंद वल्लभ पंत': 'Acharya Pt. Govind Vallabh Pant',
  'गुरुकुल बटुकों द्वारा शुक्ल यजुर्वेद संहिता पाठ': 'Shukla Yajurveda Samhita Recitation by Gurukul Students',
  'अस्सी घाट वेद विद्यालय, काशी': 'Assi Ghat Veda Vidyalaya, Kashi',
  'कालसर्प एवं राहु-केतु शांति विशेष अनुष्ठान': 'Kaal Sarp & Rahu-Ketu Shanti Special Ritual',
  'त्र्यंबकेश्वर ज्योतिर्लिंग, नासिक': 'Trimbakeshwar Jyotirlinga, Nashik',
  'पं. माधवराव देशमुख': 'Pt. Madhavrao Deshmukh',
  'श्रीमद्भगवद्गीता एवं श्रीरामचरितमानस नवाह्न पारायण': 'Shrimad Bhagavad Gita & Ramcharitmanas Navahna Parayana',
  'सरयू तट, अयोध्या धाम': 'Saryu Bank, Ayodhya Dham',
  'आचार्य पं. रामचंद्र दास': 'Acharya Pt. Ramchandra Das',
  'नूतन गृह प्रवेश एवं वास्तु शांति कलश स्थापना': 'New Home Griha Pravesh & Vastu Shanti Kalash Sthapana',
  'इंदौर, मध्य प्रदेश': 'Indore, Madhya Pradesh',
  'पं. आशुतोष द्विवेदी': 'Pt. Ashutosh Dwivedi',
  'चैत्र एवं शारदीय नवरात्रि अष्टमी कन्या पूजन व महायज्ञ': 'Chaitra & Shardiya Navratri Ashtami Kanya Pujan & Mahayagya',
  'विंध्यवासिनी धाम, मिर्जापुर': 'Vindhyavasini Dham, Mirzapur',
  'सूर्य ग्रहण एवं अमावस्या पितृ तर्पण व दीपदान': 'Solar Eclipse & Amavasya Pitru Tarpan & Deepdaan',
  'त्रिवेणी घाट, ऋषिकेश': 'Triveni Ghat, Rishikesh',
  'वार्षिक अखिल भारतीय वैदिक ज्योतिष एवं पंचांग सम्मेलन': 'Annual All-India Vedic Astrology & Panchang Conference',
  'विज्ञान भवन सभागार, नई दिल्ली': 'Vigyan Bhawan Auditorium, New Delhi',
  'ज्योतिषवाला विद्वत परिषद': 'JyotishWala Council of Scholars',
  'महाशिवरात्रि चार प्रहर पार्थिव शिवलिंग रुद्राभिषेक': 'Mahashivratri Four-Prahar Parthiv Shivalinga Rudrabhishek',
  'महाकालेश्वर क्षेत्र, उज्जैन': 'Mahakaleshwar Kshetra, Ujjain',
  'बृहस्पतिवार विशेष श्री विष्णु सहस्रनाम एवं तुलसी अर्चना': 'Thursday Special Shri Vishnu Sahasranama & Tulsi Archana',
  'बद्रीनाथ धाम, उत्तराखंड': 'Badrinath Dham, Uttarakhand',
  'अन्नप्राशन एवं नामकरण षोडश संस्कार पूजन': 'Annaprashan & Namakaran Shodasha Samskara Puja',
  'लखनऊ, उत्तर प्रदेश': 'Lucknow, Uttar Pradesh',
  'पं. करुणाशंकर शुक्ल': 'Pt. Karunashankar Shukla',
  'शनि साढ़ेसाती एवं ढैय्या निवारण तैलाभिषेक अनुष्ठान': 'Shani Sade Sati & Dhaiyya Relief Tailabhishek Ritual',
  'शनि शिंगणापुर / उज्जैन नवग्रह मंदिर': 'Shani Shingnapur / Ujjain Navagraha Temple',

  // ============================================================================
  // 6. PANDIT PROFILES (astrologerService.ts)
  // ============================================================================
  'आचार्य (फलित ज्योतिष) - संपूर्णानंद संस्कृत विश्वविद्यालय, काशी':
    'Acharya (Predictive Astrology) - Sampoornanand Sanskrit University, Kashi',
  'जन्म कुंडली विश्लेषण': 'Birth Chart (Janma Kundli) Analysis',
  'विवाह एवं गुण मिलान': 'Marriage & Guna Matching',
  'ग्रह शांति उपाय': 'Planetary Peace Remedies',
  'दशाश्वमेध मार्ग, वाराणसी (उ.प्र.)': 'Dashashwamedh Marg, Varanasi (U.P.)',
  '₹501 / परामर्श (30 मिनट)': '₹501 / Consultation (30 Mins)',
  'काशी की प्राचीन वैदिक परंपरा में दीक्षित पं. विश्वनाथ शास्त्री जी को सटीक भृगु और पाराशरी कुंडली फलित का 22 वर्षों का गहन अनुभव है।':
    'Initiated into the ancient Vedic tradition of Kashi, Pt. Vishwanath Shastri holds 22 years of deep experience in accurate Bhrigu and Parashari horoscope predictions.',
  'विद्यावारिधि (Ph.D. वैदिक ज्योतिष एवं वास्तु) - उत्तराखंड संस्कृत विश्वविद्यालय':
    'Vidyavaridhi (Ph.D. in Vedic Astrology & Vastu) - Uttarakhand Sanskrit University',
  'प्रश्न कुंडली': 'Horary Astrology (Prashna Kundli)',
  'वास्तु एवं मुहूर्त': 'Vastu & Auspicious Muhurat',
  'रत्न परामर्श': 'Gemstone Consultation',
  'तपोवन, ऋषिकेश (उत्तराखंड)': 'Tapovan, Rishikesh (Uttarakhand)',
  '₹751 / परामर्श (45 मिनट)': '₹751 / Consultation (45 Mins)',
  'करियर, व्यापारिक अवरोध और वास्तु दोष निवारण में विशेषज्ञता। आपके द्वारा सुझाए गए सात्विक उपायों से हजारों परिवार लाभान्वित हुए हैं।':
    'Specializes in career guidance, business obstacles, and Vastu Dosha remedies. Thousands of families have benefited from his pure Sattvic remedies.',
  'ज्योतिषाचार्य एवं कर्मकांड विशेषज्ञ - महर्षि पाणिनि संस्कृत विश्वविद्यालय, उज्जैन':
    'Jyotishacharya & Ritual Specialist - Maharishi Panini Sanskrit University, Ujjain',
  'मांगलिक एवं कालसर्प दोष': 'Manglik & Kaal Sarp Dosha',
  'अंक ज्योतिष': 'Numerology',
  'वैदिक अनुष्ठान': 'Vedic Rituals (Anushthan)',
  'महाकाल क्षेत्र, उज्जैन (म.प्र.)': 'Mahakal Kshetra, Ujjain (M.P.)',
  '₹401 / परामर्श (30 मिनट)': '₹401 / Consultation (30 Mins)',
  'कुंडली में मांगलिक दोष, नाड़ी दोष परिहार और ग्रह शांति अनुष्ठानों के अनुभवी विद्वान। सरल एवं व्यावहारिक मार्गदर्शन के लिए प्रसिद्ध।':
    'Experienced scholar in Manglik Dosha, Nadi Dosha remedies, and planetary peace rituals. Renowned for simple and practical guidance.',

  // ============================================================================
  // 7. DHARMA MANTRAS, GITA SHLOKAS & DAILY PUJA (dharmaService.ts)
  // ============================================================================
  'गायत्री महामंत्र': 'Gayatri Mahamantra',
  'सविता / गायत्री माता': 'Lord Savita / Goddess Gayatri',
  'उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा को हम अपनी अंतरात्मा में धारण करें। वह परमात्मा हमारी बुद्धि को सन्मार्ग में प्रेरित करे।':
    'We meditate upon that life-giving, sorrow-destroying, blissful, supreme, radiant, sin-destroying, divine Supreme Spirit within our soul. May that Supreme Lord inspire our intellect toward the righteous path.',
  'बुद्धि की शुद्धि, एकाग्रता, आध्यात्मिक तेज और मानसिक शांति की प्राप्ति।':
    'Attainment of purity of intellect, concentration, spiritual radiance, and mental peace.',

  'महामृत्युंजय मंत्र': 'Mahamrityunjaya Mantra',
  'भगवान शिव': 'Lord Shiva',
  'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो सुगंधित हैं और संपूर्ण जगत का पोषण करते हैं। जिस प्रकार पकी हुई ककड़ी बेल से स्वतः मुक्त हो जाती है, उसी प्रकार वे हमें मृत्यु और रोग के बंधन से मुक्त कर मोक्ष प्रदान करें।':
    'We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe cucumber is effortlessly freed from its vine, may He liberate us from the bondage of disease and death and grant us immortality.',
  'अकाल मृत्यु भय का नाश, गंभीर रोगों से रक्षा और दीर्घायु की प्राप्ति।':
    'Elimination of the fear of untimely death, protection from serious ailments, and attainment of longevity.',

  'श्री गणेश विघ्ननाशक मंत्र': 'Shri Ganesha Vighna-Nashak Mantra',
  'श्री गणेश': 'Lord Ganesha',
  'घुमावदार सूंड वाले, विशाल शरीर काय, करोड़ों सूर्यों के समान महान प्रतिभाशाली भगवान श्री गणेश, मेरे सभी कार्यों को सदा बिना किसी विघ्न के पूर्ण करें।':
    'O Lord Ganesha, of curved trunk, massive body, and the brilliance of a million suns, please make all my endeavors free of obstacles always.',
  'नए कार्य के शुभारंभ में सभी बाधाओं का निवारण और शुभता की प्राप्ति।':
    'Removal of all obstacles at the beginning of new endeavors and attainment of auspiciousness.',

  'नवग्रह शांति मंत्र': 'Navagraha Shanti Mantra',
  'नवग्रह देवता': 'Navagraha Deities',
  'ब्रह्मा, मुरारी (विष्णु), त्रिपुरान्तकारी (शिव), भानु (सूर्य), शशि (चंद्र), भूमिसुत (मंगल), बुध, गुरु, शुक्र, शनि, राहु और केतु — ये सभी ग्रह मेरे लिए शांत और अनुकूल हों तथा मेरे प्रातःकाल को मंगलमय बनाएं।':
    'May Brahma, Vishnu, Shiva, Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu—all these celestial forces remain peaceful and favorable toward me and make my morning auspicious.',
  'कुंडली के अशुभ ग्रह दोषों का शमन और दैनिक सौभाग्य में वृद्धि।':
    'Pacification of unfavorable planetary afflictions in the birth chart and enhancement of daily fortune.',

  'महालक्ष्मी ऐश्वर्य मंत्र': 'Mahalakshmi Aishwarya Mantra',
  'मां महालक्ष्मी': 'Goddess Mahalakshmi',
  'हे महामाये! श्रीपीठ पर स्थित और देवताओं द्वारा पूजित, शंख, चक्र और गदा धारण करने वाली मां महालक्ष्मी, आपको मेरा बारंबार प्रणाम है।':
    'O Mahamaya! Seated on the sacred Sri Peetha, worshipped by the Gods, and holding the conch, discus, and mace—O Goddess Mahalakshmi, my repeated salutations to You.',
  'आर्थिक समृद्धि, व्यापार में उन्नति और घर में स्थायी सुख-संपदा का वास।':
    'Financial prosperity, progress in business, and lasting happiness and wealth in the home.',

  'श्री हनुमते संकटमोचन मंत्र': 'Shri Hanumate Sankatmochan Mantra',
  'श्री हनुमान जी': 'Lord Hanuman',
  'अतुलित बल के धाम, सोने के पर्वत (सुमेरु) के समान कांतिमान शरीर वाले, दैत्यरूपी वन को ध्वस्त करने वाले अग्नि के समान, ज्ञानियों में अग्रगण्य, सकल गुणों के निधान, वानरों के स्वामी और श्री रघुनाथ जी के प्रिय दूत पवनपुत्र हनुमान जी को मैं प्रणाम करता हूँ।':
    'I bow to Lord Hanuman, the abode of unmatched strength, whose body shines like a golden mountain, who is like fire to the forest of demons, foremost among the wise, treasure of all virtues, lord of the Vanaras, and beloved messenger of Lord Rama.',
  'भय, नजर दोष, शनि पीड़ा का निवारण और अदम्य साहस व आत्मबल की प्राप्ति।':
    'Removal of fear, evil eye, and Saturn afflictions, and attainment of indomitable courage and inner strength.',

  // Gita Shlokas
  'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल का हेतु मत बनो और न ही तुम्हारी कर्म न करने में आसक्ति हो।':
    'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  'निष्काम कर्मयोग: चिंता छोड़कर पूर्ण निष्ठा से अपना कर्तव्य निभाने की प्रेरणा।':
    'Selfless Karma Yoga: Inspiration to perform one’s duty with complete dedication while letting go of anxiety over results.',

  'हे भारत (अर्जुन)! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं धर्म की स्थापना के लिए स्वयं को प्रकट करता हूँ।':
    'O descendant of Bharata (Arjuna)! Whenever and wherever there is a decline in righteousness and a predominance of unrighteousness, at that time I manifest Myself to re-establish Dharma.',
  'ईश्वरीय विश्वास: कठिन परिस्थितियों में भी सत्य और धर्म की विजय का आश्वासन।':
    'Divine Faith: Assurance of the victory of truth and righteousness even in difficult circumstances.',

  'जो मनुष्य श्रद्धालु है, साधनपरायण है और जिसने अपनी इंद्रियों को वश में कर लिया है, वह परम ज्ञान को प्राप्त करता है और ज्ञान प्राप्त करके शीघ्र ही परम शांति को प्राप्त हो जाता है।':
    'A person who is full of faith, devoted to spiritual practice, and has mastered the senses attains transcendental knowledge; having achieved this knowledge, they quickly attain supreme peace.',
  'श्रद्धा और संयम: ज्ञान और मानसिक शांति प्राप्त करने का मूल सूत्र।':
    'Faith & Self-Control: The foundational principle for attaining wisdom and supreme mental peace.',

  'जो लोग अनन्य भाव से मेरा चिंतन करते हुए मेरी उपासना करते हैं, उन नित्ययुक्त भक्तों का योगक्षेम (अप्राप्त की प्राप्ति और प्राप्त की रक्षा) मैं स्वयं वहन करता हूँ।':
    'For those who worship Me exclusively with unwavering devotion, meditating on My transcendental form, I personally carry what they lack and preserve what they have (Yoga-Kshema).',
  'शरणागति: ईश्वर पर पूर्ण भरोसा रखने वाले भक्त की सभी आवश्यकताओं की पूर्ति स्वयं भगवान करते हैं।':
    'Surrender to the Divine: The Supreme Lord personally takes care of all the needs of a devotee who places complete trust in Him.',

  // Daily Puja Guides
  'प्रातःकालीन पंचदेव एवं इष्ट पूजन विधि': 'Morning Panchadeva & Ishta Puja Vidhi',
  'दैनिक पूजा': 'Daily Worship',
  '15-20 मिनट': '15-20 Minutes',
  'तांबे का लोटा व शुद्ध जल': 'Copper vessel & pure water',
  'रोली, अक्षत (अखंड चावल) व चंदन': 'Roli, Akshat (whole rice) & sandalwood paste',
  'गाय के घी का दीपक व धूपबत्ती': 'Cow ghee lamp & incense sticks',
  'ताजे पुष्प व तुलसी दल': 'Fresh flowers & Tulsi leaves',
  'नैवेद्य (मिश्री, फल या मिठाई)': 'Naivedya (Mishri, fruits, or sweets)',
  'आचमन एवं पवित्रीकरण': 'Achamana & Purification',
  'स्नान के पश्चात स्वच्छ वस्त्र पहनकर पूर्व या उत्तरमुखी आसन पर बैठें। बाएं हाथ से दाएं हाथ में तीन बार जल लेकर "ॐ केशवाय नमः, ॐ नारायणाय नमः, ॐ माधवाय नमः" बोलते हुए आचमन करें और चौथी बार "ॐ हृषीकेशाय नमः" बोलकर हाथ धो लें।':
    'After bathing, wear clean clothes and sit on an Asana facing East or North. Take water three times from the left hand into the right palm, sip it chanting "Om Keshavaya Namah, Om Narayanaya Namah, Om Madhavaya Namah", and wash your hands the fourth time chanting "Om Hrishikeshaya Namah".',
  'दीप प्रज्वलन एवं स्वस्तिवाचन': 'Lighting the Lamp & Invocation',
  'भगवान के समक्ष गाय के घी का दीपक जलाएं और प्रार्थना करें: "शुभं करोति कल्याणमारोग्यं धनसंपदा। शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते॥"':
    'Light a cow ghee lamp before the deity and pray: "Shubham Karoti Kalyanam Arogyam Dhana Sampada, Shatru Buddhi Vinashaya Deepa Jyotir Namostu Te."',
  'संकल्प एवं श्री गणेश स्मरण': 'Sankalp & Remembering Lord Ganesha',
  'दाएं हाथ में जल, अक्षत और पुष्प लेकर आज की तिथि, वार और स्थान का उच्चारण करते हुए पूजन का संकल्प लें। सर्वप्रथम विघ्नहर्ता श्री गणेश को प्रणाम कर तिलक लगाएं।':
    'Holding water, unbroken rice, and flowers in your right hand, take the sacred vow (Sankalp) pronouncing today’s Tithi, weekday, and location. First bow to Lord Ganesha and apply Tilak.',
  'पंचोपचार पूजन (चंदन, पुष्प, धूप, दीप, नैवेद्य)': 'Panchopachara Worship (Sandalwood, Flowers, Incense, Lamp, Offering)',
  'अपने इष्टदेव एवं पंचदेवों को क्रमशः चंदन/रोली का तिलक लगाएं, पुष्प अर्पित करें, धूप और दीप दिखाएं तथा श्रद्धापूर्वक फल या मिश्री का भोग लगाएं। (भगवान विष्णु को तुलसी दल अवश्य अर्पित करें, गणेश जी व शिव जी को तुलसी न चढ़ाएं)।':
    'Offer sandalwood/Roli Tilak to your Ishta Devata and the five deities, offer flowers, wave incense and the lamp, and devoutly offer fruits or Mishri. (Always offer Tulsi leaves to Lord Vishnu; do not offer Tulsi to Lord Ganesha or Lord Shiva).',
  'मंत्र जप एवं आरती': 'Mantra Chanting & Aarti',
  'अपनी रुद्राक्ष या तुलसी माला से इष्ट मंत्र या गायत्री मंत्र की कम से कम १ माला (१०८ बार) जप करें। अंत में कर्पूर या घी के दीपक से आरती करें और "कर्पूरगौरं करुणावतारं..." बोलकर क्षमा प्रार्थना करें।':
    'Chant at least 1 Mala (108 beads) of your Ishta Mantra or Gayatri Mantra using a Rudraksha or Tulsi rosary. Conclude with Aarti using camphor or a ghee lamp and offer a prayer for forgiveness chanting "Karpuragauram Karunavataram...".',

  'सांयकालीन संध्या दीपदान एवं आरती विधि': 'Evening Sandhya Deepdaan & Aarti Vidhi',
  'संध्या वंदना': 'Evening Prayer',
  '10-15 मिनट': '10-15 Minutes',
  'घी व तिल के तेल का दीपक': 'Ghee & sesame oil lamp',
  'कर्पूर एवं लौंग': 'Camphor & cloves',
  'धूप या गुग्गुल': 'Incense or Guggul',
  'पुष्प व जल पात्र': 'Flowers & water vessel',
  'हस्त-पाद प्रक्षालन': 'Washing Hands & Feet',
  'सूर्यास्त के समय गोधूलि बेला में हाथ-पैर और मुख धोकर मंदिर के समक्ष शांत चित्त से बैठें।':
    'At twilight during sunset, wash your hands, feet, and face, and sit with a calm mind before the home altar.',
  'तुलसी एवं मुख्य द्वार दीपदान': 'Lighting Lamps at Tulsi & Main Entrance',
  'एक घी का दीपक मंदिर में, दूसरा तुलसी चौरा के पास और तीसरा घर के मुख्य द्वार के दाहिनी ओर प्रज्वलित करें। इससे घर में सकारात्मक ऊर्जा और मां लक्ष्मी का आगमन होता है।':
    'Light one ghee lamp at the home temple, a second near the Tulsi plant, and a third on the right side of the main entrance. This invites positive energy and Goddess Lakshmi into the home.',
  'संध्या आरती एवं श्लोक पाठ': 'Evening Aarti & Hymn Recitation',
  'परिवार सहित भगवान की संध्या आरती करें, हनुमान चालीसा या विष्णु सहस्रनाम के नामों का स्मरण करें और दिनभर के ज्ञात-अज्ञात अपराधों के लिए क्षमा मांगें।':
    'Perform the evening Aarti with your family, recite the Hanuman Chalisa or names from the Vishnu Sahasranama, and seek forgiveness for any known or unknown errors committed during the day.',

  // ============================================================================
  // 8. CALCULATORS: NUMEROLOGY & VASTU (calculatorService.ts)
  // ============================================================================
  'अग्नि तत्व': 'Fire Element',
  'सुनहरा, नारंगी, पीला': 'Golden, Orange, Yellow',
  'नेतृत्व क्षमता, आत्मनिर्भर, महत्वाकांक्षी, दृढ़ निश्चयी और स्वाभिमानी।':
    'Strong leadership ability, self-reliant, ambitious, determined, and self-respecting.',
  'प्रशासनिक सेवा, राजनीति, प्रबंधन, उद्यमिता और उच्च पद।':
    'Administrative services, politics, management, entrepreneurship, and leadership positions.',
  'प्रतिदिन सूर्योदय के समय सूर्य को अर्घ्य दें और रविवार को गुड़ या गेहूं का दान करें।':
    'Offer water (Arghya) to the rising Sun daily and donate jaggery or wheat on Sundays.',

  'जल तत्व': 'Water Element',
  'सफेद, क्रीम, हल्का हरा': 'White, Cream, Light Green',
  'कल्पनाशील, संवेदनशील, शांतिप्रिय, कूटनीतिज्ञ और सहयोगी स्वभाव।':
    'Imaginative, sensitive, peace-loving, diplomatic, and cooperative nature.',
  'कला, संगीत, लेखन, मनोविज्ञान, चिकित्सा, डेयरी और जल संबंधी व्यापार।':
    'Arts, music, writing, psychology, medicine, dairy, and water-related businesses.',
  'सोमवार को शिवलिंग पर जल व दूध अर्पित करें और चांदी का छल्ला धारण करें।':
    'Offer water and milk on the Shiva Linga on Mondays and wear a silver ring.',

  'अग्नि/आकाश तत्व': 'Fire / Ether Element',
  'पीला, केसरिया, गुलाबी': 'Yellow, Saffron, Pink',
  'ज्ञानवान, अनुशासित, आशावादी, दार्शनिक और मार्गदर्शक।':
    'Knowledgeable, disciplined, optimistic, philosophical, and a natural mentor.',
  'शिक्षा, वकालत, न्यायपालिका, बैंकिंग, धर्म उपदेशक और परामर्शदाता।':
    'Education, law, judiciary, banking, spiritual teaching, and consulting.',
  'गुरुवार को माथे पर केसर या हल्दी का तिलक लगाएं और गुरुजनों का सम्मान करें।':
    'Apply a saffron or turmeric Tilak on your forehead on Thursdays and respect elders and teachers.',

  'वायु तत्व': 'Air Element',
  'नीला, स्लेटी, चमकीला सफेद': 'Blue, Slate Grey, Bright White',
  'व्यावहारिक, क्रांतिकारी विचार, समस्या समाधानकर्ता और लीक से हटकर सोचने वाले।':
    'Practical, innovative thinker, problem-solver, and out-of-the-box strategist.',
  'सूचना प्रौद्योगिकी (IT), इंजीनियरिंग, शोध, मीडिया और सामाजिक सुधार।':
    'Information Technology (IT), engineering, research, media, and social reform.',
  'गणेश जी की आराधना करें और पक्षियों को सात प्रकार का अनाज (सप्तधान्य) खिलाएं।':
    'Worship Lord Ganesha and feed seven types of grains (Saptadhanya) to birds.',

  'पृथ्वी तत्व': 'Earth Element',
  'हरा, हल्का भूरा, सफेद': 'Green, Light Brown, White',
  'बुद्धिमान, वाक्पटु, व्यापारिक समझ, त्वरित निर्णय लेने वाले और मिलनसार।':
    'Intelligent, eloquent, business-minded, quick decision-maker, and sociable.',
  'व्यापार, वाणिज्य, शेयर बाजार, पत्रकारिता, संचार और चार्टर्ड अकाउंटेंसी।':
    'Business, commerce, stock market, journalism, communications, and Chartered Accountancy.',
  'बुधवार को भगवान गणेश को दूर्वा अर्पित करें और गौ माता को हरा चारा खिलाएं।':
    'Offer Durva grass to Lord Ganesha on Wednesdays and feed green fodder to a cow.',

  'आसमानी, सफेद, गुलाबी': 'Sky Blue, White, Pink',
  'आकर्षक व्यक्तित्व, कलाप्रेमी, सौंदर्यबोधी, परिवार-प्रेमी और मिलनसार।':
    'Charming personality, art-loving, aesthetically inclined, family-oriented, and friendly.',
  'फैशन, फिल्म, कला, होटल-रेस्टोरेंट, आभूषण, इंटीरियर डिजाइनिंग और लग्जरी व्यापार।':
    'Fashion, film, arts, hospitality, jewelry, interior design, and luxury business.',
  'शुक्रवार को मां लक्ष्मी की उपासना करें और स्वच्छ व सुगंधित वस्त्र धारण करें।':
    'Worship Goddess Lakshmi on Fridays and wear clean, fragrant attire.',

  'हल्का पीला, सफेद, हरा': 'Light Yellow, White, Green',
  'अंतर्ज्ञानी, आध्यात्मिक, शोधकर्ता, शांत और दार्शनिक स्वभाव।':
    'Intuitive, spiritual, research-oriented, calm, and philosophical nature.',
  'शोध कार्य, ज्योतिष, अध्यात्म, लेखन, विदेश व्यापार और गुप्त विद्याएं।':
    'Research work, astrology, spirituality, writing, foreign trade, and esoteric sciences.',
  'मंगलवार और शनिवार को हनुमान जी का दर्शन करें तथा काले-सफेद कुत्ते को रोटी खिलाएं।':
    'Visit Lord Hanuman on Tuesdays and Saturdays and feed bread to a black-and-white dog.',

  'गहरा नीला, काला, बैंगनी': 'Deep Blue, Black, Purple',
  'कर्मठ, न्यायप्रिय, धैर्यवान, संघर्ष से शिखर तक पहुंचने वाले और गंभीर।':
    'Hardworking, justice-loving, patient, rising to the top through perseverance, and composed.',
  'न्याय, प्रशासन, खनिज, रियल एस्टेट, मशीनरी, उद्योग और समाज सेवा।':
    'Law, administration, minerals, real estate, machinery, industry, and social service.',
  'शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएं और श्रमिकों की सहायता करें।':
    'Light a mustard oil lamp under a Peepal tree on Saturdays and support working-class people.',

  'लाल, सिंदूरी, गुलाबी': 'Red, Vermilion, Pink',
  'साहसी, ऊर्जावान, परोपकारी, अनुशासित और अन्याय के विरुद्ध खड़े होने वाले।':
    'Courageous, energetic, philanthropic, disciplined, and always standing up against injustice.',
  'सेना, पुलिस, खेलकूद, शल्य चिकित्सा (सर्जरी), भूमि-भवन और अग्नि संबंधी कार्य।':
    'Defense, police, sports, surgery, real estate, and fire/energy-related professions.',
  'मंगलवार को हनुमान चालीसा का पाठ करें और लाल मसूर या गुड़ का दान करें।':
    'Recite the Hanuman Chalisa on Tuesdays and donate red lentils or jaggery.',

  // Vastu Directions
  'उत्तर-पूर्व (ईशान कोण)': 'North-East (Ishaan Corner)',
  'भगवान शिव / ईशान देव': 'Lord Shiva / Ishaan Dev',
  'बृहस्पति एवं केतु': 'Jupiter & Ketu',
  'पूजा घर (मंदिर), ध्यान कक्ष, जल स्रोत (बोरिंग/भूमिगत टंकी), अध्ययन कक्ष':
    'Prayer Room (Mandir), Meditation Room, Water Source (Borewell/Underground Tank), Study Room',
  'शौचालय, रसोईघर, भारी सामान या सीढ़ियां बिल्कुल न बनाएं':
    'Strictly avoid building a toilet, kitchen, heavy storage, or staircase here',
  'ईशान कोण को सदैव स्वच्छ व हल्का रखें और यहाँ तांबे या चांदी के पात्र में जल रखें।':
    'Always keep the North-East corner clean and uncluttered, and place water in a copper or silver vessel here.',

  'पूर्व (पूर्व दिशा)': 'East (Purva Direction)',
  'इंद्र देव': 'Lord Indra',
  'अग्नि/वायु तत्व': 'Fire / Air Element',
  'मुख्य प्रवेश द्वार, बैठक कक्ष (ड्राइंग रूम), बालकनी, स्नानघर':
    'Main Entrance Door, Living Room (Drawing Room), Balcony, Bathroom',
  'कूड़ादान या भारी अवरोध न रखें': 'Do not place dustbins or heavy obstructions here',
  'पूर्व की दीवार पर उगते हुए सूर्य का चित्र या तांबे का सूर्य यंत्र लगाएं।':
    'Place a painting of the rising Sun or a copper Surya Yantra on the eastern wall.',

  'दक्षिण-पूर्व (आग्नेय कोण)': 'South-East (Agneya Corner)',
  'अग्नि देव': 'Lord Agni (Fire God)',
  'रसोईघर (किचन), बिजली के उपकरण, इन्वर्टर/जनरेटर':
    'Kitchen, Electrical Appliances, Inverter / Generator',
  'पानी की टंकी, शौचालय या मुख्य शयनकक्ष न बनाएं':
    'Do not place a water tank, toilet, or master bedroom here',
  'रसोई में भोजन बनाते समय मुख पूर्व दिशा की ओर रखें और आग्नेय में लाल बल्ब या क्रिस्टल लगाएं।':
    'Face East while cooking in the kitchen and install a warm red light or crystal in the South-East.',

  'दक्षिण (याम्य दिशा)': 'South (Yamya Direction)',
  'यम देव': 'Lord Yama',
  'स्टोर रूम, भारी अलमारी, सीढ़ियां': 'Store Room, Heavy Wardrobes, Staircase',
  'मुख्य जल स्रोत या भूमिगत पानी का टैंक न बनाएं':
    'Do not build a main water source or underground water tank here',
  'दक्षिण मुखी द्वार होने पर पंचमुखी हनुमान जी का चित्र या मंगल यंत्र स्थापित करें।':
    'If there is a south-facing entrance, install an image of Panchamukhi Hanuman or a Mangal Yantra.',

  'दक्षिण-पश्चिम (नैऋत्य कोण)': 'South-West (Nairutya Corner)',
  'निरऋति देव': 'Deity Nirriti',
  'राहु एवं केतु': 'Rahu & Ketu',
  'मुखिया का शयनकक्ष (मास्टर बेडरूम), तिजोरी (उत्तरमुखी खुले), भारी निर्माण':
    'Master Bedroom, Safe/Locker (opening toward North), Heavy Construction',
  'भूमिगत जल टैंक, पूजा घर या बच्चों का कमरा न बनाएं':
    'Do not place an underground water tank, prayer room, or children’s room here',
  'इस दिशा को सबसे ऊंचा और भारी रखें; तिजोरी का मुख उत्तर (कुबेर दिशा) की ओर रखें।':
    'Keep this corner the highest and heaviest; ensure the locker opens toward the North (direction of Kuber).',

  'पश्चिम (वरुण दिशा)': 'West (Varuna Direction)',
  'वरुण देव': 'Lord Varuna',
  'जल/आकाश तत्व': 'Water / Space Element',
  'भोजन कक्ष (डाइनिंग रूम), बच्चों का शयनकक्ष, ओवरहेड वाटर टैंक':
    'Dining Room, Children’s Bedroom, Overhead Water Tank',
  'इस दिशा को पूर्व या उत्तर से नीचा न रखें':
    'Do not keep this direction lower than the East or North',
  'पश्चिम दिशा में शनि यंत्र या क्रिस्टल बॉल लगाने से स्थिरता आती है।':
    'Installing a Shani Yantra or crystal ball in the West brings stability.',

  'उत्तर-पश्चिम (वायव्य कोण)': 'North-West (Vayavya Corner)',
  'वायु देव': 'Lord Vayu (Wind God)',
  'अतिथि कक्ष (गेस्ट रूम), विवाह योग्य कन्या का कक्ष, वाहन पार्किंग, अनाज भंडार':
    'Guest Room, Room for Marriageable Daughter, Vehicle Parking, Grain Storage',
  'घर के मुखिया का स्थायी शयनकक्ष यहाँ न बनाएं':
    'Do not locate the permanent bedroom of the head of the family here',
  'वायव्य कोण में सुगंधित पौधे या विंड चाइम लगाना अत्यंत शुभ होता है।':
    'Placing fragrant plants or wind chimes in the North-West corner is highly auspicious.',

  'उत्तर (कुबेर दिशा)': 'North (Kuber Direction)',
  'कुबेर देव': 'Lord Kuber (God of Wealth)',
  'मुख्य द्वार, तिजोरी/धन स्थान, लिविंग रूम, बालकनी':
    'Main Entrance, Wealth/Safe Area, Living Room, Balcony',
  'शौचालय, रसोई या भारी कबाड़ बिल्कुल न रखें':
    'Strictly avoid placing a toilet, kitchen, or heavy clutter here',
  'उत्तर दिशा में कुबेर यंत्र, मनी प्लांट या हरे-भरे पौधे लगाएं।':
    'Place a Kuber Yantra, money plant, or lush green plants in the North direction.',

  // ============================================================================
  // 9. ARTICLES (articleService.ts)
  // ============================================================================
  'शनि का मीन राशि में गोचर: सभी १२ राशियों पर प्रभाव और अचूक वैदिक उपाय':
    'Saturn Transit in Pisces: Impact on All 12 Zodiac Signs & Infallible Vedic Remedies',
  'ग्रह गोचर': 'Planetary Transit',
  'आचार्य विश्वनाथ शास्त्री': 'Acharya Vishwanath Shastri',
  '६ मिनट': '6 Min Read',
  'न्याय के देवता शनि देव के मीन राशि में प्रवेश से साढ़ेसाती और ढैय्या के समीकरण बदल रहे हैं। जानिए आपकी राशि के लिए यह गोचर क्या संदेश लेकर आया है।':
    'With Lord Shani (the God of Justice) entering Pisces, the equations of Sade Sati and Dhaiyya are shifting. Discover what this transit brings for your zodiac sign.',
  'नीलांजनसमाभासं रविपुत्रं यमाग्रजम्। छायामार्तण्डसंभूतं तं नमामि शनैश्चरम्॥':
    'Neelanjana Samabhasam Raviputram Yamagrajam, Chhayamartanda Sambhutam Tam Namami Shanaishcharam.',
  'नीले अंजन के समान आभा वाले, सूर्यपुत्र और यमराज के बड़े भाई, छाया व सूर्य से उत्पन्न भगवान शनैश्चर को मैं नमन करता हूँ।':
    'I bow to Lord Shanaishchara, who shines like blue collyrium, the son of the Sun God, elder brother of Yama, born of Chhaya and Martanda.',
  'वैदिक ज्योतिष में शनि देव को कर्मफल दाता और दंडाधिकारी माना गया है। शनि मंद गति से चलते हुए एक राशि में लगभग ढाई वर्ष तक निवास करते हैं। जब शनि देव गुरु की राशि मीन में गोचर करते हैं, तो अध्यात्म, न्याय, अनुशासन और आत्मचिंतन का अनूठा संगम बनता है।':
    'In Vedic astrology, Lord Shani is revered as the dispenser of karmic fruits and the divine magistrate. Moving slowly, Saturn resides in one zodiac sign for approximately two and a half years. When Saturn transits Jupiter’s sign Pisces, a unique confluence of spirituality, justice, discipline, and introspection takes place.',
  'इस गोचर से मेष राशि पर साढ़ेसाती का प्रथम चरण प्रारंभ होता है, जबकि मकर राशि के जातकों को साढ़ेसाती से पूर्ण मुक्ति मिलती है। वृषभ, मिथुन, कर्क, तुला और मकर राशि के जातकों के लिए यह समय करियर में उन्नति, नए व्यापारिक अवसर और आर्थिक सुदृढ़ता लाने वाला है।':
    'With this transit, the first phase of Sade Sati begins for Aries, while Capricorn natives attain complete liberation from Sade Sati. For Taurus, Gemini, Cancer, Libra, and Capricorn natives, this period brings career advancement, new business opportunities, and financial stability.',
  'शनि कृपा प्राप्ति के लिए शनिवार के दिन पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं, हनुमान चालीसा का पाठ करें और असहाय व निर्धन व्यक्तियों की निस्वार्थ सेवा करें।':
    'To receive Lord Shani’s blessings, light a mustard oil lamp under a Peepal tree on Saturdays, recite the Hanuman Chalisa, and selflessly serve underprivileged people.',

  'कुंडली में राजयोग और धनयोग: कैसे पहचानें अपनी जन्मपत्रिका के शुभ योग':
    'Rajyoga & Dhanyoga in Kundli: How to Identify Auspicious Combinations in Your Birth Chart',
  'वैदिक ज्योतिष': 'Vedic Astrology',
  'डॉ. राघवेंद्र जोशी': 'Dr. Raghavendra Joshi',
  '५ मिनट': '5 Min Read',
  'गजकेसरी योग, पंच महापुरुष योग और लक्ष्मी-नारायण योग व्यक्ति को साधारण से असाधारण बना देते हैं। जानें ये योग कैसे बनते हैं।':
    'Gajakesari Yoga, Pancha Mahapurusha Yoga, and Lakshmi-Narayana Yoga elevate a person from ordinary to extraordinary. Learn how these auspicious Yogas are formed.',
  'लग्नादि केन्द्रगृहगाः शुभदाः ग्रहाः स्युः कोणाधिपाः यदि भवन्ति विशेषपूज्याः।':
    'Lagnadi Kendragrihagah Shubhadah Grahah Syuh Konadhipah Yadi Bhavanti Visheshapujyah.',
  'लग्न आदि केंद्र भावों में स्थित ग्रह शुभ फल देते हैं, और यदि वे त्रिकोण के स्वामियों से संबंध बनाएं तो परम राजयोग कारक होते हैं।':
    'Planets situated in the Kendra houses from the Ascendant yield auspicious results, and when they connect with the lords of Trikona houses, they form supreme Rajyogas.',
  'जन्म कुंडली में केंद्र भाव (१, ४, ७, १०) को भगवान विष्णु का स्थान और त्रिकोण भाव (१, ५, ९) को मां लक्ष्मी का स्थान कहा गया है। जब केंद्र और त्रिकोण के स्वामियों की युति, दृष्टि या राशि परिवर्तन होता है, तब पराशरी राजयोग का निर्माण होता है।':
    'In a birth chart, the Kendra houses (1, 4, 7, 10) are considered the seat of Lord Vishnu, and the Trikona houses (1, 5, 9) are the seat of Goddess Lakshmi. When the lords of Kendra and Trikona houses conjoin, aspect each other, or exchange signs, a Parashari Rajyoga is formed.',
  'इसी प्रकार जब बृहस्पति और चंद्रमा परस्पर केंद्र में हों तो गजकेसरी योग बनता है, जो व्यक्ति को समाज में उच्च प्रतिष्ठा, प्रखर बुद्धि और स्थायी ऐश्वर्य प्रदान करता है। द्वितीयेश और एकादशेश का संबंध प्रबल धनयोग का निर्माण करता है।':
    'Similarly, when Jupiter and the Moon are in mutual Kendra houses, Gajakesari Yoga is formed, granting high social prestige, sharp intellect, and lasting prosperity. The connection between the 2nd lord and 11th lord creates a powerful Dhanyoga (wealth combination).',

  // ============================================================================
  // 10. ANNUAL TYOHAR FESTIVALS (tyoharData.ts)
  // ============================================================================
  'प्रमुख त्योहार': 'Major Festivals',
  'एकादशी व्रत': 'Ekadashi Fasts',
  'प्रदोष एवं शिव व्रत': 'Pradosh & Shiva Fasts',
  'संकष्टी एवं चतुर्थी': 'Sankashti & Chaturthi',
  'पूर्णिमा एवं अमावस्या': 'Purnima & Amavasya',
  'संक्रांति एवं पर्व': 'Sankranti & Parva',
  'धनु से मकर राशि प्रवेश': 'Entry from Sagittarius to Capricorn',
  'रबी की नई फसल और सूर्य की उत्तरायण यात्रा के स्वागत का पावन अग्नि पर्व।':
    'Sacred bonfire festival welcoming the new Rabi harvest and the Sun’s northward journey (Uttarayan).',
  'सूर्य देव के मकर राशि में प्रवेश (उत्तरायण) का महापर्व; पवित्र नदियों में स्नान और तिल-गुड़ का दान।':
    'Great festival marking the Sun’s entry into Capricorn (Uttarayan); sacred river baths and donation of sesame and jaggery.',
  'सूर्य देव, प्रकृति और गौ-धन के प्रति कृतज्ञता व्यक्त करने वाला चार दिवसीय दक्षिण भारतीय महापर्व।':
    'Four-day South Indian harvest festival expressing gratitude to the Sun God, nature, and cattle.',
  'संगम और पवित्र नदियों में कल्पवास, मौन साधना और ब्रह्म मुहूर्त स्नान का विशेष पर्व।':
    'Sacred occasion of Kalpavas, silent meditation (Maun Sadhana), and Brahma Muhurat bathing at the Sangam and holy rivers.',
  'विद्या, संगीत और कला की अधिष्ठात्री देवी माँ सरस्वती के प्राकट्य का पावन बसंतोत्सव।':
    'Auspicious spring festival celebrating the manifestation of Goddess Saraswati, deity of wisdom, music, and arts.',
  'भगवान सूर्य के रथ सप्तमी जन्मदिवस के रूप में मनाई जाने वाली आरोग्य व तेज की सप्तमी।':
    'Celebrated as the birth anniversary of Lord Surya on Ratha Saptami, bestowing good health and vitality.',
  'जया एकादशी के व्रत से मनुष्य को भूत-प्रेत योनि और अज्ञान के बंधन से मुक्ति मिलती है।':
    'Observing the Jaya Ekadashi fast liberates a person from lower realms and the bondage of ignorance.',
  'माघ स्नान का समापन, सत्यनारायण कथा, दान-पुण्य और संत रविदास जी की पावन जयंती।':
    'Culmination of Magh Snan, Satyanarayan Katha, charity, and the sacred birth anniversary of Sant Ravidas Ji.',
  'विघ्नहर्ता भगवान गणेश की कृपा और संतान की कुशलता के लिए किया जाने वाला चंद्रोदय व्रत।':
    'Moonrise fast observed for the blessings of obstacle-remover Lord Ganesha and the well-being of children.',
  'भगवान राम द्वारा लंका विजय हेतु समुद्र तट पर रखे गए इस एकादशी व्रत से निश्चित विजय प्राप्त होती है।':
    'Observed by Lord Rama on the ocean shore for victory over Lanka, this Ekadashi fast grants assured success.',
  'देवाधिदेव महादेव और माता पार्वती के मिलन की महानिशा; चार प्रहर के रुद्राभिषेक का महापर्व।':
    'The Great Night of the union of Lord Shiva and Goddess Parvati; grand festival of four-Prahar Rudrabhishek.',
  'काशी में बाबा विश्वनाथ का गुलाल और भस्म से शृंगार तथा भगवान विष्णु को आंवला अर्पित करने की एकादशी।':
    'Ekadashi of adorning Baba Vishwanath with Gulal and sacred ash in Kashi and offering Amla to Lord Vishnu.',
  'भक्त प्रह्लाद की रक्षा और अधर्म व अहंकार रूपी होलिका के दहन का पावन पर्व।':
    'Sacred festival commemorating the protection of devotee Prahlada and the burning of Holika, symbolizing the defeat of ego and unrighteousness.',
  'रंग, उमंग, प्रेम और सामाजिक समरसता का महापर्व धुलेंडी तथा चैतन्य महाप्रभु जयंती।':
    'Grand festival of colors, joy, love, and social harmony (Dhulandi) along with Chaitanya Mahaprabhu Jayanti.',
  'शीतला माता को ठंडे व्यंजनों (बासौड़ा) का भोग लगाकर आरोग्य और शीतलता की प्रार्थना का पर्व।':
    'Festival of offering cooled delicacies (Basoda) to Goddess Sheetala and praying for good health and peace.',
  'पापमोचनी एकादशी के व्रत से जाने-अनजाने में हुए समस्त पापों का क्षय होता है।':
    'Observing the Papamochani Ekadashi fast destroys all sins committed knowingly or unknowingly.',
  'ब्रह्मा जी द्वारा सृष्टि रचना का प्रथम दिवस, विक्रम संवत का शुभारंभ और माँ दुर्गा की घटस्थापना।':
    'First day of creation by Lord Brahma, commencement of Vikram Samvat, and Ghatasthapana of Goddess Durga.',
  'सौभाग्यवती स्त्रियों द्वारा अखंड सुहाग और कुंवारी कन्याओं द्वारा उत्तम वर हेतु शिव-गौरी पूजन।':
    'Worship of Lord Shiva and Goddess Gauri by married women for marital longevity and by unmarried girls for an ideal spouse.',
  'मर्यादा पुरुषोत्तम प्रभु श्री राम का जन्मोत्सव और नवरात्रि की सिद्धिदात्री आराधना व कन्या पूजन।':
    'Birth anniversary of Maryada Purushottama Lord Shri Rama, worship of Goddess Siddhidatri, and Kanya Pujan.',
  'मनोवांछित फल प्रदान करने वाली और समस्त सांसारिक कष्टों को हरने वाली चैत्र शुक्ल एकादशी।':
    'Chaitra Shukla Ekadashi that fulfills heartfelt desires and removes all worldly sufferings.',
  'संकटमोचन पवनपुत्र श्री हनुमान जी के प्राकट्योत्सव पर सिंदूर चोला और सुंदरकांड पाठ का महापर्व।':
    'Grand festival of offering vermilion Chola and reciting Sundarkand on the birth anniversary of Sankatmochan Lord Hanuman.',
  'वरूथिनी एकादशी का व्रत दस हजार वर्ष की तपस्या के समान पुण्य प्रदान करने वाला माना गया है।':
    'The Varuthini Ekadashi fast is revered as bestowing spiritual merit equal to ten thousand years of penance.',
  'अनंत पुण्यदायी अबूझ महामुहूर्त, भगवान परशुराम का प्राकट्य और बद्रीनाथ धाम के कपाट खुलने का दिन।':
    'Eternally meritorious self-auspicious day (Abujh Muhurat), manifestation of Lord Parashurama, and opening of Badrinath Dham portals.',
  'भगवान विष्णु के मोहिनी अवतार का स्मरण दिवस; मोह-माया के बंधन से मुक्ति दिलाने वाली एकादशी।':
    'Commemoration day of Lord Vishnu’s Mohini incarnation; an Ekadashi that liberates from the illusions of attachment.',
  'अधर्म के नाश और भक्त प्रह्लाद की रक्षा हेतु खंभे से भगवान नृसिंह के उग्र प्राकट्य की संध्या।':
    'Evening commemorating the fierce manifestation of Lord Narasimha from a pillar to destroy unrighteousness and protect devotee Prahlada.',
  'भगवान बुद्ध का जन्म, ज्ञान प्राप्ति एवं महापरिनिर्वाण दिवस तथा वैशाख स्नान का पूर्णिमा पर्व।':
    'Day of birth, enlightenment, and Mahaparinirvana of Lord Buddha, and the sacred Purnima of Vaishakh Snan.',
  'अपरा एकादशी का व्रत अपार धन, यश और कीर्ति प्रदान करने वाला तथा पापों को धोने वाला है।':
    'Observing the Apara Ekadashi fast bestows immense wealth, fame, and glory, and washes away sins.',
  'पतिव्रता सावित्री द्वारा यमराज से पति के प्राण वापस लाने की स्मृति और न्याय के देवता शनि देव का जन्मोत्सव।':
    'Commemoration of devoted Savitri reclaiming her husband’s life from Yama, and the birth anniversary of Lord Shani, God of Justice.',
  'माँ गंगा के स्वर्ग से पृथ्वी पर अवतरण का पावन पर्व; गंगा स्नान से दस प्रकार के पापों का नाश।':
    'Sacred festival marking Goddess Ganga’s descent from heaven to earth; bathing in the Ganga destroys ten types of sins.',
  'भीमसेन एकादशी; बिना जल ग्रहण किए रखा जाने वाला यह व्रत वर्ष भर की २४ एकादशियों का फल देता है।':
    'Bhimseni Ekadashi; observed without water, this fast grants the spiritual merit of all 24 Ekadashis of the year.',
  'वट वृक्ष का पूजन और कबीर दास जी की जयंती का पावन पर्व।':
    'Sacred festival of worshipping the Banyan tree (Vat Vriksha) and celebrating the birth anniversary of Sant Kabir Das Ji.',
  'योगिनी एकादशी का व्रत अट्ठासी हजार ब्राह्मणों को भोजन कराने के समान पुण्यदायी और रोगनाशक है।':
    'The Yogini Ekadashi fast is disease-destroying and as meritorious as feeding eighty-eight thousand Brahmins.',
  'भगवान जगन्नाथ, भाई बलभद्र और बहन सुभद्रा की विश्वप्रसिद्ध रथ यात्रा का भव्य शुभारंभ।':
    'Grand commencement of the world-famous chariot festival (Rath Yatra) of Lord Jagannath, Brother Balabhadra, and Sister Subhadra.',
  'भगवान विष्णु के चार माह के लिए क्षीरसागर में योगनिद्रा में जाने का पर्व और चातुर्मास का प्रारंभ।':
    'Festival marking Lord Vishnu entering cosmic sleep (Yoganidra) in the Ksheera Sagara for four months, and the start of Chaturmas.',
  'महर्षि वेदव्यास जी की जयंती और जीवन में अज्ञान का अंधकार मिटाने वाले गुरुजनों के पूजन का महापर्व।':
    'Birth anniversary of Maharishi Vedavyasa and the grand festival of worshipping spiritual teachers (Gurus) who dispel the darkness of ignorance.',
  'पवित्र श्रावण मास के सोमवार और मंगलवार व्रत; शिवजी को बेलपत्र-जलाभिषेक और माँ पार्वती की उपासना।':
    'Sacred Mondays and Tuesdays of Shravan month; offering Belpatra and water Abhishek to Lord Shiva and worshipping Goddess Parvati.',
  'चातुर्मास की प्रथम एकादशी; भगवान विष्णु और तुलसी जी के पूजन से समस्त कामनाओं की पूर्ति।':
    'First Ekadashi of Chaturmas; worshipping Lord Vishnu and Tulsi Ji fulfills all noble desires.',
  'प्रकृति, हरियाली और शिव-पार्वती के पुनर्मिलन का उत्सव; सुहागिनों द्वारा सिंजारा और झूला उत्सव।':
    'Celebration of nature, greenery, and the reunion of Shiva and Parvati; observed by women with Sinjara and swings.',
  'नाग देवता का पूजन, दूध व लावा अर्पण तथा कुंडली के कालसर्प व राहु-केतु दोष की शांति का पर्व।':
    'Worship of Serpent Deities (Naga Devata), offering milk and puffed rice, and pacifying Kaal Sarp and Rahu-Ketu Doshas.',
  'भाई-बहन के अटूट स्नेह का पर्व रक्षाबंधन और वैदिक ब्राह्मणों द्वारा यज्ञोपवीत (जनेऊ) परिवर्तन का उपाकर्म।':
    'Raksha Bandhan celebrating the unbreakable bond between brother and sister, and Shravani Upakarma for renewing the sacred thread (Yajnopavita).',
  'अखंड सौभाग्य की प्राप्ति हेतु सुहागिन स्त्रियों द्वारा सत्तू भोग और रात्रि में चंद्रोदय अर्घ्य का व्रत।':
    'Fast observed by married women with Sattu offerings and moonrise Arghya for everlasting marital bliss.',
  'रोहिणी नक्षत्र और अष्टमी की मध्यरात्रि में भगवान श्रीकृष्ण के सोलह कलाओं सहित दिव्य जन्मोत्सव का महापर्व।':
    'Grand midnight festival celebrating the divine birth of Lord Shri Krishna with all sixteen celestial attributes under Rohini Nakshatra and Ashtami.',
  'मिट्टी से बने पार्थिव शिवलिंग व हरितालिका पूजन का निर्जला व्रत; अखंड सुहाग और उत्तम वर की प्राप्ति।':
    'Waterless fast worshipping clay Parthiv Shivalinga and Hartalika; bestows unbroken marital fortune and an ideal spouse.',
  'प्रथम पूज्य भगवान श्री गणेश की दस दिवसीय प्रतिमा स्थापना और गणेशोत्सव का भव्य शुभारंभ।':
    'Grand commencement of the ten-day Ganeshotsav and installation of idols of foremost-worshipped Lord Shri Ganesha.',
  'सप्तर्षियों के पूजन और जाने-अंजाने में हुए रजस्वला या स्पर्श दोषों के प्रायश्चित का पावन व्रत।':
    'Sacred fast dedicated to worshipping the Saptarishis (Seven Sages) and seeking purification and atonement.',
  'भगवान विष्णु के करवट बदलने की एकादशी और ढोल-ग्यारस का पावन उत्सव।':
    'Ekadashi marking Lord Vishnu turning on His side during cosmic sleep, celebrated joyously as Dol Gyaras.',
  'भगवान विष्णु के चौदह गांठों वाले अनंत सूत्र का पूजन और गणपति बप्पा का सजल नेत्रों से विसर्जन।':
    'Worship of Lord Vishnu’s fourteen-knotted Ananta sacred thread and the emotional immersion (Visarjan) of Ganapati Bappa.',
  'पूर्वजों और पितरों के प्रति श्रद्धा प्रकट करने, तर्पण, पिंडदान और ब्राह्मण भोजन के सोलह श्राद्ध दिवस।':
    'Sixteen sacred Shraddha days dedicated to expressing reverence to ancestors through Tarpan, Pind Daan, and feeding Brahmins.',
  'माँ दुर्गा के नौ स्वरूपों की आराधना, अखंड ज्योति, गरबा और शक्ति साधना के नौ पावन दिवस।':
    'Nine sacred days of worshipping the nine forms of Goddess Durga, lighting the Akhand Jyoti, Garba, and Shakti Sadhana.',
  'असत्य पर सत्य की विजय, भगवान राम द्वारा रावण वध, शस्त्र पूजन और शमी वृक्ष पूजन का महापर्व।':
    'Grand festival celebrating the victory of truth over falsehood, Lord Rama’s victory over Ravana, weapon worship, and Shami tree worship.',
  'शरद ऋतु की धवल चांदनी में अमृत वर्षा करने वाली पूर्णिमा; भगवान को खीर अर्पित करने और महालक्ष्मी जागरण की रात्रि।':
    'Full moon night of autumn showering divine nectar; night of offering Kheer under the moonlight and keeping vigil for Goddess Mahalakshmi.',
  'पति की दीर्घायु और कुशलता के लिए सुहागिन स्त्रियों द्वारा निर्जला व्रत रखकर छलनी से चंद्र दर्शन व अर्घ्य।':
    'Waterless fast observed by married women for their husband’s longevity and well-being, culminating in viewing the Moon through a sieve and offering Arghya.',
  'भगवान धन्वंतरि के प्राकट्य, आरोग्य, कुबेर पूजन और नए बर्तन व स्वर्ण-रजत खरीदने का शुभ पर्व।':
    'Auspicious festival celebrating the manifestation of Lord Dhanvantari, good health, Kuber worship, and purchasing utensils, gold, and silver.',
  'अंधकार पर प्रकाश की विजय का महापर्व; भगवान राम का अयोध्या आगमन और गणेश-लक्ष्मी महापूजन।':
    'Grand festival of the victory of light over darkness; Lord Rama’s return to Ayodhya and the great worship of Lord Ganesha and Goddess Lakshmi.',
  'प्रकृति और गौ-धन के संवर्धन हेतु गोवर्धन पूजा तथा मंदिरों में भगवान को छप्पन भोग (अन्नकूट) अर्पण।':
    'Govardhan Puja for the preservation of nature and cattle, along with offering Chhappan Bhog (Annakoot) to the deity in temples.',
  'यमुना जी द्वारा भाई यमराज के सत्कार की स्मृति में बहनों द्वारा भाई को तिलक और चित्रगुप्त पूजन।':
    'Sisters applying Tilak to their brothers in memory of Yamuna Ji welcoming her brother Yama, along with Lord Chitragupta worship.',
  'प्रत्यक्ष देवता भगवान भास्कर और छठी मैया की उपासना; अस्त और उदित होते सूर्य को जल में खड़े होकर अर्घ्य।':
    'Worship of the visible Sun God (Lord Bhaskar) and Chhठी Maiya; offering Arghya while standing in water to the setting and rising Sun.',
  'भगवान विष्णु का चार माह की योगनिद्रा से जागरण, तुलसी-शालिग्राम विवाह और मांगलिक कार्यों का पुनः प्रारंभ।':
    'Awakening of Lord Vishnu from four months of cosmic sleep, Tulsi-Shaligram Vivah, and the resumption of auspicious ceremonies.',
  'भगवान शिव द्वारा त्रिपुरासुर वध पर देवताओं की दीपावली (देव दीपावली), कार्तिक स्नान समापन और गुरु नानक जयंती।':
    'Festival of lights of the Gods (Dev Deepawali) celebrating Lord Shiva’s victory over Tripurasura, culmination of Kartik Snan, and Guru Nanak Jayanti.',
  'कुरुक्षेत्र में भगवान श्रीकृष्ण द्वारा अर्जुन को श्रीमद्भगवद्गीता का अमर उपदेश देने का पावन दिवस और मोक्षदा एकादशी।':
    'Sacred day when Lord Shri Krishna imparted the immortal wisdom of the Shrimad Bhagavad Gita to Arjuna at Kurukshetra, along with Mokshada Ekadashi.',

  // ============================================================================
  // 11. NOTIFICATIONS (App.tsx) & COMMON DYNAMIC UI TEXTS
  // ============================================================================
  'आज का शुभ अभिजीत मुहूर्त': 'Today’s Auspicious Abhijit Muhurat',
  'आज दोपहर 11:58 से 12:48 तक अभिजीत मुहूर्त रहेगा। नए कार्यों के लिए अत्यंत श्रेष्ठ समय।':
    'Today Abhijit Muhurat will remain from 11:58 AM to 12:48 PM. Highly auspicious time for starting new endeavors.',
  '10 मिनट पहले': '10 mins ago',
  'मेष एवं वृषभ: विशेष दैनिक राशिफल': 'Aries & Taurus: Special Daily Horoscope',
  'चंद्रमा के शुभ गोचर से आज धन लाभ और कार्यक्षेत्र में उन्नति के प्रबल योग बन रहे हैं।':
    'Due to the auspicious transit of the Moon, strong indications of financial gain and career progress are forming today.',
  '1 घंटे पहले': '1 hour ago',
  'गुरु गोचर अपडेट: बृहस्पति का प्रभाव': 'Jupiter Transit Update: Impact of Brihaspati',
  'देवगुरु बृहस्पति की शुभ दृष्टि से शिक्षा, विवाह और व्यापार में सकारात्मक बदलाव के संकेत।':
    'With the auspicious aspect of Devaguru Brihaspati, positive developments are indicated in education, marriage, and business.',
  '3 घंटे पहले': '3 hours ago',
  'आगामी एकादशी व्रत अनुस्मारक': 'Upcoming Ekadashi Fast Reminder',
  'एकादशी व्रत के नियम, पारण समय और भगवान विष्णु की विशेष पूजा विधि पंचांग में देखें।':
    'Check the rules of Ekadashi fast, Parana timing, and special worship method of Lord Vishnu in the Panchang.',
  'कल': 'Yesterday',

  // ============================================================================
  // 12. CALCULATORS VIEW & ASTROLOGY ENGINE (CalculatorsView.tsx, calculatorService.ts, astrologyEngine.ts)
  // ============================================================================
  'मूंगा': 'Red Coral (Moonga)',
  'तांबा या सोना': 'Copper or Gold',
  'अनामिका': 'Ring Finger',
  'हीरा या ओपल': 'Diamond or Opal',
  'चांदी या प्लैटिनम': 'Silver or Platinum',
  'मध्यमा': 'Middle Finger',
  'पन्ना': 'Emerald (Panna)',
  'सोना या चांदी': 'Gold or Silver',
  'कनिष्ठिका': 'Little Finger',
  'मोती': 'Pearl (Moti)',
  'चांदी': 'Silver',
  'माणिक्य': 'Ruby (Manikya)',
  'सोना या तांबा': 'Gold or Copper',
  'सोना': 'Gold',
  'ओपल या हीरा': 'Opal or Diamond',
  'लाल मूंगा': 'Red Coral',
  'पुखराज': 'Yellow Sapphire (Pukhraj)',
  'तर्जनी': 'Index Finger',
  'नीलम': 'Blue Sapphire (Neelam)',
  'पंचधातु या चांदी': 'Panchadhatu or Silver',
  'नीलम या लाजवर्त': 'Blue Sapphire or Lapis Lazuli',
  'पंचधातु': 'Panchadhatu',
  'पीला पुखराज': 'Yellow Sapphire',

  'नेतृत्व क्षमता, आत्मविश्वासी, महत्वाकांक्षी एवं स्वतंत्र विचार।':
    'Strong leadership, confident, ambitious, and independent thinker.',
  'प्रशासन, राजनीति, प्रबंधन एवं उच्च पद':
    'Administration, Politics, Management & High Positions',
  'भावुक, कल्पनाशील, सहयोगी एवं शांतिप्रिय व्यक्तित्व।':
    'Emotional, imaginative, cooperative, and peace-loving personality.',
  'कला, लेखन, चिकित्सा, परामर्श एवं जल क्षेत्र':
    'Arts, Writing, Medicine, Consulting & Water Sector',
  'ज्ञानी, अनुशासित, आध्यात्मिक एवं उच्च आदर्शों वाले।':
    'Knowledgeable, disciplined, spiritual, and possessing high ideals.',
  'शिक्षा, न्यायपालिका, बैंकिंग एवं धर्म गुरु':
    'Education, Judiciary, Banking & Spiritual Guidance',
  'व्यावहारिक, क्रांतिकारी विचार, मेहनती एवं तकनीकी दक्षता।':
    'Practical, innovative thinker, hardworking, and technically skilled.',
  'इंजीनियरिंग, आईटी, शोध एवं मीडिया':
    'Engineering, IT, Research & Media',
  'तीव्र बुद्धि, वाक्पटु, व्यापार कुशल एवं बहुमुखी प्रतिभा।':
    'Sharp intellect, eloquent, business-savvy, and versatile talent.',
  'व्यापार, वाणिज्य, पत्रकारिता एवं संचार':
    'Business, Commerce, Journalism & Communications',
  'आकर्षक, कला प्रेमी, सौंदर्यप्रिय एवं वैभवशाली जीवन।':
    'Charming, art-loving, aesthetically inclined, and prosperous lifestyle.',
  'फैशन, फिल्म, होटल, आभूषण एवं कला':
    'Fashion, Film, Hospitality, Jewelry & Arts',
  'दार्शनिक, अंतर्मुखी, रहस्यमयी विद्याओं के ज्ञाता एवं शोधकर्ता।':
    'Philosophical, introspective, knower of esoteric sciences, and researcher.',
  'ज्योतिष, अध्यात्म, अनुसंधान एवं लेखन':
    'Astrology, Spirituality, Research & Writing',
  'न्यायप्रिय, धैर्यवान, कर्मठ एवं संघर्ष से शिखर तक पहुंचने वाले।':
    'Justice-loving, patient, hardworking, and rising to the top through perseverance.',
  'उद्योग, खनिज, कानून, रियल एस्टेट':
    'Industry, Minerals, Law & Real Estate',
  'साहसी, ऊर्जावान, निडर एवं परोपकारी स्वभाव।':
    'Courageous, energetic, fearless, and philanthropic nature.',
  'सेना, पुलिस, खेलकूद, चिकित्सा एवं प्रशासन':
    'Defense, Police, Sports, Medicine & Administration',

  'अंतिम चरण (उतरती साढ़ेसाती)': 'Final Phase (Setting Sade Sati)',
  'शनि वर्तमान में मीन राशि में गोचर कर रहे हैं। कुंभ राशि के जातकों पर साढ़ेसाती का तीसरा और अंतिम चरण चल रहा है। परिश्रम का शुभ फल मिलेगा।':
    'Saturn is currently transiting Pisces. Aquarius natives are in the third and final phase of Sade Sati. Hard work will yield auspicious rewards.',
  'प्रत्येक शनिवार पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और हनुमान चालीसा का पाठ करें।':
    'Light a mustard oil lamp under a Peepal tree every Saturday and recite the Hanuman Chalisa.',
  'द्वितीय चरण (शिखर चरण)': 'Second Phase (Peak Sade Sati)',
  'शनि आपकी चंद्र राशि मीन में गोचर कर रहे हैं। यह साढ़ेसाती का मध्य चरण है। स्वास्थ्य एवं मानसिक शांति पर विशेष ध्यान दें और धैर्य रखें।':
    'Saturn is transiting your Moon sign Pisces. This is the middle peak phase of Sade Sati. Pay special attention to health and mental peace, and maintain patience.',
  'शनिवार को छाया दान करें और "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः" मंत्र का 108 बार जाप करें।':
    'Perform Chhaya Daan on Saturdays and chant "Om Pram Preem Praum Sah Shanaishcharaya Namah" 108 times.',
  'प्रथम चरण (चढ़ती साढ़ेसाती)': 'First Phase (Rising Sade Sati)',
  'मेष राशि के जातकों पर शनि की साढ़ेसाती का प्रथम चरण प्रारंभ हो चुका है। अनावश्यक खर्चों पर नियंत्रण रखें एवं सोच-समझकर निर्णय लें।':
    'The first phase of Shani Sade Sati has begun for Aries natives. Keep unnecessary expenses under control and make thoughtful decisions.',
  'भगवान शिव का जलाभिषेक करें और शनिवार को गरीबों को काले तिल या अन्न का दान करें।':
    'Perform Jalabhishek of Lord Shiva and donate black sesame seeds or food grains to the needy on Saturdays.',
  'शनि ढैय्या (लघु कल्याणी ढैय्या)': 'Shani Dhaiyya (Small Panoti)',
  'मंगलवार और शनिवार को सुंदरकांड का पाठ करें।':
    'Recite the Sundarkand on Tuesdays and Saturdays.',
  'साढ़ेसाती / ढैय्या से मुक्त': 'Free from Sade Sati / Dhaiyya',
  'नियमित रूप से अपने इष्ट देव की आराधना जारी रखें।':
    'Continue worshipping your presiding deity (Ishta Devata) regularly.',
  'रत्न परामर्श, अंक ज्योतिष एवं शनि साढ़ेसाती जांच':
    'Gemstone Consultation, Numerology & Shani Sade Sati Check',

  // Guna Milan Dosha & Koota Descriptions
  'वर और कन्या का वर्ण अनुकूल है।': 'The Varna compatibility of the groom and bride is favorable.',
  'वर्ण में सामान्य गुण प्राप्त।': 'Moderate compatibility obtained in Varna Koota.',
  'आपसी आकर्षण और वैवाहिक समन्वय का फल।': 'Indicates mutual attraction and marital harmony.',
  'तारा मिलान शुभ एवं अनुकूल है।': 'Tara matching is auspicious and favorable.',
  'तारा मध्यम प्रभाव वाली है।': 'Tara matching shows moderate influence.',
  'योनि अनुकूल होने से दांपत्य प्रेम प्रगाढ़ रहेगा।': 'Favorable Yoni ensures deep marital affection.',
  'योनि विरोध परिहार योग्य है।': 'Yoni incompatibility is remediable.',
  'गण मिलान से स्वभाव व विचारों में सामंजस्य रहेगा।': 'Gana matching ensures harmony in temperament and thoughts.',
  'गण भिन्नता के कारण सामान्य प्रभाव।': 'Moderate influence due to difference in Gana.',
  'दोनों कुंडलियों में मांगलिक स्थिति का पूर्ण सामंजस्य है।': 'Both horoscopes have complete harmony regarding Manglik status.',
  'वर और कन्या दोनों की कुंडली मांगलिक दोष से मुक्त है।': 'Both the groom and bride’s horoscopes are free from Manglik Dosha.',
  'वर और कन्या दोनों मांगलिक हैं, इसलिए दोनों का मांगलिक दोष आपस में कट (समाप्त हो) रहा है।':
    'Both the groom and bride are Manglik, so their Manglik Dosha mutually cancels out.',
  'वर और कन्या दोनों की कुंडली में मंगल दोष है, जो आपस में मिलकर कट रहा है।':
    'Both charts have Mangal Dosha, which mutually neutralizes each other.',
  'जब वर और कन्या दोनों मांगलिक होते हैं, तो मांगलिक दोष स्वतः समाप्त हो जाता है।':
    'When both the groom and bride are Manglik, the Manglik Dosha is automatically cancelled.'
};

const HINDI_MONTH_MAP: Record<string, string> = {
  'जनवरी': 'January',
  'फरवरी': 'February',
  'मार्च': 'March',
  'अप्रैल': 'April',
  'मई': 'May',
  'जून': 'June',
  'जुलाई': 'July',
  'अगस्त': 'August',
  'सितंबर': 'September',
  'अक्टूबर': 'October',
  'नवंबर': 'November',
  'दिसंबर': 'December'
};

/**
 * Translates parameterized/dynamic Hindi strings (such as Monthly/Yearly Horoscope templates,
 * Tyohar Detailed Sections, Kundli/Milan Dosha explanations, Dasha balances, and dates)
 * into clean, natural English.
 */
export function translateDynamicHindiPatternsToEnglish(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return input;

  // 1. Exact Lookup
  if (EXACT_HI_TO_EN_MAP[trimmed]) {
    return input.replace(trimmed, EXACT_HI_TO_EN_MAP[trimmed]);
  }

  // 2. Monthly Horoscope Templates (horoscopeService.ts)
  // General: `${monthLabel} मास ${data.hindiName} राशि के जातकों के लिए प्रगति और सकारात्मक परिवर्तनों से भरा रहेगा। ${data.general} मास के उत्तरार्ध में धार्मिक यात्रा या मांगलिक कार्य के प्रबल योग हैं।`
  const monthlyGenMatch = trimmed.match(
    /^(.+?) मास (.+?) राशि के जातकों के लिए प्रगति और सकारात्मक परिवर्तनों से भरा रहेगा। (.+?) मास के उत्तरार्ध में धार्मिक यात्रा या मांगलिक कार्य के प्रबल योग हैं।$/
  );
  if (monthlyGenMatch) {
    const [, monthLbl, signName, dailyGen] = monthlyGenMatch;
    const enSign = translateSimpleTerm(signName);
    const enDailyGen = EXACT_HI_TO_EN_MAP[dailyGen.trim()] || dailyGen;
    return `The month of ${translateDateText(monthLbl)} will be filled with progress and positive transformations for ${enSign} natives. ${enDailyGen} In the second half of the month, there are strong prospects of a spiritual journey or an auspicious family ceremony.`;
  }

  // Monthly Career: `इस माह कार्यक्षेत्र में आपकी प्रतिष्ठा बढ़ेगी। ${data.career} माह के दूसरे और तीसरे सप्ताह में नई व्यावसायिक साझेदारी या पदोन्नति के अवसर प्राप्त होंगे।`
  const monthlyCarMatch = trimmed.match(
    /^इस माह कार्यक्षेत्र में आपकी प्रतिष्ठा बढ़ेगी। (.+?) माह के दूसरे और तीसरे सप्ताह में नई व्यावसायिक साझेदारी या पदोन्नति के अवसर प्राप्त होंगे।$/
  );
  if (monthlyCarMatch) {
    const [, dailyCar] = monthlyCarMatch;
    const enDailyCar = EXACT_HI_TO_EN_MAP[dailyCar.trim()] || dailyCar;
    return `Your prestige in the workplace will grow this month. ${enDailyCar} Opportunities for new business partnerships or promotion will arise in the second and third weeks of the month.`;
  }

  // Monthly Love: `${data.love} परिवार के वरिष्ठ सदस्यों का मार्गदर्शन और स्नेह प्राप्त होगा। अविवाहित जातकों के लिए शुभ रिश्ते आने का योग है।`
  const monthlyLoveMatch = trimmed.match(
    /^(.+?) परिवार के वरिष्ठ सदस्यों का मार्गदर्शन और स्नेह प्राप्त होगा। अविवाहित जातकों के लिए शुभ रिश्ते आने का योग है।$/
  );
  if (monthlyLoveMatch) {
    const [, dailyLove] = monthlyLoveMatch;
    const enDailyLove = EXACT_HI_TO_EN_MAP[dailyLove.trim()] || dailyLove;
    return `${enDailyLove} You will receive guidance and affection from senior family members. Auspicious marriage proposals are indicated for unmarried individuals.`;
  }

  // Monthly Health: `${data.health} ऋतु परिवर्तन के प्रति सजग रहें तथा नियमित योग और प्राणायाम को दिनचर्या में शामिल करें।`
  const monthlyHealthMatch = trimmed.match(
    /^(.+?) ऋतु परिवर्तन के प्रति सजग रहें तथा नियमित योग और प्राणायाम को दिनचर्या में शामिल करें।$/
  );
  if (monthlyHealthMatch) {
    const [, dailyHealth] = monthlyHealthMatch;
    const enDailyHealth = EXACT_HI_TO_EN_MAP[dailyHealth.trim()] || dailyHealth;
    return `${enDailyHealth} Stay mindful of seasonal changes and include regular Yoga and Pranayama in your daily routine.`;
  }

  // Monthly Finance: `मासिक आर्थिक स्थिति सुदृढ़ रहेगी। ${data.finance} भूमि, भवन या स्वर्ण में दीर्घकालिक निवेश फलदायी सिद्ध होगा।`
  const monthlyFinMatch = trimmed.match(
    /^मासिक आर्थिक स्थिति सुदृढ़ रहेगी। (.+?) भूमि, भवन या स्वर्ण में दीर्घकालिक निवेश फलदायी सिद्ध होगा।$/
  );
  if (monthlyFinMatch) {
    const [, dailyFin] = monthlyFinMatch;
    const enDailyFin = EXACT_HI_TO_EN_MAP[dailyFin.trim()] || dailyFin;
    return `Your monthly financial position will remain strong. ${enDailyFin} Long-term investments in land, property, or gold will prove rewarding.`;
  }

  // Monthly Lucky Time: `शुक्ल पक्ष की तिथियां एवं ${data.luckyTime}`
  const monthlyTimeMatch = trimmed.match(/^शुक्ल पक्ष की तिथियां एवं (.+)$/);
  if (monthlyTimeMatch) {
    const [, lt] = monthlyTimeMatch;
    const enLt = EXACT_HI_TO_EN_MAP[lt.trim()] || lt;
    return `Shukla Paksha dates & ${enLt}`;
  }

  // Monthly Remedy: `${data.remedy} साथ ही प्रत्येक पूर्णिमा और एकादशी को सात्विक दान करें।`
  const monthlyRemMatch = trimmed.match(/^(.+?) साथ ही प्रत्येक पूर्णिमा और एकादशी को सात्विक दान करें।$/);
  if (monthlyRemMatch) {
    const [, dailyRem] = monthlyRemMatch;
    const enDailyRem = EXACT_HI_TO_EN_MAP[dailyRem.trim()] || dailyRem;
    return `${enDailyRem} Also perform charitable giving on every Purnima and Ekadashi.`;
  }

  // 3. Yearly Horoscope Templates (horoscopeService.ts)
  const yearlyGenMatch = trimmed.match(
    /^वर्ष (\d+) \(विक्रम संवत (\d+)\) (.+?) राशि के जातकों के लिए नई उपलब्धियों, आत्मिक उन्नति और आर्थिक विस्तार का वर्ष रहेगा। बृहस्पति और शनि के गोचर के प्रभाव से आपके दीर्घकालिक लक्ष्य पूर्ण होंगे।$/
  );
  if (yearlyGenMatch) {
    const [, yr, samvat, signName] = yearlyGenMatch;
    return `The year ${yr} (Vikram Samvat ${samvat}) will be a year of new achievements, spiritual growth, and financial expansion for ${translateSimpleTerm(signName)} natives. Under the influence of Jupiter and Saturn’s transits, your long-term goals will be fulfilled.`;
  }

  const yearlyCarMatch = trimmed.match(
    /^वर्ष (\d+) में करियर और व्यवसाय में बड़े सकारात्मक बदलाव आएंगे। (.+?) अप्रैल से अक्टूबर के मध्य पदोन्नति और व्यापार विस्तार के प्रबल योग हैं।$/
  );
  if (yearlyCarMatch) {
    const [, yr, dailyCar] = yearlyCarMatch;
    const enDailyCar = EXACT_HI_TO_EN_MAP[dailyCar.trim()] || dailyCar;
    return `Major positive developments will occur in career and business in ${yr}. ${enDailyCar} Strong prospects of promotion and business expansion are indicated between April and October.`;
  }

  const yearlyLoveMatch = trimmed.match(
    /^पारिवारिक और दांपत्य जीवन के लिए यह वर्ष अत्यंत सुखद रहेगा। (.+?) घर में मांगलिक उत्सव और संतान की उन्नति से हर्ष का वातावरण रहेगा।$/
  );
  if (yearlyLoveMatch) {
    const [, dailyLove] = yearlyLoveMatch;
    const enDailyLove = EXACT_HI_TO_EN_MAP[dailyLove.trim()] || dailyLove;
    return `This year will be deeply harmonious for family and married life. ${enDailyLove} Auspicious celebrations at home and your children’s progress will create a joyful atmosphere.`;
  }

  const yearlyHealthMatch = trimmed.match(
    /^वर्ष भर स्वास्थ्य सामान्यतः उत्तम रहेगा। (.+?) संतुलित आहार, ध्यान और समय पर स्वास्थ्य परीक्षण से आप पूर्णतः ऊर्जावान बने रहेंगे।$/
  );
  if (yearlyHealthMatch) {
    const [, dailyHealth] = yearlyHealthMatch;
    const enDailyHealth = EXACT_HI_TO_EN_MAP[dailyHealth.trim()] || dailyHealth;
    return `Health will generally remain good throughout the year. ${enDailyHealth} With a balanced diet, meditation, and timely checkups, you will stay energetic.`;
  }

  const yearlyFinMatch = trimmed.match(
    /^आर्थिक दृष्टि से वर्ष (\d+) समृद्धिदायक रहेगा। (.+?) स्थायी संपत्ति के सृजन और संचित धन में वृद्धि के उत्तम योग बन रहे हैं।$/
  );
  if (yearlyFinMatch) {
    const [, yr, dailyFin] = yearlyFinMatch;
    const enDailyFin = EXACT_HI_TO_EN_MAP[dailyFin.trim()] || dailyFin;
    return `Financially, the year ${yr} will be prosperous. ${enDailyFin} Excellent combinations are forming for creating permanent assets and growing accumulated wealth.`;
  }

  const yearlyRemMatch = trimmed.match(
    /^(.+?) वर्ष में कुलदेवता का पूजन और नवग्रह शांति पाठ करवाना विशेष फलदायी रहेगा।$/
  );
  if (yearlyRemMatch) {
    const [, dailyRem] = yearlyRemMatch;
    const enDailyRem = EXACT_HI_TO_EN_MAP[dailyRem.trim()] || dailyRem;
    return `${enDailyRem} Performing Kuladevata worship and Navagraha Shanti Paath during the year will be especially rewarding.`;
  }

  if (trimmed === 'अप्रैल से जून एवं अक्टूबर से दिसंबर') {
    return 'April to June & October to December';
  }

  // 4. Tyohar Detailed Sections (tyoharData.ts)
  const tyoharSigDefault = trimmed.match(
    /^(.+?) सनातन वैदिक परंपरा का अत्यंत पावन पर्व है, जो (.+?) में (.+?) \((.+?)\) के शुभ संयोग में मनाया जाता है। (.+?) शास्त्रों के अनुसार इस पावन तिथि पर श्रद्धापूर्वक व्रत, देव-आराधना एवं दान-पुण्य करने से साधक के जन्म-जन्मांतर के कष्टों का निवारण होता है और घर-परिवार में सुख, शांति, आरोग्य तथा ऐश्वर्य की वृद्धि होती है।$/
  );
  if (tyoharSigDefault) {
    const [, name, maas, tithi, vara, shortInfo] = tyoharSigDefault;
    const enShort = EXACT_HI_TO_EN_MAP[shortInfo.trim()] || translateSimpleTerm(shortInfo);
    return `${translateSimpleTerm(name)} is a deeply sacred festival of the Sanatana Vedic tradition, celebrated on the auspicious conjunction of ${translateSimpleTerm(tithi)} (${translateSimpleTerm(vara)}) in ${translateSimpleTerm(maas)}. ${enShort} According to the scriptures, observing fasts, worshipping deities, and performing charity with devotion on this sacred date removes sufferings of many lifetimes and brings peace, happiness, good health, and prosperity to the family.`;
  }

  const tyoharSigEkadashi = trimmed.match(
    /^(.+?) भगवान श्री हरि विष्णु को समर्पित सर्वश्रेष्ठ व्रतों में से एक है। पद्म पुराण एवं स्कंद पुराण के अनुसार (.+?) की (.+?) को यह व्रत रखने से मनुष्य के समस्त ज्ञात-अज्ञात पाप नष्ट हो जाते हैं और अंत में मोक्ष \(बैकुंठ धाम\) की प्राप्ति होती है। (.+?) चंद्रमा की कलाओं का मन और शरीर पर सीधा प्रभाव पड़ता है, इसलिए एकादशी एवं व्रत तिथियों पर उपवास रखने से आध्यात्मिक एकाग्रता और सात्विक ऊर्जा का संचार होता है।$/
  );
  if (tyoharSigEkadashi) {
    const [, name, maas, tithi, shortInfo] = tyoharSigEkadashi;
    const enShort = EXACT_HI_TO_EN_MAP[shortInfo.trim()] || translateSimpleTerm(shortInfo);
    return `${translateSimpleTerm(name)} is one of the supreme fasts dedicated to Lord Shri Hari Vishnu. According to the Padma Purana and Skanda Purana, observing this fast on ${translateSimpleTerm(tithi)} of ${translateSimpleTerm(maas)} destroys all known and unknown sins and grants ultimate liberation (Vaikuntha Dham). ${enShort} The phases of the Moon directly influence the mind and body; therefore, fasting on Ekadashi and sacred Vrat dates enhances spiritual focus and Sattvic energy.`;
  }

  const tyoharSigShakti = trimmed.match(
    /^(.+?) भगवान देवाधिदेव महादेव एवं आदिशक्ति जगदंबा की कृपा प्राप्त करने का महान आध्यात्मिक पर्व है। (.+?) शिव पुराण एवं देवी भागवत के अनुसार (.+?) की (.+?) \((.+?)\) को की गई शिव-शक्ति उपासना से अकाल मृत्यु का भय समाप्त होता है, असाध्य रोगों से मुक्ति मिलती है तथा साधक की समस्त मनोकामनाएं पूर्ण होती हैं।$/
  );
  if (tyoharSigShakti) {
    const [, name, shortInfo, maas, tithi, vara] = tyoharSigShakti;
    const enShort = EXACT_HI_TO_EN_MAP[shortInfo.trim()] || translateSimpleTerm(shortInfo);
    return `${translateSimpleTerm(name)} is a grand spiritual festival to attain the divine grace of Lord Mahadeva and Adishakti Jagadamba. ${enShort} According to the Shiva Purana and Devi Bhagavata, worshipping Shiva and Shakti on ${translateSimpleTerm(tithi)} (${translateSimpleTerm(vara)}) of ${translateSimpleTerm(maas)} removes the fear of untimely death, grants relief from chronic ailments, and fulfills all noble desires of the devotee.`;
  }

  const tyoharSigSankranti = trimmed.match(
    /^(.+?) खगोलीय परिवर्तन, सूर्य उपासना एवं दिव्य अवतारों के प्राकट्य से जुड़ा पुण्यदायी पर्व है। (.+?) धर्मशास्त्रों में संक्रांति एवं जयंती तिथियों को पवित्र तीर्थ स्नान, पितृ तर्पण, गौ-सेवा, अन्नदान और गुरु-आराधना के लिए अक्षय फल देने वाला बताया गया है। इस दिन किया गया थोड़ा सा भी दान और जप सहस्र गुना फल प्रदान करता है।$/
  );
  if (tyoharSigSankranti) {
    const [, name, shortInfo] = tyoharSigSankranti;
    const enShort = EXACT_HI_TO_EN_MAP[shortInfo.trim()] || translateSimpleTerm(shortInfo);
    return `${translateSimpleTerm(name)} is a meritorious festival connected with celestial transition, Sun worship, and the manifestation of divine incarnations. ${enShort} In the Dharma Shastras, Sankranti and Jayanti dates are described as yielding inexhaustible merit for holy river baths, Pitru Tarpan, cow service, food donation, and Guru worship. Even a small act of charity and chanting on this day yields a thousandfold spiritual reward.`;
  }

  const tyoharPujaDynamicLine2 = trimmed.match(
    /^2\. पूजा स्थल को शुद्ध कर दीप प्रज्वलित करें तथा हाथ में जल, अक्षत और पुष्प लेकर "(.+?)" का उच्चारण करते हुए व्रत या पूजन का वैदिक संकल्प लें।$/
  );
  if (tyoharPujaDynamicLine2) {
    return `2. Purify the altar, light a lamp, and holding water, unbroken rice, and flowers in your hand, take the Vedic vow (Sankalp) for the fast or worship while pronouncing "${translateSimpleTerm(tyoharPujaDynamicLine2[1])}".`;
  }

  // Daily Parva fallback in TyoharView.tsx
  const dailyParvaShortMatch = trimmed.match(
    /^इस तिथि को (.+?) मास \((.+?)\) की (.+?), (.+?) नक्षत्र एवं (.+?) योग का संयोग है। दैनिक पंचदेव उपासना, इष्ट मंत्र जप एवं दान-पुण्य हेतु शुभ दिवस।$/
  );
  if (dailyParvaShortMatch) {
    const [, maas, paksha, tithi, nak, yoga] = dailyParvaShortMatch;
    return `This date marks the auspicious conjunction of ${translateSimpleTerm(tithi)} of ${translateSimpleTerm(maas)} month (${translateSimpleTerm(paksha)}), ${translateSimpleTerm(nak)} Nakshatra, and ${translateSimpleTerm(yoga)} Yoga. An auspicious day for daily Panchadeva worship, Ishta Mantra chanting, and charitable deeds.`;
  }

  // TOC Heading in ArticlesView.tsx: `अनुक्रमणिका — इस लेख के मुख्य बिंदु (5)`
  const tocMatch = trimmed.match(/^अनुक्रमणिका — इस लेख के मुख्य बिंदु \((\d+)\)$/);
  if (tocMatch) {
    return `Table of Contents — Key Highlights of This Article (${tocMatch[1]})`;
  }

  // Shloka meaning prefix in ArticlesView.tsx: `अर्थ: ...`
  if (trimmed.startsWith('अर्थ:')) {
    const body = trimmed.replace(/^अर्थ:\s*/, '');
    return `Meaning: ${EXACT_HI_TO_EN_MAP[body] || translateSimpleTerm(body)}`;
  }

  // TyoharView headings & counts
  const tyoharYearMatch = trimmed.match(/^प्रमुख त्योहार \((\d+)\)$/);
  if (tyoharYearMatch) return `Major Festivals (${tyoharYearMatch[1]})`;

  const allYearTyoharMatch = trimmed.match(/^संपूर्ण (\d+) के त्योहार$/);
  if (allYearTyoharMatch) return `All ${allYearTyoharMatch[1]} Festivals`;

  const selectedDateTyoharMatch = trimmed.match(/^चयनित तिथि \((.+?)\) के त्योहार एवं पर्व$/);
  if (selectedDateTyoharMatch) return `Festivals & Parvas on Selected Date (${selectedDateTyoharMatch[1]})`;

  const parvaCountMatch = trimmed.match(/^(\d+)\s*पर्व$/);
  if (parvaCountMatch) return `${parvaCountMatch[1]} Festivals`;

  const readTimeMatch = trimmed.match(/^(\d+)\s*मिनट$/);
  if (readTimeMatch) return `${readTimeMatch[1]} Min Read`;

  // 5. Kundli & Milan Dynamic Patterns (astrologyEngine.ts)
  // Dasha balance: `शेष: 5व 4मा 12दि`
  const dashaBalMatch = trimmed.match(/^शेष:\s*(\d+)व\s*(\d+)मा\s*(\d+)दि$/);
  if (dashaBalMatch) {
    return `Balance: ${dashaBalMatch[1]}y ${dashaBalMatch[2]}m ${dashaBalMatch[3]}d`;
  }

  // Panchang end time: `समाप्ति: 18:10 (इसके बाद: तृतीया)`
  const panchangEndMatch = trimmed.match(/^समाप्ति:\s*(.+?)\s*\(इसके बाद:\s*(.+?)\)$/);
  if (panchangEndMatch) {
    return `Ends: ${panchangEndMatch[1]} (Next: ${translateSimpleTerm(panchangEndMatch[2])})`;
  }

  // Tithi until time: `एकादशी (18:10 तक)`
  const untilMatch = trimmed.match(/^(.+?)\s*\((.+?)\s*तक\)$/);
  if (untilMatch) {
    return `${translateSimpleTerm(untilMatch[1])} (Until ${untilMatch[2]})`;
  }

  // Sade Sati Dhaiyya: `${rashi} राशि पर वर्तमान में शनि की ढैय्या का प्रभाव है। कार्यक्षेत्र में संयम और निरंतरता बनाए रखने से सफलता प्राप्त होगी।`
  const dhaiyyaMatch = trimmed.match(
    /^(.+?) राशि पर वर्तमान में शनि की ढैय्या का प्रभाव है। कार्यक्षेत्र में संयम और निरंतरता बनाए रखने से सफलता प्राप्त होगी।$/
  );
  if (dhaiyyaMatch) {
    return `${translateSimpleTerm(dhaiyyaMatch[1])} is currently under the influence of Shani Dhaiyya. Maintaining patience and consistency in your workplace will bring success.`;
  }

  // Sade Sati Free: `${rashi} राशि के जातकों पर वर्तमान में शनि की साढ़ेसाती या ढैय्या का कोई प्रभाव नहीं है। समय उन्नतिदायक एवं अनुकूल है।`
  const sadeSatiFreeMatch = trimmed.match(
    /^(.+?) राशि के जातकों पर वर्तमान में शनि की साढ़ेसाती या ढैय्या का कोई प्रभाव नहीं है। समय उन्नतिदायक एवं अनुकूल है।$/
  );
  if (sadeSatiFreeMatch) {
    return `${translateSimpleTerm(sadeSatiFreeMatch[1])} natives are currently free from any influence of Shani Sade Sati or Dhaiyya. The period is progressive and favorable.`;
  }

  // Guna Milan dynamic sentences
  const nadiAbsentMatch = trimmed.match(
    /^वर की नाड़ी '(.+?)' और कन्या की नाड़ी '(.+?)' अलग-अलग हैं, इसलिए नाड़ी दोष नहीं है।$/
  );
  if (nadiAbsentMatch) {
    return `The groom’s Nadi (${translateSimpleTerm(nadiAbsentMatch[1])}) and bride’s Nadi (${translateSimpleTerm(nadiAbsentMatch[2])}) are different, so there is no Nadi Dosha.`;
  }

  const bhakootAbsentMatch = trimmed.match(
    /^वर \((.+?)\) और कन्या \((.+?)\) की राशियां आपस में अनुकूल हैं, भकूट दोष नहीं है।$/
  );
  if (bhakootAbsentMatch) {
    return `The Moon signs of the groom (${translateSimpleTerm(bhakootAbsentMatch[1])}) and bride (${translateSimpleTerm(bhakootAbsentMatch[2])}) are mutually harmonious; there is no Bhakoot Dosha.`;
  }

  const ganaAbsentMatch = trimmed.match(
    /^वर \((.+?) गण\) और कन्या \((.+?) गण\) के स्वभाव व विचारों में अच्छा तालमेल रहेगा।$/
  );
  if (ganaAbsentMatch) {
    return `There will be good harmony in temperament and thoughts between the groom (${translateSimpleTerm(ganaAbsentMatch[1])} Gana) and bride (${translateSimpleTerm(ganaAbsentMatch[2])} Gana).`;
  }

  // Dates like `14 जनवरी 2026` or `मार्च 2026`
  let result = input;
  for (const [hiM, enM] of Object.entries(HINDI_MONTH_MAP)) {
    if (result.includes(hiM)) {
      result = result.split(hiM).join(enM);
    }
  }

  return result;
}

function translateDateText(text: string): string {
  let out = text;
  for (const [hiM, enM] of Object.entries(HINDI_MONTH_MAP)) {
    out = out.split(hiM).join(enM);
  }
  return out;
}

const SIMPLE_TERM_LOOKUP: Record<string, string> = {
  'मेष': 'Aries',
  'वृषभ': 'Taurus',
  'मिथुन': 'Gemini',
  'कर्क': 'Cancer',
  'सिंह': 'Leo',
  'कन्या': 'Virgo',
  'तुला': 'Libra',
  'वृश्चिक': 'Scorpio',
  'धनु': 'Sagittarius',
  'मकर': 'Capricorn',
  'कुंभ': 'Aquarius',
  'कुम्भ': 'Aquarius',
  'मीन': 'Pisces',
  'चैत्र': 'Chaitra',
  'वैशाख': 'Vaishakha',
  'ज्येष्ठ': 'Jyeshtha',
  'आषाढ़': 'Ashadha',
  'श्रावण': 'Shravana',
  'भाद्रपद': 'Bhadrapada',
  'आश्विन': 'Ashvina',
  'कार्तिक': 'Kartika',
  'मार्गशीर्ष': 'Margashirsha',
  'पौष': 'Pausha',
  'माघ': 'Magha',
  'फाल्गुन': 'Phalguna',
  'शुक्ल पक्ष': 'Shukla Paksha',
  'कृष्ण पक्ष': 'Krishna Paksha',
  'शुक्ल': 'Shukla',
  'कृष्ण': 'Krishna',
  'प्रतिपदा': 'Pratipada',
  'द्वितीया': 'Dwitiya',
  'तृतीया': 'Tritiya',
  'चतुर्थी': 'Chaturthi',
  'पंचमी': 'Panchami',
  'षष्ठी': 'Shashthi',
  'सप्तमी': 'Saptami',
  'अष्टमी': 'Ashtami',
  'नवमी': 'Navami',
  'दशमी': 'Dashami',
  'एकादशी': 'Ekadashi',
  'द्वादशी': 'Dwadashi',
  'त्रयोदशी': 'Trayodashi',
  'चतुर्दशी': 'Chaturdashi',
  'पूर्णिमा': 'Purnima',
  'अमावस्या': 'Amavasya',
  'रविवार': 'Sunday',
  'सोमवार': 'Monday',
  'मंगलवार': 'Tuesday',
  'बुधवार': 'Wednesday',
  'गुरुवार': 'Thursday',
  'शुक्रवार': 'Friday',
  'शनिवार': 'Saturday',
  'तिथि': 'Tithi',
  'मास': 'Month',
  'पर्व': 'Festival',
  'व्रत': 'Vrat'
};

function translateSimpleTerm(text: string): string {
  let out = text.trim();
  if (EXACT_HI_TO_EN_MAP[out]) return EXACT_HI_TO_EN_MAP[out];
  for (const [k, v] of Object.entries(SIMPLE_TERM_LOOKUP)) {
    if (out.includes(k)) {
      out = out.split(k).join(v);
    }
  }
  return out;
}
