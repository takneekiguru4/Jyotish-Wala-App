import React, { useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Sparkles,
  Calendar,
  Orbit,
  Clock,
  BookOpen,
  Flame
} from 'lucide-react';
import { PushNotification } from '../types';

export interface NotificationTopicPrefs {
  panchang: boolean;
  muhurat: boolean;
  horoscope: boolean;
  transit: boolean;
  festival: boolean;
  articles: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationTopicPrefs = {
  panchang: true,
  muhurat: true,
  horoscope: true,
  transit: true,
  festival: true,
  articles: false
};

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  prefs: NotificationTopicPrefs;
  onTogglePref: (key: keyof NotificationTopicPrefs) => void;
  onMarkAllRead: () => void;
}

const TOPIC_LIST: {
  key: keyof NotificationTopicPrefs;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    key: 'panchang',
    title: 'दैनिक पंचांग एवं तिथि अपडेट',
    subtitle: 'प्रातःकालीन तिथि, नक्षत्र, योग एवं करण की सूचना',
    icon: Calendar
  },
  {
    key: 'muhurat',
    title: 'शुभ मुहूर्त एवं राहुकाल अलर्ट',
    subtitle: 'अभिजीत मुहूर्त, चौघड़िया एवं राहुकाल सचेतक',
    icon: Clock
  },
  {
    key: 'horoscope',
    title: 'दैनिक एवं मासिक राशिफल',
    subtitle: 'राशि के अनुसार दैनिक भविष्यफल की सूचना',
    icon: Sparkles
  },
  {
    key: 'transit',
    title: 'ग्रह गोचर एवं राशि परिवर्तन',
    subtitle: 'नवग्रहों के राशि परिवर्तन एवं वक्री/मार्गी अपडेट',
    icon: Orbit
  },
  {
    key: 'festival',
    title: 'प्रमुख व्रत, एकादशी एवं पर्व',
    subtitle: 'एकादशी, प्रदोष, अमावस्या एवं पूर्णिमा व्रत अनुस्मारक',
    icon: Flame
  },
  {
    key: 'articles',
    title: 'नए ज्योतिष एवं वास्तु लेख',
    subtitle: 'नए ज्योतिषीय लेख प्रकाशित होने पर सूचना',
    icon: BookOpen
  }
];

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  prefs,
  onTogglePref,
  onMarkAllRead
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = (category: PushNotification['category']) => {
    switch (category) {
      case 'muhurat':
        return <Clock className="w-4 h-4 text-[#FF7F33]" />;
      case 'panchang':
        return <Calendar className="w-4 h-4 text-[#008080]" />;
      case 'transit':
        return <Orbit className="w-4 h-4 text-[#FF7F33]" />;
      case 'festival':
        return <Flame className="w-4 h-4 text-[#FF7F33]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#008080]" />;
    }
  };

  const visibleNotifications = notifications.filter((n) => prefs[n.category] !== false);
  const enabledCount = Object.values(prefs).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-end p-3 sm:p-4 pt-16 overscroll-none"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#112226] rounded-2xl max-w-md w-full border border-[#008080]/30 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 py-3.5 bg-[#008080] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF7F33]" />
            <div>
              <h3 className="text-sm font-bold leading-tight">सूचना केंद्र एवं सेटिंग्स</h3>
              <p className="text-[10px] text-teal-100">
                {enabledCount} विषय सक्रिय • अपनी पसंद के अनुसार टॉगल ऑन/ऑफ करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-[#FF7F33] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>बंद करें</span>
          </button>
        </div>

        {/* Scrollable Content (Overscroll Contained) */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-[#008080]/15">
          {/* Section 1: Notification Topic Checklist with Toggle Switches */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-[#008080] dark:text-teal-300 uppercase tracking-wider">
                सूचना विषय सूची (टॉगल स्विच)
              </h4>
              <span className="text-[10px] font-bold text-slate-400">
                ऑन / ऑफ
              </span>
            </div>

            <div className="space-y-2">
              {TOPIC_LIST.map((topic) => {
                const Icon = topic.icon;
                const isOn = prefs[topic.key];
                return (
                  <div
                    key={topic.key}
                    onClick={() => onTogglePref(topic.key)}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer select-none ${
                      isOn
                        ? 'bg-teal-50/60 dark:bg-teal-950/30 border-[#008080]/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isOn
                            ? 'bg-[#008080] text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {topic.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {topic.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePref(topic.key);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isOn ? 'bg-[#008080]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Active Notifications Feed */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                प्राप्त सूचनाएं ({visibleNotifications.length})
              </h4>
              {visibleNotifications.length > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] font-bold text-[#008080] dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> सभी पठित करें
                </button>
              )}
            </div>

            {visibleNotifications.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-500">
                चयनित विषयों के लिए अभी कोई नई सूचना नहीं है। ऊपर टॉगल स्विच ऑन करें।
              </div>
            ) : (
              <div className="space-y-2">
                {visibleNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 transition ${
                      !n.read
                        ? 'bg-teal-50/40 dark:bg-teal-950/20 border-[#008080]/25'
                        : 'bg-slate-50/60 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-[#008080]/15 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-[#008080]/15 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold cursor-pointer transition"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
