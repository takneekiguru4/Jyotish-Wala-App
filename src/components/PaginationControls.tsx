import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  centered?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemLabel = 'प्रविष्टियां',
  centered = false
}) => {
  if (totalItems <= pageSize) return null;

  const totalPages = Math.ceil(totalItems / pageSize);
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      className={
        centered
          ? 'flex flex-col items-center justify-center gap-2.5 text-xs text-center'
          : 'pt-3.5 mt-3 border-t border-[#008080]/15 flex flex-wrap items-center justify-between gap-3 text-xs'
      }
    >
      <div className="text-slate-600 dark:text-slate-400 font-semibold">
        कुल <span className="font-extrabold text-[#008080] dark:text-teal-300">{totalItems}</span> {itemLabel} में से{' '}
        <span className="font-extrabold text-slate-900 dark:text-white">
          {startIdx}–{endIdx}
        </span>{' '}
        प्रदर्शित (पृष्ठ {safePage}/{totalPages})
      </div>

      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>पिछला</span>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-xl font-extrabold flex items-center justify-center transition cursor-pointer ${
              p === safePage
                ? 'bg-[#008080] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
        >
          <span>अगला</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
