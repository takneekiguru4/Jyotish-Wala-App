import React, { useState } from 'react';
import { Calculator, Gem, Hash, AlertTriangle, CheckCircle2, Sparkles, X, ArrowLeft } from 'lucide-react';
import { LanguageCode } from '../types';
import { t } from '../i18n/translations';
import { DatePicker } from '../components/DatePicker';

interface CalculatorsViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

const RASHI_GEM_DATA: Record<string, { gem: string; metal: string; finger: string; day: string; mantra: string; planet: string }> = {
  'मेष': { gem: 'मूंगा', metal: 'तांबा या सोना', finger: 'अनामिका', day: 'मंगलवार', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', planet: 'मंगल' },
  'वृषभ': { gem: 'हीरा या ओपल', metal: 'चांदी या प्लैटिनम', finger: 'मध्यमा', day: 'शुक्रवार', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', planet: 'शुक्र' },
  'मिथुन': { gem: 'पन्ना', metal: 'सोना या चांदी', finger: 'कनिष्ठिका', day: 'बुधवार', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', planet: 'बुध' },
  'कर्क': { gem: 'मोती', metal: 'चांदी', finger: 'कनिष्ठिका', day: 'सोमवार', mantra: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः', planet: 'चंद्र' },
  'सिंह': { gem: 'माणिक्य', metal: 'सोना या तांबा', finger: 'अनामिका', day: 'रविवार', mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', planet: 'सूर्य' },
  'कन्या': { gem: 'पन्ना', metal: 'सोना', finger: 'कनिष्ठिका', day: 'बुधवार', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', planet: 'बुध' },
  'तुला': { gem: 'ओपल या हीरा', metal: 'चांदी', finger: 'मध्यमा', day: 'शुक्रवार', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', planet: 'शुक्र' },
  'वृश्चिक': { gem: 'लाल मूंगा', metal: 'तांबा या सोना', finger: 'अनामिका', day: 'मंगलवार', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', planet: 'मंगल' },
  'धनु': { gem: 'पुखराज', metal: 'सोना', finger: 'तर्जनी', day: 'गुरुवार', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', planet: 'बृहस्पति' },
  'मकर': { gem: 'नीलम', metal: 'पंचधातु या चांदी', finger: 'मध्यमा', day: 'शनिवार', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', planet: 'शनि' },
  'कुंभ': { gem: 'नीलम या लाजवर्त', metal: 'पंचधातु', finger: 'मध्यमा', day: 'शनिवार', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', planet: 'शनि' },
  'मीन': { gem: 'पीला पुखराज', metal: 'सोना', finger: 'तर्जनी', day: 'गुरुवार', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', planet: 'बृहस्पति' },
};

const NUMEROLOGY_INFO: Record<number, { lord: string; traits: string; luckyColors: string; career: string }> = {
  1: { lord: 'सूर्य', traits: 'नेतृत्व क्षमता, आत्मविश्वासी, महत्वाकांक्षी एवं स्वतंत्र विचार।', luckyColors: 'सुनहरा, नारंगी, पीला', career: 'प्रशासन, राजनीति, प्रबंधन एवं उच्च पद' },
  2: { lord: 'चंद्रमा', traits: 'भावुक, कल्पनाशील, सहयोगी एवं शांतिप्रिय व्यक्तित्व।', luckyColors: 'सफेद, क्रीम, हल्का हरा', career: 'कला, लेखन, चिकित्सा, परामर्श एवं जल क्षेत्र' },
  3: { lord: 'बृहस्पति', traits: 'ज्ञानी, अनुशासित, आध्यात्मिक एवं उच्च आदर्शों वाले।', luckyColors: 'पीला, केसरिया, गुलाबी', career: 'शिक्षा, न्यायपालिका, बैंकिंग एवं धर्म गुरु' },
  4: { lord: 'राहु', traits: 'व्यावहारिक, क्रांतिकारी विचार, मेहनती एवं तकनीकी दक्षता।', luckyColors: 'नीला, भूरा, खाकी', career: 'इंजीनियरिंग, आईटी, शोध एवं मीडिया' },
  5: { lord: 'बुध', traits: 'तीव्र बुद्धि, वाक्पटु, व्यापार कुशल एवं बहुमुखी प्रतिभा।', luckyColors: 'हरा, सफेद', career: 'व्यापार, वाणिज्य, पत्रकारिता एवं संचार' },
  6: { lord: 'शुक्र', traits: 'आकर्षक, कला प्रेमी, सौंदर्यप्रिय एवं वैभवशाली जीवन।', luckyColors: 'सफेद, हल्का नीला, गुलाबी', career: 'फैशन, फिल्म, होटल, आभूषण एवं कला' },
  7: { lord: 'केतु', traits: 'दार्शनिक, अंतर्मुखी, रहस्यमयी विद्याओं के ज्ञाता एवं शोधकर्ता।', luckyColors: 'सफेद, हल्का पीला, चितकबरा', career: 'ज्योतिष, अध्यात्म, अनुसंधान एवं लेखन' },
  8: { lord: 'शनि', traits: 'न्यायप्रिय, धैर्यवान, कर्मठ एवं संघर्ष से शिखर तक पहुंचने वाले।', luckyColors: 'गहरा नीला, काला, बैंगनी', career: 'उद्योग, खनिज, कानून, रियल एस्टेट' },
  9: { lord: 'मंगल', traits: 'साहसी, ऊर्जावान, निडर एवं परोपकारी स्वभाव।', luckyColors: 'लाल, सिंदूरी, गुलाबी', career: 'सेना, पुलिस, खेलकूद, चिकित्सा एवं प्रशासन' },
};

export default function CalculatorsView({ currentLang, onClosePage, onGoBack }: CalculatorsViewProps) {
  const [activeTab, setActiveTab] = useState<'gem' | 'numerology' | 'sadesati'>('gem');
  const [selectedRashi, setSelectedRashi] = useState<string>('मेष');
  // Default to today's date (IST)
  const [birthDate, setBirthDate] = useState<string>(() => {
    const istNow = new Date(Date.now() + 5.5 * 3600 * 1000);
    return istNow.toISOString().split('T')[0];
  });
  const [sadeSatiRashi, setSadeSatiRashi] = useState<string>('मीन');

  const calculateMulankAndBhagyank = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { mulank: 1, bhagyank: 1 };
    const day = parseInt(parts[2], 10) || 1;
    const sumDigits = (n: number): number => {
      let s = n;
      while (s > 9) {
        s = String(s).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
      }
      return s;
    };
    const mulank = sumDigits(day);
    const allDigits = dateStr.replace(/-/g, '').split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const bhagyank = sumDigits(allDigits);
    return { mulank, bhagyank };
  };

  const { mulank, bhagyank } = calculateMulankAndBhagyank(birthDate);
  const numData = NUMEROLOGY_INFO[mulank] || NUMEROLOGY_INFO[1];
  const gemData = RASHI_GEM_DATA[selectedRashi] || RASHI_GEM_DATA['मेष'];

  const getSadeSatiStatus = (rashi: string) => {
    if (rashi === 'कुंभ') {
      return {
        isActive: true,
        phase: 'अंतिम चरण (उतरती साढ़ेसाती)',
        desc: 'शनि वर्तमान में मीन राशि में गोचर कर रहे हैं। कुंभ राशि के जातकों पर साढ़ेसाती का तीसरा और अंतिम चरण चल रहा है। परिश्रम का शुभ फल मिलेगा।',
        remedy: 'प्रत्येक शनिवार पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और हनुमान चालीसा का पाठ करें।'
      };
    }
    if (rashi === 'मीन') {
      return {
        isActive: true,
        phase: 'द्वितीय चरण (शिखर चरण)',
        desc: 'शनि आपकी चंद्र राशि मीन में गोचर कर रहे हैं। यह साढ़ेसाती का मध्य चरण है। स्वास्थ्य एवं मानसिक शांति पर विशेष ध्यान दें और धैर्य रखें।',
        remedy: 'शनिवार को छाया दान करें और "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः" मंत्र का 108 बार जाप करें।'
      };
    }
    if (rashi === 'मेष') {
      return {
        isActive: true,
        phase: 'प्रथम चरण (चढ़ती साढ़ेसाती)',
        desc: 'मेष राशि के जातकों पर शनि की साढ़ेसाती का प्रथम चरण प्रारंभ हो चुका है। अनावश्यक खर्चों पर नियंत्रण रखें एवं सोच-समझकर निर्णय लें।',
        remedy: 'भगवान शिव का जलाभिषेक करें और शनिवार को गरीबों को काले तिल या अन्न का दान करें।'
      };
    }
    if (rashi === 'सिंह' || rashi === 'धनु') {
      return {
        isActive: true,
        phase: 'शनि ढैय्या (लघु कल्याणी ढैय्या)',
        desc: `${rashi} राशि पर वर्तमान में शनि की ढैय्या का प्रभाव है। कार्यक्षेत्र में संयम और निरंतरता बनाए रखने से सफलता प्राप्त होगी।`,
        remedy: 'मंगलवार और शनिवार को सुंदरकांड का पाठ करें।'
      };
    }
    return {
      isActive: false,
      phase: 'साढ़ेसाती / ढैय्या से मुक्त',
      desc: `${rashi} राशि के जातकों पर वर्तमान में शनि की साढ़ेसाती या ढैय्या का कोई प्रभाव नहीं है। समय उन्नतिदायक एवं अनुकूल है।`,
      remedy: 'नियमित रूप से अपने इष्ट देव की आराधना जारी रखें।'
    };
  };

  const sadeSatiStatus = getSadeSatiStatus(sadeSatiRashi);

  return (
    <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-6 border border-[#008080]/20 shadow-xs space-y-5 mb-6">
      {/* Row 1: Back and Close Buttons at Very Start of Card */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
        <button
          type="button"
          onClick={onGoBack || onClosePage}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          title="पिछले पृष्ठ पर जाएं"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>वापस</span>
        </button>

        <button
          type="button"
          onClick={onClosePage}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          title="पेज बंद कर होम पर जाएं"
        >
          <X className="w-4 h-4" />
          <span>{t('closePage', currentLang) || 'बंद करें'}</span>
        </button>
      </div>

      {/* Row 2: Title and Subtitle Below Navigation Buttons */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {t('calculators', currentLang) || 'ज्योतिष कैलकुलेटर'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            रत्न परामर्श, अंक ज्योतिष एवं शनि साढ़ेसाती जांच
          </p>
        </div>
      </div>

      {/* Tabs (Strictly Text Only - Icons Removed as Requested) */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl">
        <button
          onClick={() => setActiveTab('gem')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
            activeTab === 'gem'
              ? 'bg-[#008080] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="truncate">रत्न परामर्श</span>
        </button>

        <button
          onClick={() => setActiveTab('numerology')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
            activeTab === 'numerology'
              ? 'bg-[#008080] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="truncate">अंक ज्योतिष</span>
        </button>

        <button
          onClick={() => setActiveTab('sadesati')}
          className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition cursor-pointer ${
            activeTab === 'sadesati'
              ? 'bg-[#FF7F33] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="truncate">शनि साढ़ेसाती</span>
        </button>
      </div>

      {activeTab === 'gem' && (
        <div className="pt-2 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              अपनी राशि चुनें
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(RASHI_GEM_DATA).map(rashi => (
                <button
                  key={rashi}
                  onClick={() => setSelectedRashi(rashi)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedRashi === rashi
                      ? 'bg-[#008080] text-white border-[#008080]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {rashi}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#008080]/15 space-y-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#008080] text-white">
                {selectedRashi} राशि • स्वामी ग्रह: {gemData.planet}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                शुभ रत्न: <span className="text-[#008080] dark:text-teal-400">{gemData.gem}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                वैदिक ज्योतिष के अनुसार {selectedRashi} राशि के जातकों के लिए जीवन में सुख, समृद्धि एवं ग्रह बल बढ़ाने हेतु <strong>{gemData.gem}</strong> धारण करना अत्यंत लाभकारी माना जाता है।
              </p>
            </div>

            {/* 3 Boxes in One Line (श्रेष्ठ धातु, धारण करने की उंगली, शुभ वार) + 1 Full-Width Box Below (अभिमंत्रण मंत्र) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/20">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  श्रेष्ठ धातु
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {gemData.metal}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/20">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  धारण करने की उंगली
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {gemData.finger}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/20">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  शुभ वार
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#008080] dark:text-teal-300">
                  {gemData.day}
                </span>
              </div>

              <div className="sm:col-span-3 p-3.5 rounded-xl bg-orange-50/50 dark:bg-slate-900 border border-[#FF7F33]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  अभिमंत्रण मंत्र:
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[#FF7F33] font-sanskrit">
                  {gemData.mantra}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'numerology' && (
        <div className="pt-2 space-y-5">
          <div className="max-w-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              अपनी जन्म तिथि चुनें
            </label>
            <DatePicker
              value={birthDate}
              onChange={val => val && setBirthDate(val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#008080]/15">
            <div className="p-5 rounded-xl bg-[#008080] text-white text-center flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-teal-100">आपका मूलांक</span>
              <span className="text-4xl font-extrabold my-1.5">{mulank}</span>
              <span className="text-xs bg-white/15 px-3 py-1 rounded-full">स्वामी ग्रह: {numData.lord}</span>
            </div>

            <div className="p-5 rounded-xl bg-[#FF7F33] text-white text-center flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-orange-100">आपका भाग्यांक</span>
              <span className="text-4xl font-extrabold my-1.5">{bhagyank}</span>
              <span className="text-xs bg-white/15 px-3 py-1 rounded-full">भाग्योदय कारक अंक</span>
            </div>

            <div className="space-y-2.5 flex flex-col justify-center">
              <div>
                <span className="text-xs font-bold text-[#008080] block">व्यक्तित्व एवं स्वभाव</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{numData.traits}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF7F33] block">अनुकूल करियर क्षेत्र</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{numData.career}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">शुभ रंग: {numData.luckyColors}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sadesati' && (
        <div className="pt-2 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              अपनी चंद्र राशि चुनें
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(RASHI_GEM_DATA).map(rashi => (
                <button
                  key={rashi}
                  onClick={() => setSadeSatiRashi(rashi)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    sadeSatiRashi === rashi
                      ? 'bg-[#FF7F33] text-white border-[#FF7F33]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {rashi}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#008080]/15 flex items-start gap-3.5">
            {sadeSatiStatus.isActive ? (
              <AlertTriangle className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {sadeSatiRashi} राशि • वर्तमान शनि गोचर: मीन राशि
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {sadeSatiStatus.phase}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {sadeSatiStatus.desc}
              </p>
              <div className="pt-2.5 mt-2.5 border-t border-[#008080]/15">
                <p className="text-xs font-bold text-[#008080] dark:text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> वैदिक उपाय: {sadeSatiStatus.remedy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
