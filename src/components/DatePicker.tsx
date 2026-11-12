import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface DatePickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (isoDate: string) => void;
  className?: string;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  placeholder?: string;
  disabled?: boolean;
}

const MONTH_NAMES_HI = [
  'जनवरी',
  'फ़रवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितम्बर',
  'अक्टूबर',
  'नवम्बर',
  'दिसम्बर'
];

const WEEKDAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

/**
 * Parses an ISO date (YYYY-MM-DD) into day, month (1-12), year.
 */
function parseIsoDate(iso: string): { day: number; month: number; year: number } | null {
  if (!iso) return null;
  const parts = iso.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return { year: y, month: m, day: d };
    }
  }
  return null;
}

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY.
 */
export function formatToDdMmYyyy(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso || '';
  const d = String(parsed.day).padStart(2, '0');
  const m = String(parsed.month).padStart(2, '0');
  return `${d}/${m}/${parsed.year}`;
}

/**
 * Converts DD/MM/YYYY back to ISO YYYY-MM-DD if valid.
 */
export function parseDdMmYyyyToIso(ddmmyyyy: string): string | null {
  const clean = ddmmyyyy.trim();
  const match = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;

  // Days in month validation
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  min,
  max,
  placeholder = 'DD/MM/YYYY',
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Text input display in DD/MM/YYYY format
  const [inputText, setInputText] = useState(() => formatToDdMmYyyy(value));

  // Calendar navigation state
  const initialParsed = parseIsoDate(value) || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  const [viewYear, setViewYear] = useState(initialParsed.year);
  const [viewMonth, setViewMonth] = useState(initialParsed.month); // 1-12

  // Sync displayed text if value prop changes externally
  useEffect(() => {
    setInputText(formatToDdMmYyyy(value));
    const p = parseIsoDate(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Close calendar popup when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle manual typing in DD/MM/YYYY format with auto-formatting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Remove non-digit and non-slash characters
    raw = raw.replace(/[^\d/]/g, '');

    // Auto-insert slash after day and month if typing pure digits
    const digitsOnly = raw.replace(/\D/g, '');
    let formatted = raw;
    if (digitsOnly.length >= 5) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
    } else if (digitsOnly.length >= 3) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    }

    setInputText(formatted);

    // If a full valid DD/MM/YYYY is entered, update parent
    if (digitsOnly.length === 8) {
      const iso = parseDdMmYyyyToIso(formatted);
      if (iso) {
        onChange(iso);
        const p = parseIsoDate(iso);
        if (p) {
          setViewYear(p.year);
          setViewMonth(p.month);
        }
      }
    }
  };

  const handleInputBlur = () => {
    // If invalid on blur, reset to current valid value
    const iso = parseDdMmYyyyToIso(inputText);
    if (iso) {
      onChange(iso);
    } else {
      setInputText(formatToDdMmYyyy(value));
    }
  };

  // Calendar Navigation
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const iso = `${viewYear}-${mm}-${dd}`;
    onChange(iso);
    setInputText(`${dd}/${mm}/${viewYear}`);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date(Date.now() + 5.5 * 3600 * 1000);
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const iso = `${y}-${mm}-${dd}`;

    setViewYear(y);
    setViewMonth(m);
    onChange(iso);
    setInputText(`${dd}/${mm}/${y}`);
    setIsOpen(false);
  };

  // Generate Year Options for fast jumping (1920 to 2035)
  const years = [];
  const currentYr = new Date().getFullYear();
  for (let y = currentYr + 10; y >= 1920; y--) {
    years.push(y);
  }

  // Days in selected view month
  const daysInViewMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0 is Sun

  const parsedCurrentVal = parseIsoDate(value);

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Input Box with DD/MM/YYYY text entry + Calendar Trigger Button */}
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={inputText}
          onClick={() => !disabled && setIsOpen(true)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={10}
          className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm font-bold font-mono tracking-wide bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 hover:border-[#008080] focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 text-slate-800 dark:text-slate-100 rounded-xl outline-none transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          title="दिनांक दर्ज करें या कैलेंडर से चुनें (प्रारूप: DD/MM/YYYY)"
        />

        {/* Left Calendar Icon - Click to toggle calendar */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute left-2.5 p-0.5 text-[#008080] dark:text-teal-400 hover:text-[#FF7F33] transition cursor-pointer disabled:cursor-not-allowed"
          title="कैलेंडर खोलें"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>

        {/* Right Calendar Toggle Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-[#008080] dark:hover:text-teal-400 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
          title="कैलेंडर से तारीख चुनें"
        >
          <CalendarIcon className="w-4 h-4 text-[#008080] dark:text-teal-400" />
        </button>
      </div>

      {/* Robust Interactive Calendar Popup (Works in All iFrames & Browsers) */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-[#112226] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-[#008080]/30 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
          {/* Header: Month & Year Selectors + Arrows */}
          <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-[#008080]/15 mb-2.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="पिछला महीना"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
              >
                {MONTH_NAMES_HI.map((mName, idx) => (
                  <option key={idx} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-bold font-mono bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="अगला महीना"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels (Sun to Sat) */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
            {WEEKDAYS_HI.map((w, idx) => (
              <div key={idx} className={idx === 0 ? 'text-[#FF7F33]' : ''}>
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}

            {/* Days 1 to 31 */}
            {Array.from({ length: daysInViewMonth }).map((_, idx) => {
              const day = idx + 1;
              const isSelected =
                parsedCurrentVal &&
                parsedCurrentVal.year === viewYear &&
                parsedCurrentVal.month === viewMonth &&
                parsedCurrentVal.day === day;

              const isSunday = (firstDayOfWeek + idx) % 7 === 0;
              const dayIso = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isBeforeMin = min ? dayIso < min : false;
              const isAfterMax = max ? dayIso > max : false;
              const isDayDisabled = isBeforeMin || isAfterMax;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDayDisabled}
                  onClick={() => !isDayDisabled && handleSelectDay(day)}
                  className={`h-8 rounded-xl text-xs font-bold font-mono flex items-center justify-center transition cursor-pointer ${
                    isDayDisabled
                      ? 'opacity-25 cursor-not-allowed text-slate-400'
                      : isSelected
                      ? 'bg-[#008080] text-white shadow-xs font-extrabold scale-105'
                      : isSunday
                      ? 'text-[#FF7F33] hover:bg-orange-50 dark:hover:bg-orange-950/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-[#008080]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Bottom Footer: Format reminder, Today button, Close */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#008080]/15 text-xs">
            <span className="text-[10px] font-bold font-mono text-slate-400">
              प्रारूप: DD/MM/YYYY
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSelectToday}
                className="px-2.5 py-1 rounded-lg bg-[#FF7F33] text-white font-bold text-[11px] hover:bg-[#e06622] transition cursor-pointer"
              >
                आज (Today)
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                title="कैलेंडर बंद करें"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
