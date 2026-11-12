import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  X,
  Lock,
  Eye,
  Database,
  Mail,
  FileText,
  UserCheck
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import { getSiteContent, PrivacyPolicyContentConfig } from '../services/siteContentService';

interface PrivacyPolicyViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  // Managed content from Admin Panel
  const [privacyContent, setPrivacyContent] = useState<PrivacyPolicyContentConfig>(
    () => getSiteContent().privacy
  );

  useEffect(() => {
    const handleContentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.privacy) {
        setPrivacyContent(customEvent.detail.privacy);
      } else {
        setPrivacyContent(getSiteContent().privacy);
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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {privacyContent.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {privacyContent.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-5 sm:p-6 border border-[#008080]/20 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/25 border border-[#008080]/25 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#008080] dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-900 dark:text-white font-bold">
              {privacyContent.badgeText}
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              अंतिम अद्यतन: <strong>{privacyContent.lastUpdated}</strong> • JyotishWala मंच
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#008080]" />
            <span>{privacyContent.section1Title}</span>
          </h2>
          <p className="whitespace-pre-line">{privacyContent.section1Text}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#008080]" />
            <span>{privacyContent.section2Title}</span>
          </h2>
          <p className="whitespace-pre-line">{privacyContent.section2Text}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#008080]" />
            <span>{privacyContent.section3Title}</span>
          </h2>
          <p className="whitespace-pre-line">{privacyContent.section3Text}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#008080]" />
            <span>{privacyContent.section4Title}</span>
          </h2>
          <p className="whitespace-pre-line">{privacyContent.section4Text}</p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#008080]/15">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#FF7F33]" />
            <span>{privacyContent.section5Title}</span>
          </h2>
          <p className="whitespace-pre-line">{privacyContent.section5Text}</p>
          <div className="pt-2">
            <a
              href={`mailto:${privacyContent.contactEmail}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-[#008080]/30 text-[#008080] dark:text-teal-300 font-bold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{privacyContent.contactEmail}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
