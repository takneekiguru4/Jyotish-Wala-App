/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NumerologyReport {
  mulank: number;
  bhagyank: number;
  namank: number;
  ruler: string;
  rulerHi: string;
  element: string;
  luckyDays: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  traits: string[];
  careerSuggestions: string[];
  remedy: string;
}

const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

function sumToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
  }
  return num === 0 ? 1 : num;
}

export function calculateNumerology(name: string, birthDate: string): NumerologyReport {
  // Birth date format YYYY-MM-DD
  const parts = birthDate.split('-').map(Number);
  const day = parts[2] || 1;
  const month = parts[1] || 1;
  const year = parts[0] || 2000;

  // 1. Mulank (Birth Number)
  const mulank = sumToSingleDigit(day);

  // 2. Bhagyank (Destiny Number)
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const totalSum = allDigits.reduce((a, b) => a + b, 0);
  const bhagyank = sumToSingleDigit(totalSum);

  // 3. Namank (Name Number)
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let nameSum = 0;
  for (const char of cleanName) {
    nameSum += CHALDEAN_MAP[char] || 0;
  }
  const namank = nameSum > 0 ? sumToSingleDigit(nameSum) : mulank;

  const NUMERO_PROFILES: Record<number, {
    ruler: string;
    rulerHi: string;
    element: string;
    luckyDays: string[];
    luckyColors: string[];
    luckyNumbers: number[];
    traits: string[];
    career: string[];
    remedy: string;
  }> = {
    1: {
      ruler: 'Sun',
      rulerHi: 'सूर्य देव',
      element: 'अग्नि (Fire)',
      luckyDays: ['रविवार', 'सोमवार'],
      luckyColors: ['नारंगी', 'पीला', 'स्वर्ण'],
      luckyNumbers: [1, 2, 4, 7],
      traits: ['नेतृत्व क्षमता', 'स्वाभिमानी', 'महत्वाकांक्षी', 'आत्मविश्वासी'],
      career: ['प्रशासन (IAS/IPS)', 'राजनीति', 'उद्योगपति', 'सरकारी सेवा'],
      remedy: 'प्रतिदिन प्रातः सूर्य को अर्घ्य दें और गायत्री मंत्र का 108 बार जप करें।'
    },
    2: {
      ruler: 'Moon',
      rulerHi: 'चन्द्र देव',
      element: 'जल (Water)',
      luckyDays: ['सोमवार', 'शुक्रवार'],
      luckyColors: ['सफेद', 'हल्का हरा', 'चांदी जैसा'],
      luckyNumbers: [2, 1, 7],
      traits: ['कल्पनाशील', 'संवेदनशील', 'कलात्मक', 'शांतिप्रिय'],
      career: ['लेखन', 'संगीत', 'मनोविज्ञान', 'जल व दुग्ध व्यवसाय'],
      remedy: 'सोमवार को शिवलिंग पर कच्चा दूध अर्पित करें और चांदी का छल्ला धारण करें।'
    },
    3: {
      ruler: 'Jupiter',
      rulerHi: 'देवगुरु बृहस्पति',
      element: 'आकाश (Ether)',
      luckyDays: ['गुरुवार', 'मंगलवार'],
      luckyColors: ['पीला', 'केसरिया', 'हल्दी जैसा'],
      luckyNumbers: [3, 6, 9],
      traits: ['विद्वान', 'मार्गदर्शक', 'न्यायप्रिय', 'आशावादी'],
      career: ['शिक्षण', 'वकालत', 'धर्म व ज्योतिष', 'बैंकिंग'],
      remedy: 'गुरुवार को पीले वस्त्र पहनें और चने की दाल व केले का दान करें।'
    },
    4: {
      ruler: 'Rahu',
      rulerHi: 'राहु देव',
      element: 'वायु (Air)',
      luckyDays: ['शनिवार', 'रविवार'],
      luckyColors: ['नीला', 'धूसर (Grey)', 'खाकी'],
      luckyNumbers: [4, 1, 8],
      traits: ['क्रांतिकारी', 'तकनीकी दक्ष', 'अपरंपरागत सोच', 'मेहनती'],
      career: ['सॉफ्टवेयर व आईटी', 'रिसर्च', 'इंजीनियरिंग', 'मीडिया'],
      remedy: 'शनिवार को पक्षियों को बाजरा खिलाएं और भैरव चालीसा का पाठ करें।'
    },
    5: {
      ruler: 'Mercury',
      rulerHi: 'बुध देव',
      element: 'पृथ्वी (Earth)',
      luckyDays: ['बुधवार', 'शुक्रवार'],
      luckyColors: ['हरा', 'तोतिया हरा', 'हल्का आसमानी'],
      luckyNumbers: [5, 1, 6],
      traits: ['वाकपटु', 'व्यापारिक चातुर्य', 'स्फूर्तिवान', 'मिलनसार'],
      career: ['व्यापार', 'शेयर मार्केट', 'पत्रकारिता', 'मार्केटिंग'],
      remedy: 'गाय को हरा पालक अथवा चारा खिलाएं और गणेश अथर्वशीर्ष का पाठ करें।'
    },
    6: {
      ruler: 'Venus',
      rulerHi: 'शुक्र देव',
      element: 'जल (Water)',
      luckyDays: ['शुक्रवार', 'सोमवार'],
      luckyColors: ['सफेद', 'गुलाबी', 'चमकीला'],
      luckyNumbers: [6, 3, 9],
      traits: ['सौंदर्यप्रेमी', 'आकर्षक व्यक्तित्व', 'विलासप्रिय', 'दयालु'],
      career: ['फैशन व डिजाइनिंग', 'सिनेमा', 'होटल मैनेजमेंट', 'आभूषण'],
      remedy: 'शुक्रवार को श्रीसूक्त का पाठ करें और सुगंधित इत्र का प्रयोग करें।'
    },
    7: {
      ruler: 'Ketu',
      rulerHi: 'केतु देव',
      element: 'जल (Water)',
      luckyDays: ['रविवार', 'सोमवार'],
      luckyColors: ['हल्का पीला', 'सफेद', 'भूरा'],
      luckyNumbers: [7, 2, 1],
      traits: ['अतींद्रिय ज्ञान', 'दार्शनिक', 'चिंतनशील', 'रहस्यवादी'],
      career: ['रिसर्च', 'अध्यात्म', 'लेखन', 'गुप्तचर सेवा'],
      remedy: 'काले-सफेद कुत्ते को रोटी खिलाएं और गणेश जी को दूर्वा अर्पित करें।'
    },
    8: {
      ruler: 'Saturn',
      rulerHi: 'शनि देव',
      element: 'वायु (Air)',
      luckyDays: ['शनिवार', 'शुक्रवार'],
      luckyColors: ['गहरा नीला', 'काला', 'जामुनी'],
      luckyNumbers: [8, 4, 6],
      traits: ['परिश्रमी', 'गंभीर', 'न्यायप्रिय', 'धैर्यवान'],
      career: ['लोहा व इस्पात', 'तेल व खनिज', 'रियल एस्टेट', 'न्यायपालिका'],
      remedy: 'शनिवार की शाम पीपल के वृक्ष के नीचे तिल अथवा सरसों के तेल का दीपक जलाएं।'
    },
    9: {
      ruler: 'Mars',
      rulerHi: 'मंगल देव',
      element: 'अग्नि (Fire)',
      luckyDays: ['मंगलवार', 'गुरुवार'],
      luckyColors: ['लाल', 'गुलाबी', 'नारंगी'],
      luckyNumbers: [9, 1, 3],
      traits: ['साहसी', 'ऊर्जावान', 'नेतृत्वशील', 'परोपकारी'],
      career: ['सैन्य सेवा', 'पुलिस', 'सर्जन/चिकित्सा', 'खेलकूद व निर्माण'],
      remedy: 'प्रति मंगलवार हनुमान जी को सिंदूर व चमेली का तेल चढ़ाएं।'
    }
  };

  const profile = NUMERO_PROFILES[mulank] || NUMERO_PROFILES[1];

  return {
    mulank,
    bhagyank,
    namank,
    ruler: profile.ruler,
    rulerHi: profile.rulerHi,
    element: profile.element,
    luckyDays: profile.luckyDays,
    luckyColors: profile.luckyColors,
    luckyNumbers: profile.luckyNumbers,
    traits: profile.traits,
    careerSuggestions: profile.career,
    remedy: profile.remedy
  };
}

