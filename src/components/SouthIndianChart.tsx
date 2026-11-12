/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KundliChartData } from '../types';

interface SouthIndianChartProps {
  chartData: KundliChartData;
  title?: string;
  size?: number;
}

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  chartData,
  title = 'दक्षिण भारतीय कुण्डली (South Indian Chart)',
  size = 360
}) => {
  // Sign index to fixed South Indian grid position (0 to 11)
  // 11: Pisces (top-left) -> 0: Aries (top-mid-left) -> 1: Taurus (top-mid-right) -> 2: Gemini (top-right)
  // 3: Cancer, 4: Leo, 5: Virgo, 6: Libra, 7: Scorpio, 8: Sagittarius, 9: Capricorn, 10: Aquarius
  const signPlanets: Record<number, string[]> = {};
  for (let i = 0; i < 12; i++) signPlanets[i] = [];

  chartData.planets.forEach((p) => {
    if (signPlanets[p.signIndex]) {
      signPlanets[p.signIndex].push(p.hindiName);
    }
  });

  const cells = [
    { sign: 11, label: 'मीन (Pisces)', row: 0, col: 0 },
    { sign: 0, label: 'मेष (Aries)', row: 0, col: 1 },
    { sign: 1, label: 'वृषभ (Taurus)', row: 0, col: 2 },
    { sign: 2, label: 'मिथुन (Gemini)', row: 0, col: 3 },
    { sign: 10, label: 'कुम्भ (Aquarius)', row: 1, col: 0 },
    { sign: -1, label: 'मध्य', row: 1, col: 1, isCenter: true },
    { sign: -1, label: 'मध्य', row: 1, col: 2, isCenter: true },
    { sign: 3, label: 'कर्क (Cancer)', row: 1, col: 3 },
    { sign: 9, label: 'मकर (Capricorn)', row: 2, col: 0 },
    { sign: -1, label: 'मध्य', row: 2, col: 1, isCenter: true },
    { sign: -1, label: 'मध्य', row: 2, col: 2, isCenter: true },
    { sign: 4, label: 'सिंह (Leo)', row: 2, col: 3 },
    { sign: 8, label: 'धनु (Sagittarius)', row: 3, col: 0 },
    { sign: 7, label: 'वृश्चिक (Scorpio)', row: 3, col: 1 },
    { sign: 6, label: 'तुला (Libra)', row: 3, col: 2 },
    { sign: 5, label: 'कन्या (Virgo)', row: 3, col: 3 },
  ];

  return (
    <div className="flex flex-col items-center">
      {title && (
        <div className="text-xs font-semibold tracking-wider uppercase mb-2 text-teal-700 dark:text-teal-300">
          {title}
        </div>
      )}
      <div
        style={{ width: size, height: size }}
        className="grid grid-cols-4 grid-rows-4 border-2 border-teal-700 dark:border-teal-400 bg-white dark:bg-[#112226] rounded-xl overflow-hidden shadow-md"
      >
        {cells.map((cell, idx) => {
          if (cell.isCenter) {
            // Render only once for the 2x2 central box
            if (cell.row === 1 && cell.col === 1) {
              return (
                <div
                  key="center"
                  className="col-span-2 row-span-2 flex flex-col items-center justify-center p-2 bg-amber-50/30 dark:bg-teal-950/20 border border-teal-500/20 text-center"
                >
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-200">
                    {chartData.name || 'जातक'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {chartData.birthDate} | {chartData.birthTime}
                  </span>
                  <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 mt-1">
                    लग्न: {chartData.houses[1]?.signName}
                  </span>
                </div>
              );
            }
            return null;
          }

          const planetsInCell = signPlanets[cell.sign] || [];
          const isLagnaSign = chartData.lagnaSign - 1 === cell.sign;

          return (
            <div
              key={idx}
              className={`border border-teal-600/30 dark:border-teal-400/30 p-1 flex flex-col justify-between text-xs transition-colors hover:bg-teal-500/10 ${
                isLagnaSign ? 'bg-orange-500/10 dark:bg-orange-950/20' : ''
              }`}
            >
              <div className="flex justify-between items-start text-[9px] font-medium text-slate-500 dark:text-slate-400">
                <span>{cell.label.split(' ')[0]}</span>
                {isLagnaSign && (
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-[10px]">
                    लग्न
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {planetsInCell.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-bold text-teal-900 dark:text-teal-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
