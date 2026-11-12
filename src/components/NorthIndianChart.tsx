/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KundliChartData, LanguageCode } from '../types';
import { trTerm } from '../i18n/translations';

interface NorthIndianChartProps {
  chartData: KundliChartData;
  title?: string;
  size?: number;
  chartType?: 'lagna' | 'chandra' | 'navamsha' | 'dashamsha' | 'hora';
  currentLang?: LanguageCode;
  hideNote?: boolean;
}

const HOUSE_COORDS: Record<number, { signX: number; signY: number; planetX: number; planetY: number }> = {
  1:  { signX: 200, signY: 162, planetX: 200, planetY: 100 },
  2:  { signX: 100, signY: 74,  planetX: 100, planetY: 38  },
  3:  { signX: 70,  signY: 105, planetX: 36,  planetY: 105 },
  4:  { signX: 158, signY: 200, planetX: 100, planetY: 200 },
  5:  { signX: 70,  signY: 295, planetX: 36,  planetY: 295 },
  6:  { signX: 100, signY: 326, planetX: 100, planetY: 365 },
  7:  { signX: 200, signY: 238, planetX: 200, planetY: 300 },
  8:  { signX: 300, signY: 326, planetX: 300, planetY: 365 },
  9:  { signX: 330, signY: 295, planetX: 364, planetY: 295 },
  10: { signX: 242, signY: 200, planetX: 300, planetY: 200 },
  11: { signX: 330, signY: 105, planetX: 364, planetY: 105 },
  12: { signX: 300, signY: 74,  planetX: 300, planetY: 38  },
};

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  chartData,
  title = 'लग्न कुंडली',
  size = 380,
  chartType = 'lagna',
  currentLang = 'hi',
  hideNote = true
}) => {
  const activeHouses =
    chartType === 'chandra'
      ? chartData.chandraHouses
      : chartType === 'navamsha'
      ? chartData.navamshaHouses
      : chartType === 'dashamsha' && chartData.dashamshaHouses
      ? chartData.dashamshaHouses
      : chartType === 'hora' && chartData.horaHouses
      ? chartData.horaHouses
      : chartData.houses;

  // Lookup map from chartData.planets so even older saved charts get ^ for Vakri and * for Ast
  const planetStatusLookup: Record<string, { isRetro: boolean; isCombust: boolean }> = {};
  (chartData.planets || []).forEach((p) => {
    planetStatusLookup[p.hindiName] = {
      isRetro: Boolean(p.isRetrograde),
      isCombust: Boolean(p.isCombust)
    };
  });

  const parsePlanetWithSymbols = (rawPlanet: string): { baseName: string; symbols: string } => {
    const clean = rawPlanet.replace(/\s*\([^)]*\)/g, '').trim();
    const match = clean.match(/([\^*]+)$/);
    const existingSymbols = match ? match[1] : '';
    const baseHindi = existingSymbols ? clean.slice(0, -existingSymbols.length).trim() : clean;

    let finalSymbols = existingSymbols;
    if (!finalSymbols && planetStatusLookup[baseHindi]) {
      if (planetStatusLookup[baseHindi].isRetro) finalSymbols += '^';
      if (planetStatusLookup[baseHindi].isCombust) finalSymbols += '*';
    }

    return {
      baseName: trTerm(baseHindi, currentLang),
      symbols: finalSymbols
    };
  };

  return (
    <div className="flex flex-col items-center w-full">
      {title && (
        <div className="mb-2.5 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FF7F33]" />
          <h4 className="text-sm font-bold text-[#008080] dark:text-teal-300 tracking-wide">
            {title}
          </h4>
          <span className="h-2 w-2 rounded-full bg-[#FF7F33]" />
        </div>
      )}

      <div
        className="relative bg-[#FAF7F2] dark:bg-[#0D1B1E] rounded-lg overflow-hidden w-full"
        style={{ maxWidth: size }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-auto select-none block"
          aria-label={title}
        >
          {/* Single Outer Square Frame */}
          <rect
            x="2"
            y="2"
            width="396"
            height="396"
            fill="none"
            stroke="#008080"
            strokeWidth="3"
          />

          {/* Diagonal Cross Lines */}
          <line x1="2" y1="2" x2="398" y2="398" stroke="#008080" strokeWidth="2.2" />
          <line x1="398" y1="2" x2="2" y2="398" stroke="#008080" strokeWidth="2.2" />

          {/* Central Diamond (Kendra Houses) */}
          <polygon
            points="200,2 2,200 200,398 398,200"
            fill="none"
            stroke="#008080"
            strokeWidth="2.5"
          />

          {/* Render 12 Bhavas (Houses) */}
          {Object.entries(HOUSE_COORDS).map(([houseStr, coords]) => {
            const houseNum = Number(houseStr);
            const houseInfo = activeHouses?.[houseNum];
            if (!houseInfo) return null;

            const planets = houseInfo.planets || [];

            return (
              <g key={houseNum}>
                {/* Rashi Number Badge */}
                <circle
                  cx={coords.signX}
                  cy={coords.signY - 4}
                  r="10"
                  fill="#FF7F33"
                  fillOpacity="0.16"
                />
                <text
                  x={coords.signX}
                  y={coords.signY}
                  textAnchor="middle"
                  fill="#FF7F33"
                  fontSize="11.5"
                  fontWeight="800"
                >
                  {houseInfo.signIndex}
                </text>

                {/* Planets in Bhava with ^ (Vakri) and * (Ast) above the planet name */}
                {planets.length === 0 ? null : (
                  <g>
                    {planets.map((p, idx) => {
                      const offsetY = (idx - (planets.length - 1) / 2) * 15;
                      const parsed = parsePlanetWithSymbols(p);
                      return (
                        <text
                          key={`${houseNum}-${idx}`}
                          x={coords.planetX}
                          y={coords.planetY + offsetY}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          className="fill-slate-900 dark:fill-amber-100"
                        >
                          <tspan>{parsed.baseName}</tspan>
                          {parsed.symbols && (
                            <tspan
                              dy="-4"
                              dx="1"
                              fontSize="10"
                              fontWeight="900"
                              fill="#FF7F33"
                            >
                              {parsed.symbols}
                            </tspan>
                          )}
                        </text>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}

          {/* Lagna Marker in 1st House */}
          <text
            x="200"
            y="44"
            textAnchor="middle"
            fill="#008080"
            fontSize="10"
            fontWeight="800"
            opacity="0.85"
          >
            {chartType === 'chandra'
              ? trTerm('चन्द्र', currentLang)
              : chartType === 'navamsha'
              ? 'नवांश'
              : chartType === 'dashamsha'
              ? 'दशमांश'
              : chartType === 'hora'
              ? 'होरा'
              : trTerm('लग्न', currentLang)}
          </text>
        </svg>
      </div>

      {/* Explanatory Footer Note at the Bottom of Every Kundli Chart */}
      {!hideNote && (
        <div
          className="mt-2.5 w-full rounded-xl bg-amber-50/90 dark:bg-slate-900/90 border border-[#FF7F33]/35 px-3 py-2 text-center shadow-2xs"
          style={{ maxWidth: size }}
        >
          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
            <span className="text-[#FF7F33] font-extrabold">नोट:</span> ग्रह के नाम के ऊपर{' '}
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-[#FF7F33]/15 text-[#FF7F33] font-mono font-black">
              ^
            </span>{' '}
            चिह्न का अर्थ <strong className="text-[#008080] dark:text-teal-300">&lsquo;वक्री ग्रह&rsquo;</strong> है तथा{' '}
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-[#FF7F33]/15 text-[#FF7F33] font-mono font-black">
              *
            </span>{' '}
            चिह्न का अर्थ <strong className="text-[#FF7F33]">&lsquo;अस्त ग्रह&rsquo;</strong> है।
          </p>
        </div>
      )}
    </div>
  );
};
