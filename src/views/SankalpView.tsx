import React, { useState, useMemo, useEffect } from 'react';
import {
  Scroll,
  ArrowLeft,
  X,
  HelpCircle,
  Copy,
  Check,
  Printer,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../types';
import { CityLocation, getPanchangForDate, getCurrentMomentPanchang } from '../services/panchangEngine';
import { generateKundli } from '../services/astrologyEngine';
import { DICTIONARY } from '../i18n/translations';
import { getSiteContent, SankalpContentConfig } from '../services/siteContentService';
import { formatToDdMmYyyy } from '../components/DatePicker';
import { togglePersonalLibraryBookmark } from '../services/sanatanPlatformService';

interface SankalpViewProps {
  currentLang: LanguageCode;
  selectedCity: CityLocation;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const SankalpView: React.FC<SankalpViewProps> = ({
  currentLang,
  selectedCity,
  onClosePage,
  onGoBack
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [activeTab, setActiveTab] = useState<'info' | 'laghu' | 'vistrit' | 'generator'>('info');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom Sankalpa Document Generator fields (Section 21)
  const [yajmanName, setYajmanName] = useState<string>('श्री राकेश कुमार शर्मा');
  const [yajmanGotra, setYajmanGotra] = useState<string>('कश्यप');
  const [yajmanPravar, setYajmanPravar] = useState<string>('त्र्यार्षेय');
  const [familyDetails, setFamilyDetails] = useState<string>('सपत्नीक एवं सपरिवार');
  const [purposeHi, setPurposeHi] = useState<string>(
    'सकल-ग्रह-दोष-निवारणार्थं आयुरारोग्यैश्वर्याभिवृद्ध्यर्थं श्रीपरमेश्वरप्रीत्यर्थं'
  );
  const [savedDocMsg, setSavedDocMsg] = useState<string | null>(null);

  // Managed content from Admin Panel
  const [sankalpContent, setSankalpContent] = useState<SankalpContentConfig>(
    () => getSiteContent().sankalp
  );

  useEffect(() => {
    const handleContentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.sankalp) {
        setSankalpContent(customEvent.detail.sankalp);
      } else {
        setSankalpContent(getSiteContent().sankalp);
      }
    };
    window.addEventListener('jyotishwala_site_content_changed', handleContentUpdate);
    return () => {
      window.removeEventListener('jyotishwala_site_content_changed', handleContentUpdate);
    };
  }, []);

  // Live dynamic panchang elements strictly reflecting the CURRENT MOMENT/TIME in IST
  const liveSankalpData = useMemo(() => {
    const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000);
    const todayStr = nowIst.toISOString().split('T')[0];
    const timeStr = `${nowIst.getUTCHours().toString().padStart(2, '0')}:${nowIst
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}`;

    const panchang = getPanchangForDate(todayStr, selectedCity);
    // Real-time astrological calculation at exact current instant (Tithi, Nakshatra, Yoga, Karana)
    const momentPanchang = getCurrentMomentPanchang(new Date(), selectedCity);

    const chart = generateKundli(
      'संकल्प',
      todayStr,
      timeStr,
      selectedCity.name,
      selectedCity.lat,
      selectedCity.lng
    );

    const jupPlanet = chart.planets.find(
      (p) => p.name === 'Jupiter' || p.hindiName === 'गुरु' || p.hindiName === 'बृहस्पति'
    );
    const brihaspatiRashi = jupPlanet?.signHindiName || 'वृषभ';

    const samvatsar = panchang.samvat.samvatsarName || 'रौद्र';
    const ayan = panchang.samvat.ayanam || 'दक्षिणायन';
    const ritu = panchang.samvat.ritu || 'हेमंत';
    const maas = panchang.samvat.chandraMaas || 'कार्तिक';
    const paksh = momentPanchang.tithiPaksha || panchang.tithi.paksha || 'कृष्ण पक्ष';
    const tithi = momentPanchang.tithiName || panchang.tithi.name || 'प्रतिपदा';
    const vaar = panchang.vara.name || 'गुरुवार';
    const nakshatra = momentPanchang.nakshatraName || panchang.nakshatra.name || 'अश्विनी';
    const yog = momentPanchang.yogaName || panchang.yoga.name || 'शुभ';
    const karan = momentPanchang.karanaName || panchang.karana.name || 'बव';
    const chandraRashi = momentPanchang.moonSign || panchang.sunMoon?.moonSign || 'मेष';
    const suryaRashi = momentPanchang.sunSign || panchang.sunMoon?.sunSign || 'तुला';

    const orderedItems = [
      { key: 'samvatsar', label: 'संवत्सर', value: samvatsar },
      { key: 'ayan', label: 'अयन', value: ayan },
      { key: 'ritu', label: 'ऋतु', value: ritu },
      { key: 'maas', label: 'मास', value: maas },
      { key: 'paksh', label: 'पक्ष (वर्तमान)', value: paksh },
      { key: 'tithi', label: 'तिथि (वर्तमान समय)', value: tithi },
      { key: 'vaar', label: 'वार', value: vaar },
      { key: 'nakshatra', label: 'नक्षत्र (वर्तमान समय)', value: nakshatra },
      { key: 'yog', label: 'योग (वर्तमान समय)', value: yog },
      { key: 'karan', label: 'करण (वर्तमान समय)', value: karan },
      { key: 'chandraRashi', label: 'चन्द्र राशि', value: chandraRashi },
      { key: 'suryaRashi', label: 'सूर्य राशि', value: suryaRashi },
      { key: 'brihaspatiRashi', label: 'बृहस्पति राशि', value: brihaspatiRashi }
    ];

    return {
      todayStr,
      samvatsar,
      ayan,
      ritu,
      maas,
      paksh,
      tithi,
      vaar,
      nakshatra,
      yog,
      karan,
      chandraRashi,
      suryaRashi,
      brihaspatiRashi,
      orderedItems
    };
  }, [selectedCity]);

  // Replace variable placeholders with live panchang values; optionally tagging with markers for teal highlighting
  const resolveTemplateVariables = (rawTemplate: string, forHighlight = false): string => {
    const wrap = (val: string) => (forHighlight ? `«TEAL»${val}«/TEAL»` : val);

    return rawTemplate
      .replace(/\{संवत्सर\}|\{samvatsar\}/g, wrap(liveSankalpData.samvatsar))
      .replace(/\{अयन\}|\{ayan\}/g, wrap(liveSankalpData.ayan))
      .replace(/\{ऋतु\}|\{ritu\}/g, wrap(liveSankalpData.ritu))
      .replace(/\{मास\}|\{maas\}/g, wrap(liveSankalpData.maas))
      .replace(/\{पक्ष\}|\{paksh\}/g, wrap(liveSankalpData.paksh))
      .replace(/\{तिथि\}|\{tithi\}/g, wrap(liveSankalpData.tithi))
      .replace(/\{वार\}|\{vaar\}/g, wrap(liveSankalpData.vaar))
      .replace(/\{नक्षत्र\}|\{nakshatra\}/g, wrap(liveSankalpData.nakshatra))
      .replace(/\{योग\}|\{yog\}/g, wrap(liveSankalpData.yog))
      .replace(/\{करण\}|\{karan\}/g, wrap(liveSankalpData.karan))
      .replace(/\{चन्द्र_राशि\}|\{chandraRashi\}|\{चन्द्रराशि\}/g, wrap(liveSankalpData.chandraRashi))
      .replace(/\{सूर्य_राशि\}|\{suryaRashi\}|\{सूर्यराशि\}/g, wrap(liveSankalpData.suryaRashi))
      .replace(/\{बृहस्पति_राशि\}|\{brihaspatiRashi\}|\{गुरु_राशि\}|\{बृहस्पतिराशि\}/g, wrap(liveSankalpData.brihaspatiRashi));
  };

  // Format text so [अमुक] is highlighted in saffron/orange AND dynamic panchang names are highlighted in teal
  const renderFormattedSankalp = (rawTemplate: string) => {
    const textWithVars = resolveTemplateVariables(rawTemplate, true);
    const regex = /(\[[^\]]+\]|«TEAL»[\s\S]*?«\/TEAL»)/g;
    const segments = textWithVars.split(regex);

    return segments.map((seg, idx) => {
      if (seg.startsWith('[') && seg.endsWith(']')) {
        return (
          <span key={idx} className="font-extrabold text-[#FF7F33] dark:text-[#ff9f66]">
            {seg}
          </span>
        );
      }
      if (seg.startsWith('«TEAL»') && seg.endsWith('«/TEAL»')) {
        const cleanVal = seg.replace(/«TEAL»|«\/TEAL»/g, '');
        return (
          <span
            key={idx}
            className="font-extrabold text-[#008080] dark:text-teal-400 underline decoration-teal-400/50 underline-offset-2 px-0.5"
          >
            {cleanVal}
          </span>
        );
      }
      return <React.Fragment key={idx}>{seg}</React.Fragment>;
    });
  };

  const handleCopyText = (rawTemplate: string, id: string) => {
    const textToCopy = resolveTemplateVariables(rawTemplate, false);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const generatedDocumentText = useMemo(() => {
    return `॥ श्री गणेशाय नमः ॥\n॥ वैदिक संकल्प-पत्रम् (स्थान: ${selectedCity.name} • दिनांक: ${formatToDdMmYyyy(liveSankalpData.todayStr)}) ॥\n\nॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य श्रीब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे जम्बूद्वीपे भरतखण्डे भारतवर्षे आर्यावर्तैकदेशान्तर्गते ${selectedCity.name} क्षेत्रे भागीरथी/पवित्रनदीप्रवाहे,\n\n• संवत्सर: ${liveSankalpData.samvatsar} नाम संवत्सरे\n• अयन एवं ऋतु: ${liveSankalpData.ayan}, ${liveSankalpData.ritu} ऋतौ\n• मास एवं पक्ष: महामंगल्यप्रदे मासोत्तमे ${liveSankalpData.maas} मासे, ${liveSankalpData.paksh}\n• तिथि एवं वार: ${liveSankalpData.tithi} तिथौ, ${liveSankalpData.vaar} वासरे\n• नक्षत्र, योग एवं करण: ${liveSankalpData.nakshatra} नक्षत्रे, ${liveSankalpData.yog} योगे, ${liveSankalpData.karan} करणे\n• ग्रह स्थिति: ${liveSankalpData.chandraRashi} राशिस्थिते चन्द्रे, ${liveSankalpData.suryaRashi} राशिस्थिते श्रीसूर्ये, ${liveSankalpData.brihaspatiRashi} राशिस्थिते देवगुरौ बृहस्पतौ शेषेषु ग्रहेषु यथायथं राशिस्थानस्थितेषु सत्सु,\n\nएवं ग्रहगुणविशेषणविशिष्टायां शुभपुण्यतिथौ —\n• गोत्र एवं प्रवर: "${yajmanGotra}" गोत्रोत्पन्नः (${yajmanPravar} प्रवरान्वितः)\n• मुख्य यजमान: "${yajmanName}" (${familyDetails})\n• संकल्प उद्देश्य / कामना: मम आत्मनः श्रुतिस्मृतिपुराणोक्तफलप्राप्त्यर्थं ${purposeHi} अद्य यथाशक्ति पूजनं / जपं / अनुष्ठानं अहं करिष्ये।`;
  }, [liveSankalpData, selectedCity.name, yajmanName, yajmanGotra, yajmanPravar, familyDetails, purposeHi]);

  const handleSaveGeneratedSankalpToLibrary = () => {
    togglePersonalLibraryBookmark({
      itemType: 'sankalp_doc',
      refId: `sankalp_doc_${Date.now()}`,
      title: `संकल्प पत्र — ${yajmanName} (${formatToDdMmYyyy(liveSankalpData.todayStr)})`,
      subtitle: `गोत्र: ${yajmanGotra} • स्थान: ${selectedCity.name}`,
      sanskritOrContent: generatedDocumentText,
      meaningOrNotes: `उद्देश्य: ${purposeHi}`
    });
    setSavedDocMsg('यह संकल्प पत्र "मेरा पुस्तकालय" में सफलतापूर्वक सहेज लिया गया है!');
    setTimeout(() => setSavedDocMsg(null), 3000);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
        {/* Row 1: Back and Close Buttons at Very Start of Card */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="पिछले पृष्ठ पर वापस जाएं"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="पेज बंद करें"
          >
            <X className="w-4 h-4" />
            <span>{dict.closePage || 'बंद करें'}</span>
          </button>
        </div>

        {/* Row 2: Title and Tagline */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Scroll className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {sankalpContent.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {sankalpContent.tagline}
            </p>
          </div>
        </div>

        {/* 4 Tabs: जानकारी, लघु संकल्प, विस्तृत संकल्प, संकल्प पत्र जनरेटर */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-center transition cursor-pointer truncate ${
              activeTab === 'info'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#008080]'
            }`}
          >
            <span>जानकारी</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laghu')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-center transition cursor-pointer truncate ${
              activeTab === 'laghu'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#008080]'
            }`}
          >
            <span>लघु संकल्प</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vistrit')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-center transition cursor-pointer truncate ${
              activeTab === 'vistrit'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#008080]'
            }`}
          >
            <span>विस्तृत संकल्प</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-center transition cursor-pointer truncate ${
              activeTab === 'generator'
                ? 'bg-[#FF7F33] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#FF7F33]'
            }`}
          >
            <span>संकल्प पत्र जनरेटर</span>
          </button>
        </div>
      </div>

      {/* TAB 1: जानकारी (Strictly ordered 13 items fetched live from panchang engine) */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 border border-[#008080]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                आज के 13 पंचांगीय अंग (संकल्प घटक)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                प्रत्येक दिन की प्रामाणिक खगोलीय स्थिति (स्थान: {selectedCity.name})
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#FF7F33]/15 text-[#FF7F33] dark:bg-[#FF7F33]/25 dark:text-[#ff9f66]">
              {formatToDdMmYyyy(liveSankalpData.todayStr)}
            </span>
          </div>

          <div className="divide-y divide-[#008080]/15 border border-[#008080]/20 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
            {liveSankalpData.orderedItems.map((item, index) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-4 py-3 text-xs sm:text-sm hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008080]/15 text-[#008080] dark:text-teal-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: लघु संकल्प */}
      {activeTab === 'laghu' && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 sm:p-6 border border-[#008080]/20 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {sankalpContent.laghuTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sankalpContent.laghuSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(sankalpContent.laghuText, 'laghu')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="संकल्प कॉपी करें"
            >
              {copiedKey === 'laghu' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>कॉपी हो गया!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>मंत्र कॉपी करें</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/20 font-sanskrit text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100 select-text">
            <p>{renderFormattedSankalp(sankalpContent.laghuText)}</p>
          </div>
        </div>
      )}

      {/* TAB 3: विस्तृत संकल्प */}
      {activeTab === 'vistrit' && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 sm:p-6 border border-[#008080]/20 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {sankalpContent.vistritTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sankalpContent.vistritSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(sankalpContent.vistritText, 'vistrit')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="संकल्प कॉपी करें"
            >
              {copiedKey === 'vistrit' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>कॉपी हो गया!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>मंत्र कॉपी करें</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/20 font-sanskrit text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100 select-text">
            <p>{renderFormattedSankalp(sankalpContent.vistritText)}</p>
          </div>
        </div>
      )}

      {/* TAB 4: संकल्प पत्र जनरेटर (Custom Sankalpa Document Generator) */}
      {activeTab === 'generator' && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 sm:p-6 border border-[#008080]/20 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#008080]/15 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF7F33]" />
                <span>व्यक्तिगत वैदिक संकल्प पत्र जनरेटर (Sankalpa Document Generator)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                अपना नाम, गोत्र, प्रवर व कामना भरें — वर्तमान समय के १३ पंचांग अंगों सहित पूर्ण संकल्प पत्र तैयार करें
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveGeneratedSankalpToLibrary}
                className="px-3 py-1.5 rounded-xl bg-[#008080] hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>मेरा पुस्तकालय में सहेजें</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-[#FF7F33] hover:bg-[#e56b20] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट / PDF</span>
              </button>
            </div>
          </div>

          {savedDocMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              {savedDocMsg}
            </div>
          )}

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                यजमान का नाम (Yajman Name)
              </label>
              <input
                type="text"
                value={yajmanName}
                onChange={(e) => setYajmanName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                गोत्र (Gotra)
              </label>
              <input
                type="text"
                value={yajmanGotra}
                onChange={(e) => setYajmanGotra(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                प्रवर / शाखा (Pravar)
              </label>
              <input
                type="text"
                value={yajmanPravar}
                onChange={(e) => setYajmanPravar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                परिवार विवरण (Family Details)
              </label>
              <input
                type="text"
                value={familyDetails}
                onChange={(e) => setFamilyDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              पूजा उद्देश्य / संकल्प कामना (Purpose)
            </label>
            <input
              type="text"
              value={purposeHi}
              onChange={(e) => setPurposeHi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* Generated Document Preview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border-2 border-[#008080]/30 space-y-2">
            <pre className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-sans leading-relaxed">
              {generatedDocumentText}
            </pre>
          </div>
        </div>
      )}

      {/* Standalone Notes Section Outside and Below the Card */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 border border-[#008080]/20 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#FF7F33]" />
          <span>संकल्प विधि एवं आवश्यक मार्गदर्शिका (विशेष नोट)</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-[#FF7F33]/25 space-y-1">
            <h4 className="font-bold text-[#FF7F33]">
              {sankalpContent.note1Title}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {sankalpContent.note1Text}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-[#008080]/20 space-y-1">
            <h4 className="font-bold text-[#008080] dark:text-teal-300">
              {sankalpContent.note2Title}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {sankalpContent.note2Text}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              {sankalpContent.note3Title}
            </h4>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {sankalpContent.note3Text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

