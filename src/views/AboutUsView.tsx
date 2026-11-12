import React, { useState, useEffect } from 'react';
import {
  Info,
  ArrowLeft,
  X,
  Mail,
  Sparkles,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Globe,
  BookOpen
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import { getSiteContent, AboutUsContentConfig } from '../services/siteContentService';

interface AboutUsViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  onNavigate?: (screen: string) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack,
  onNavigate
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  // Managed content from Admin Panel
  const [aboutContent, setAboutContent] = useState<AboutUsContentConfig>(
    () => getSiteContent().about
  );

  useEffect(() => {
    const handleContentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.about) {
        setAboutContent(customEvent.detail.about);
      } else {
        setAboutContent(getSiteContent().about);
      }
    };
    window.addEventListener('jyotishwala_site_content_changed', handleContentUpdate);
    return () => {
      window.removeEventListener('jyotishwala_site_content_changed', handleContentUpdate);
    };
  }, []);

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

        {/* Row 2: Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Info className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {aboutContent.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {aboutContent.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card: App Information, Vision, Core Pillars & Purpose */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 sm:p-6 border border-[#008080]/20 shadow-xs space-y-6">
        {/* SECTION 1: Introduction to JyotishWala App */}
        <section className="space-y-2.5">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#008080]" />
            <span>{aboutContent.introTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {aboutContent.introText}
          </p>
        </section>

        {/* SECTION 2: Our Purpose & Vision */}
        <section className="space-y-2.5 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/25 border border-[#008080]/20">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF7F33]" />
            <span>{aboutContent.missionTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {aboutContent.missionText}
          </p>
        </section>

        {/* SECTION 3: Core Pillars */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#008080]" />
            <span>{aboutContent.pillarsTitle}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/15 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#008080]" />
                <span>{aboutContent.pillar1Title}</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal whitespace-pre-line">
                {aboutContent.pillar1Text}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/15 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#008080]" />
                <span>{aboutContent.pillar2Title}</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal whitespace-pre-line">
                {aboutContent.pillar2Text}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/15 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#FF7F33]" />
                <span>{aboutContent.pillar3Title}</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal whitespace-pre-line">
                {aboutContent.pillar3Text}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Tradition & Modern Technology */}
        <section className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#008080]" />
            <span>{aboutContent.traditionTitle}</span>
          </h3>
          <p className="whitespace-pre-line">{aboutContent.traditionText}</p>
        </section>

        {/* SECTION 5: Academic Foundation & Contact Info Footer */}
        <div className="pt-4 border-t border-[#008080]/15 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span>संस्थान: <strong>JyotishWala (ज्योतिषवाला)</strong></span>
            <span className="mx-2">•</span>
            <span>निदेशन: <strong>{aboutContent.founderName}</strong> ({aboutContent.education}, {aboutContent.university})</span>
          </div>

          <a
            href={`mailto:${aboutContent.contactEmail}`}
            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-[#008080]/30 hover:bg-[#008080] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Mail className="w-3.5 h-3.5 text-[#008080]" />
            <span>{aboutContent.contactEmail}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