export interface VastuDirection {
  directionHi: string;
  directionEn: string;
  deity: string;
  planet: string;
  element: string;
  suitable: string[];
  unsuitable: string[];
  remedy: string;
}

export const VASTU_DIRECTIONS: VastuDirection[] = [
  {
    directionHi: 'ईशान कोण (North-East)',
    directionEn: 'North-East',
    deity: 'भगवान शिव (ईशान)',
    planet: 'बृहस्पति (Jupiter)',
    element: 'जल एवं आकाश',
    suitable: ['पूजा घर (मंदिर)', 'जल स्रोत (बोरवेल/अंडरग्राउंड वाटर टैंक)', 'खुला बरामदा', 'ध्यान कक्ष'],
    unsuitable: ['शौचालय (कदापि नहीं)', 'भारी स्टोर रूम', 'सीढ़ियां', 'रसोई घर'],
    remedy: 'ईशान कोण को सदैव स्वच्छ व हल्का रखें। यहां एक कांस्य के पात्र में जल व ताजे फूल रखें।'
  },
  {
    directionHi: 'पूर्व दिशा (East)',
    directionEn: 'East',
    deity: 'इंद्र देव',
    planet: 'सूर्य देव',
    element: 'अग्नि व प्रकाश',
    suitable: ['मुख्य द्वार', 'बैठक कक्ष (Living Room)', 'अध्ययन कक्ष (Study Room)', 'खिड़कियां'],
    unsuitable: ['शौचालय', 'कचरा स्थल', 'ऊंची भारी दीवारें'],
    remedy: 'पूर्व दिशा में तांबे का सूर्य यंत्र स्थापित करें। प्रातःकाल की धूप घर में अवश्य आने दें।'
  },
  {
    directionHi: 'आग्नेय कोण (South-East)',
    directionEn: 'South-East',
    deity: 'अग्नि देव',
    planet: 'शुक्र देव (Venus)',
    element: 'अग्नि (Fire)',
    suitable: ['रसोई घर (Kitchen)', 'विद्युत मीटर / इन्वर्टर', 'बॉयलर / गीजर'],
    unsuitable: ['शयनकक्ष (दाम्पत्य कलह संभव)', 'अंडरग्राउंड पानी की टंकी', 'पूजा घर'],
    remedy: 'आग्नेय कोण में रसोई न होने पर आग्नेय कोण की दीवार पर लाल अथवा नारंगी रंग का बल्ब जलाएं।'
  },
  {
    directionHi: 'उत्तर दिशा (North)',
    directionEn: 'North',
    deity: 'कुबेर देव',
    planet: 'बुध देव (Mercury)',
    element: 'जल (Water)',
    suitable: ['तिजोरी / धन रखने का स्थान', 'मुख्य द्वार', 'लिविंग रूम', 'पुस्तकालय'],
    unsuitable: ['शौचालय', 'भारी निर्माण', 'सीढ़ियां'],
    remedy: 'उत्तर दिशा में कुबेर यंत्र अथवा हरे पौधे (मनी प्लांट) स्थापित करें। तिजोरी का मुख उत्तर की ओर खुले।'
  },
  {
    directionHi: 'नैऋत्य कोण (South-West)',
    directionEn: 'South-West',
    deity: 'नैऋति / पितर देव',
    planet: 'राहु देव (Rahu)',
    element: 'पृथ्वी (Earth)',
    suitable: ['गृहस्वामी का मुख्य शयनकक्ष (Master Bedroom)', 'भारी अलमारी', 'ओवरहेड वाटर टैंक'],
    unsuitable: ['पूजा घर', 'अंडरग्राउंड बोरवेल', 'मुख्य प्रवेश द्वार'],
    remedy: 'नैऋत्य कोण को घर का सबसे ऊंचा और भारी स्थान रखें। यहां पीला अथवा भूरा रंग शुभ होता है।'
  },
  {
    directionHi: 'वायव्य कोण (North-West)',
    directionEn: 'North-West',
    deity: 'वायु देव',
    planet: 'चन्द्र देव (Moon)',
    element: 'वायु (Air)',
    suitable: ['अतिथि कक्ष (Guest Room)', 'अविवाहित कन्याओं का कमरा', 'तैयार माल (Stock)', 'पार्किंग'],
    unsuitable: ['गृहस्वामी का शयनकक्ष', 'तिजोरी'],
    remedy: 'वायव्य कोण में विंड चाइम (Wind Chime) लगाएं अथवा सफेद रंग के पर्दे प्रयोग करें।'
  }
];
