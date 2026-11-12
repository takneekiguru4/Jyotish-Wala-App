/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { DashaPeriodItem, KundliChartData } from '../types';
import { generateKundli } from '../services/astrologyEngine';

const HOUSE_COORDS_NORM: Record<
  number,
  { signX: number; signY: number; planetX: number; planetY: number }
> = {
  1: { signX: 200, signY: 162, planetX: 200, planetY: 102 },
  2: { signX: 100, signY: 74, planetX: 100, planetY: 38 },
  3: { signX: 70, signY: 105, planetX: 38, planetY: 105 },
  4: { signX: 158, signY: 200, planetX: 98, planetY: 200 },
  5: { signX: 70, signY: 295, planetX: 38, planetY: 295 },
  6: { signX: 100, signY: 326, planetX: 100, planetY: 365 },
  7: { signX: 200, signY: 238, planetX: 200, planetY: 300 },
  8: { signX: 300, signY: 326, planetX: 300, planetY: 365 },
  9: { signX: 330, signY: 295, planetX: 362, planetY: 295 },
  10: { signX: 242, signY: 200, planetX: 302, planetY: 200 },
  11: { signX: 330, signY: 105, planetX: 362, planetY: 105 },
  12: { signX: 300, signY: 74, planetX: 300, planetY: 38 }
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string | CanvasGradient,
  stroke?: string,
  lineWidth = 1
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawCleanPageFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  pageNum: number,
  totalPages: number
) {
  // Soft Warm Ivory Page Background
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, W, H);

  // Single Subtle Outer Page Line
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Minimal Clean Footer Text (Large Font)
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    'JyotishWala — प्रमाणिक वैदिक पंचांग एवं कुंडली सेवा (ऋषिकेश, उत्तराखंड)',
    52,
    H - 44
  );

  ctx.fillStyle = '#008080';
  ctx.textAlign = 'right';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`पृष्ठ ${pageNum} / ${totalPages}`, W - 52, H - 44);
}

function drawSimpleSectionHeading(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  title: string,
  rightText?: string
) {
  ctx.fillStyle = '#008080';
  ctx.font = 'bold 29px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x, y);

  if (rightText) {
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 21px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rightText, x + w, y);
  }

  // Subtle 1.5px divider line below heading
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 15);
  ctx.lineTo(x + w, y + 15);
  ctx.stroke();
}

function drawNorthIndianKundliOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  title: string,
  centerLabel: string,
  houses: Record<number, { signIndex: number; planets: string[] }> | undefined,
  planetStatusLookup: Record<string, { isRetro: boolean; isCombust: boolean }>
) {
  // Large Clean Title Above Chart (No background box or border)
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + size / 2, y + 34);

  // Full-width square chart so both charts look noticeably larger while staying side-by-side
  const sX = x;
  const sY = y + 52;
  const sW = size;

  // Single Clean Outer Square Frame
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(sX, sY, sW, sW);
  ctx.strokeStyle = '#008080';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(sX, sY, sW, sW);

  // Diagonals
  ctx.beginPath();
  ctx.moveTo(sX, sY);
  ctx.lineTo(sX + sW, sY + sW);
  ctx.moveTo(sX + sW, sY);
  ctx.lineTo(sX, sY + sW);
  ctx.stroke();

  // Central Diamond
  ctx.beginPath();
  ctx.moveTo(sX + sW / 2, sY);
  ctx.lineTo(sX, sY + sW / 2);
  ctx.lineTo(sX + sW / 2, sY + sW);
  ctx.lineTo(sX + sW, sY + sW / 2);
  ctx.closePath();
  ctx.stroke();

  const scale = sW / 400;

  // Simple Large Text for 'लग्न' or 'नवांश' (NO background box, NO border)
  ctx.fillStyle = '#008080';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(centerLabel, sX + 200 * scale, sY + 46 * scale);

  // Draw 12 Houses
  Object.entries(HOUSE_COORDS_NORM).forEach(([houseStr, coords]) => {
    const hNum = Number(houseStr);
    const houseInfo = houses?.[hNum];
    if (!houseInfo) return;

    const rX = sX + coords.signX * scale;
    const rY = sY + coords.signY * scale;

    // Large Simple Rashi Number
    ctx.fillStyle = '#FF7F33';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(houseInfo.signIndex), rX, rY);

    // Large Planets in House
    const pList = houseInfo.planets || [];
    pList.forEach((rawP, idx) => {
      const clean = rawP.replace(/\s*\([^)]*\)/g, '').trim();
      const match = clean.match(/([\^*]+)$/);
      let symbols = match ? match[1] : '';
      const baseHindi = symbols ? clean.slice(0, -symbols.length).trim() : clean;
      if (!symbols && planetStatusLookup[baseHindi]) {
        if (planetStatusLookup[baseHindi].isRetro) symbols += '^';
        if (planetStatusLookup[baseHindi].isCombust) symbols += '*';
      }

      const pX = sX + coords.planetX * scale;
      const offsetY = (idx - (pList.length - 1) / 2) * 24 * scale;
      const pY = sY + coords.planetY * scale + offsetY;

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 25px sans-serif';
      ctx.textAlign = 'center';
      const displayStr = symbols ? `${baseHindi}${symbols}` : baseHindi;
      ctx.fillText(displayStr, pX, pY);
    });
  });
}

function drawMahadashaCard(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  cardW: number,
  cardH: number,
  maha: DashaPeriodItem
) {
  drawRoundedRect(
    ctx,
    dx,
    dy,
    cardW,
    cardH,
    10,
    maha.isCurrent ? '#F0FDFA' : '#F8FAFC'
  );

  // Thin 2.5px left accent line
  ctx.fillStyle = maha.isCurrent ? '#008080' : '#FF7F33';
  ctx.fillRect(dx, dy + 12, 2.5, cardH - 24);

  // Mahadasha Planet + Classical Planetary Years + Birth Balance (if 1st dasha)
  ctx.fillStyle = '#008080';
  ctx.textAlign = 'left';
  ctx.font = 'bold 22px sans-serif';
  const balanceSuffix = maha.balanceText ? ` (${maha.balanceText})` : '';
  const activeSuffix = maha.isCurrent ? ' • सक्रिय' : '';
  ctx.fillText(
    `${maha.planet} महादशा — ${maha.durationYears} वर्ष${balanceSuffix}${activeSuffix}`,
    dx + 16,
    dy + 34
  );

  // Exact Start Date-Time to End Date-Time
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 17px sans-serif';
  const sTime = maha.startTime ? ` ${maha.startTime}` : '';
  const eTime = maha.endTime ? ` ${maha.endTime}` : '';
  ctx.fillText(
    `अवधि: ${maha.startDate}${sTime} से ${maha.endDate}${eTime}`,
    dx + 16,
    dy + 60
  );

  // Subtle divider line inside card
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(dx + 16, dy + 72);
  ctx.lineTo(dx + cardW - 16, dy + 72);
  ctx.stroke();

  // All 9 Antardashas with Start Date, End Date & Time
  (maha.antarDashas || []).slice(0, 9).forEach((antar, aIdx) => {
    const ay = dy + 98 + aIdx * 30;
    const isAntarActive = Boolean(antar.isCurrent);

    ctx.fillStyle = isAntarActive ? '#008080' : '#0F172A';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${maha.planet} - ${antar.planet}${isAntarActive ? ' ★' : ''}`,
      dx + 16,
      ay
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = isAntarActive ? '#008080' : '#334155';
    ctx.font = 'bold 17px sans-serif';
    const aEndTime = antar.endTime ? ` ${antar.endTime}` : '';
    ctx.fillText(
      `${antar.startDate} से ${antar.endDate}${aEndTime}`,
      dx + cardW - 16,
      ay
    );
  });
}

export async function generateAndDownloadKundliPdf(rawKundli: KundliChartData): Promise<string> {
  // Ensure full 9-Mahadasha, 9-Antardasha, and 9-Pratyantardasha data with exact times is present
  const needsFreshDasha =
    !rawKundli.vimshottariDasha ||
    rawKundli.vimshottariDasha.length < 9 ||
    !rawKundli.vimshottariDasha[0]?.startTime ||
    !rawKundli.vimshottariDasha[0]?.antarDashas?.[0]?.pratyantarDashas;

  const kundli: KundliChartData = needsFreshDasha
    ? generateKundli(
        rawKundli.name,
        rawKundli.birthDate,
        rawKundli.birthTime,
        rawKundli.birthPlace,
        rawKundli.latitude,
        rawKundli.longitude,
        rawKundli.gender
      )
    : rawKundli;

  const W = 1240;
  const H = 1754; // High-Res A4 (150 DPI)
  const totalPages = 3;

  const planetStatusLookup: Record<string, { isRetro: boolean; isCombust: boolean }> = {};
  (kundli.planets || []).forEach((p) => {
    planetStatusLookup[p.hindiName] = {
      isRetro: Boolean(p.isRetrograde),
      isCombust: Boolean(p.isCombust)
    };
  });

  // ==================== PAGE 1 ====================
  const canvas1 = document.createElement('canvas');
  canvas1.width = W;
  canvas1.height = H;
  const ctx1 = canvas1.getContext('2d')!;

  drawCleanPageFrame(ctx1, W, H, 1, totalPages);

  // Clean Header Banner
  const headerGrad1 = ctx1.createLinearGradient(48, 46, W - 48, 172);
  headerGrad1.addColorStop(0, '#006666');
  headerGrad1.addColorStop(1, '#008080');
  drawRoundedRect(ctx1, 48, 46, W - 96, 126, 16, headerGrad1);

  ctx1.fillStyle = '#FFFFFF';
  ctx1.textAlign = 'left';
  ctx1.font = 'bold 42px sans-serif';
  ctx1.fillText('JyotishWala — बृहद् वैदिक जन्मपत्रिका', 76, 102);

  ctx1.fillStyle = '#CCFBF1';
  ctx1.font = 'bold 22px sans-serif';
  ctx1.fillText(
    'सिद्धांत ज्योतिष, लहिरी अयनांश एवं सूक्ष्म ग्रह स्पष्ट आधारित प्रमाणिक वैदिक कुंडली',
    76,
    146
  );

  // Right Side of Header: ONLY Jatak's Name in Large Letters (No Label/Heading) + Birth Place below
  ctx1.fillStyle = '#FFFFFF';
  ctx1.textAlign = 'right';
  ctx1.font = 'bold 36px sans-serif';
  ctx1.fillText(kundli.name, W - 76, 104);

  ctx1.fillStyle = '#FDE68A';
  ctx1.font = 'bold 22px sans-serif';
  ctx1.fillText(`स्थान: ${kundli.birthPlace}`, W - 76, 146);

  // ==================== SECTION 1: जातक जन्म विवरण एवं अवकहड़ा चक्र (3-3 Boxes Per Row) ====================
  const av = kundli.avakahada;
  drawRoundedRect(ctx1, 48, 188, W - 96, 610, 16, '#FFFFFF');
  drawSimpleSectionHeading(
    ctx1,
    72,
    234,
    W - 144,
    '1. जातक का जन्म विवरण एवं अवकहड़ा चक्र',
    `सक्रिय दशा: ${kundli.currentDasha.mahaDasha} - ${kundli.currentDasha.antarDasha} - ${kundli.currentDasha.pratyantarDasha}`
  );

  // 12 Avakahada & Birth Items Grid in 3 Columns × 4 Rows
  const avItems = [
    { label: 'जातक का नाम', value: kundli.name },
    { label: 'जन्म तिथि व समय', value: `${kundli.birthDate} (${kundli.birthTime})` },
    { label: 'जन्म स्थान', value: kundli.birthPlace },
    { label: 'लग्न / लग्नेश', value: `${av.lagna} / ${av.lagnaLord}` },
    { label: 'चंद्र राशि / स्वामी', value: `${av.rashi} / ${av.rashiLord}` },
    { label: 'नक्षत्र (चरण)', value: `${av.nakshatra} (चरण ${av.nakshatraPada})` },
    { label: 'तिथि / वार', value: `${av.tithi} / ${av.vara}` },
    { label: 'योग / करण', value: `${av.yoga} / ${av.karana}` },
    { label: 'वर्ण / वश्य', value: `${av.varna} / ${av.vashya}` },
    { label: 'योनि / गण', value: `${av.yoni} / ${av.gana}` },
    { label: 'नाड़ी / पाया', value: `${av.nadi} / ${av.paya}` },
    { label: 'नामाक्षर', value: av.nameAlphabet }
  ];

  const colW = (W - 144) / 3;
  avItems.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const ix = 72 + col * colW;
    const iy = 266 + row * 127;

    drawRoundedRect(ctx1, ix, iy, colW - 16, 110, 10, '#F8FAFC');

    // Thin 2.5px left border line
    ctx1.fillStyle = col % 2 === 0 ? '#008080' : '#FF7F33';
    ctx1.fillRect(ix, iy + 12, 2.5, 86);

    ctx1.fillStyle = '#64748B';
    ctx1.textAlign = 'left';
    ctx1.font = 'bold 21px sans-serif';
    ctx1.fillText(item.label, ix + 18, iy + 38);

    ctx1.fillStyle = '#0F172A';
    ctx1.font = 'bold 26px sans-serif';
    ctx1.fillText(String(item.value).slice(0, 26), ix + 18, iy + 82);
  });

  // ==================== SECTION 2: प्रमुख वैदिक कुंडली चक्र (लग्न एवं नवांश कुंडली — Larger & Side-by-Side) ====================
  // Card ends cleanly at y = 1496 (814 + 682 = 1496), leaving a 42px margin before the Note card at y = 1538
  drawRoundedRect(ctx1, 48, 814, W - 96, 682, 16, '#FFFFFF');
  drawSimpleSectionHeading(
    ctx1,
    72,
    858,
    W - 144,
    '2. प्रमुख वैदिक कुंडली चक्र (लग्न कुंडली एवं नवांश कुंडली)',
    'उत्तर भारतीय शैली'
  );

  // Side-by-Side Larger Charts on the Same Line: Lagna Kundli (D1) & Navamsha Kundli (D9)
  const chartSize = 532;
  drawNorthIndianKundliOnCanvas(
    ctx1,
    68,
    884,
    chartSize,
    'लग्न कुंडली (D1)',
    'लग्न',
    kundli.houses,
    planetStatusLookup
  );

  drawNorthIndianKundliOnCanvas(
    ctx1,
    640,
    884,
    chartSize,
    'नवांश कुंडली (D9)',
    'नवांश',
    kundli.navamshaHouses,
    planetStatusLookup
  );

  // Standalone Note Card OUTSIDE and BELOW the Kundli Card with Clear 42px Top Margin (y = 1538)
  drawRoundedRect(ctx1, 48, 1538, W - 96, 82, 14, '#FFFFFF');
  ctx1.fillStyle = '#FF7F33';
  ctx1.fillRect(48, 1554, 2.5, 50);
  ctx1.fillStyle = '#0F172A';
  ctx1.textAlign = 'center';
  ctx1.font = 'bold 24px sans-serif';
  ctx1.fillText(
    "नोट: ग्रह के नाम के ऊपर ( ^ ) चिह्न का अर्थ 'वक्री ग्रह' है तथा ( * ) चिह्न का अर्थ 'अस्त ग्रह' है।",
    W / 2,
    1588
  );

  // ==================== PAGE 2 ====================
  const canvas2 = document.createElement('canvas');
  canvas2.width = W;
  canvas2.height = H;
  const ctx2 = canvas2.getContext('2d')!;

  drawCleanPageFrame(ctx2, W, H, 2, totalPages);

  // Page 2 Clean Header Banner
  const headerGrad2 = ctx2.createLinearGradient(48, 44, W - 48, 130);
  headerGrad2.addColorStop(0, '#006666');
  headerGrad2.addColorStop(1, '#008080');
  drawRoundedRect(ctx2, 48, 44, W - 96, 86, 16, headerGrad2);

  ctx2.fillStyle = '#FFFFFF';
  ctx2.textAlign = 'left';
  ctx2.font = 'bold 34px sans-serif';
  ctx2.fillText('JyotishWala — बृहद् वैदिक जन्मपत्रिका (ग्रह स्पष्ट एवं महादशा)', 76, 98);

  ctx2.fillStyle = '#FFFFFF';
  ctx2.textAlign = 'right';
  ctx2.font = 'bold 30px sans-serif';
  ctx2.fillText(kundli.name, W - 76, 98);

  // ==================== SECTION 3: नवग्रह स्पष्ट एवं नक्षत्र तालिका ====================
  drawRoundedRect(ctx2, 48, 144, W - 96, 654, 16, '#FFFFFF');
  drawSimpleSectionHeading(
    ctx2,
    72,
    188,
    W - 144,
    '3. नवग्रह स्पष्ट एवं नक्षत्र तालिका (लहिरी अयनांश)',
    `लग्न: ${av.lagna} • राशि: ${av.rashi}`
  );

  const tableX = 72;
  const tableY = 214;
  const tableW = W - 144;
  const rowH = 50;

  drawRoundedRect(ctx2, tableX, tableY, tableW, rowH, 8, '#008080');

  const cols = [
    { title: 'ग्रह (अवस्था)', x: tableX + 18 },
    { title: 'राशि', x: tableX + 235 },
    { title: 'भाव', x: tableX + 380 },
    { title: 'अंश-कला-विकला', x: tableX + 465 },
    { title: 'नक्षत्र (चरण)', x: tableX + 670 },
    { title: 'नक्षत्र स्वामी', x: tableX + 875 },
    { title: 'बल अवस्था', x: tableX + 1015 }
  ];

  ctx2.fillStyle = '#FFFFFF';
  ctx2.textAlign = 'left';
  ctx2.font = 'bold 23px sans-serif';
  cols.forEach((c) => ctx2.fillText(c.title, c.x, tableY + 34));

  kundli.planets.forEach((pos, idx) => {
    const ry = tableY + rowH * (idx + 1);
    ctx2.fillStyle = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
    ctx2.fillRect(tableX, ry, tableW, rowH);

    ctx2.strokeStyle = '#F1F5F9';
    ctx2.lineWidth = 1;
    ctx2.beginPath();
    ctx2.moveTo(tableX, ry + rowH);
    ctx2.lineTo(tableX + tableW, ry + rowH);
    ctx2.stroke();

    let sym = '';
    if (pos.isRetrograde) sym += '^';
    if (pos.isCombust) sym += '*';
    const planetText = `${pos.hindiName}${sym}`;

    ctx2.textAlign = 'left';
    ctx2.fillStyle = '#0F172A';
    ctx2.font = 'bold 23px sans-serif';
    ctx2.fillText(planetText, cols[0].x, ry + 34);

    ctx2.fillStyle = '#334155';
    ctx2.fillText(pos.signHindiName, cols[1].x, ry + 34);

    ctx2.fillStyle = '#008080';
    ctx2.fillText(String(pos.house), cols[2].x, ry + 34);

    ctx2.fillStyle = '#334155';
    ctx2.fillText(`${pos.degree}°${pos.minutes}'${pos.seconds}"`, cols[3].x, ry + 34);
    ctx2.fillText(`${pos.nakshatra} (${pos.pada})`, cols[4].x, ry + 34);
    ctx2.fillText(pos.nakshatraLord, cols[5].x, ry + 34);

    ctx2.fillStyle = '#FF7F33';
    ctx2.fillText(pos.statusHindi, cols[6].x, ry + 34);
  });

  // ==================== SECTION 4 (PART 1): विंशोत्तरी महादशा एवं अंतर्दशा चक्र (महादशा 1 से 4 — 2-2 Cards Per Row) ====================
  drawRoundedRect(ctx2, 48, 814, W - 96, 872, 16, '#FFFFFF');
  drawSimpleSectionHeading(
    ctx2,
    72,
    858,
    W - 144,
    '4. विंशोत्तरी महादशा एवं अंतर्दशा चक्र (तिथि व समय सहित — भाग 1)',
    `सक्रिय: ${kundli.currentDasha.mahaDasha} - ${kundli.currentDasha.antarDasha} - ${kundli.currentDasha.pratyantarDasha}`
  );

  const dColW = (W - 144) / 2;
  const cardW = dColW - 14;
  const cardH = 376;

  // First 4 Mahadashas in 2 Rows × 2 Columns (All 9 Antardashas inside each card)
  kundli.vimshottariDasha.slice(0, 4).forEach((maha, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const dx = 72 + col * dColW;
    const dy = 884 + row * 392;
    drawMahadashaCard(ctx2, dx, dy, cardW, cardH, maha);
  });

  // ==================== PAGE 3 ====================
  const canvas3 = document.createElement('canvas');
  canvas3.width = W;
  canvas3.height = H;
  const ctx3 = canvas3.getContext('2d')!;

  drawCleanPageFrame(ctx3, W, H, 3, totalPages);

  // Page 3 Clean Header Banner
  const headerGrad3 = ctx3.createLinearGradient(48, 44, W - 48, 130);
  headerGrad3.addColorStop(0, '#006666');
  headerGrad3.addColorStop(1, '#008080');
  drawRoundedRect(ctx3, 48, 44, W - 96, 86, 16, headerGrad3);

  ctx3.fillStyle = '#FFFFFF';
  ctx3.textAlign = 'left';
  ctx3.font = 'bold 34px sans-serif';
  ctx3.fillText('JyotishWala — विंशोत्तरी महादशा एवं प्रत्यंतर दशा चक्र', 76, 98);

  ctx3.fillStyle = '#FFFFFF';
  ctx3.textAlign = 'right';
  ctx3.font = 'bold 30px sans-serif';
  ctx3.fillText(kundli.name, W - 76, 98);

  // ==================== SECTION 4 (PART 2) & SECTION 5: महादशा 5 से 9 एवं प्रत्यंतर दशा चक्र ====================
  drawRoundedRect(ctx3, 48, 144, W - 96, 1542, 16, '#FFFFFF');
  drawSimpleSectionHeading(
    ctx3,
    72,
    188,
    W - 144,
    '4. विंशोत्तरी महादशा चक्र (भाग 2) एवं 5. सूक्ष्म प्रत्यंतर दशा चक्र',
    '120 वर्ष संपूर्ण वैदिक दशा चक्र'
  );

  // Remaining 5 Mahadashas (Cards 5 to 9) in 2-2 Cards Per Row
  kundli.vimshottariDasha.slice(4, 9).forEach((maha, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const dx = 72 + col * dColW;
    const dy = 214 + row * 392;
    drawMahadashaCard(ctx3, dx, dy, cardW, cardH, maha);
  });

  // 6th Card Slot (Row 2, Column 1): Active Antardasha's Complete 9 Pratyantardashas with Date & Time
  const activeMahaObj =
    kundli.vimshottariDasha.find((m) => m.isCurrent) || kundli.vimshottariDasha[0];
  const activeAntarIdx = Math.max(
    0,
    activeMahaObj.antarDashas.findIndex((a) => a.isCurrent)
  );
  const activeAntarObj =
    activeMahaObj.antarDashas[activeAntarIdx] || activeMahaObj.antarDashas[0];
  const nextAntarObj =
    activeMahaObj.antarDashas[(activeAntarIdx + 1) % activeMahaObj.antarDashas.length];

  const drawPratyantarCard = (
    dx: number,
    dy: number,
    mahaPlanet: string,
    antarObj: DashaPeriodItem['antarDashas'][number],
    badgeLabel: string
  ) => {
    drawRoundedRect(ctx3, dx, dy, cardW, cardH, 10, '#F0FDFA');
    ctx3.fillStyle = '#008080';
    ctx3.fillRect(dx, dy + 12, 2.5, cardH - 24);

    ctx3.fillStyle = '#008080';
    ctx3.textAlign = 'left';
    ctx3.font = 'bold 22px sans-serif';
    ctx3.fillText(
      `प्रत्यंतर दशा: ${mahaPlanet} - ${antarObj.planet} (${badgeLabel})`,
      dx + 16,
      dy + 34
    );

    ctx3.fillStyle = '#475569';
    ctx3.font = 'bold 17px sans-serif';
    ctx3.fillText(
      `अंतर्दशा अवधि: ${antarObj.startDate} ${antarObj.startTime || ''} से ${antarObj.endDate} ${antarObj.endTime || ''}`,
      dx + 16,
      dy + 60
    );

    ctx3.strokeStyle = '#CCFBF1';
    ctx3.lineWidth = 1;
    ctx3.beginPath();
    ctx3.moveTo(dx + 16, dy + 72);
    ctx3.lineTo(dx + cardW - 16, dy + 72);
    ctx3.stroke();

    (antarObj.pratyantarDashas || []).slice(0, 9).forEach((pItem, pIdx) => {
      const py = dy + 98 + pIdx * 30;
      const isPActive = Boolean(pItem.isCurrent);

      ctx3.fillStyle = isPActive ? '#FF7F33' : '#0F172A';
      ctx3.font = 'bold 18px sans-serif';
      ctx3.textAlign = 'left';
      ctx3.fillText(
        `${mahaPlanet}-${antarObj.planet}-${pItem.planet}${isPActive ? ' ★' : ''}`,
        dx + 16,
        py
      );

      ctx3.textAlign = 'right';
      ctx3.fillStyle = isPActive ? '#FF7F33' : '#334155';
      ctx3.font = 'bold 17px sans-serif';
      ctx3.fillText(
        `${pItem.startDate} से ${pItem.endDate} ${pItem.endTime}`,
        dx + cardW - 16,
        py
      );
    });
  };

  // Slot 6 (Row 2, Col 1): Current Active Antardasha's Pratyantardashas
  if (activeAntarObj) {
    drawPratyantarCard(
      72 + dColW,
      214 + 2 * 392,
      activeMahaObj.planet,
      activeAntarObj,
      'वर्तमान सक्रिय'
    );
  }

  // Bottom Summary Box on Page 3: Upcoming Antardasha's Pratyantardasha Table with Exact Date & Time
  if (nextAntarObj) {
    const secY = 1402;
    drawSimpleSectionHeading(
      ctx3,
      72,
      secY,
      W - 144,
      `5. आगामी अंतर्दशा (${activeMahaObj.planet} - ${nextAntarObj.planet}) की प्रत्यंतर दशा सारणी`,
      `अवधि: ${nextAntarObj.startDate} ${nextAntarObj.startTime || ''} से ${nextAntarObj.endDate} ${nextAntarObj.endTime || ''}`
    );

    const pList = nextAntarObj.pratyantarDashas || [];
    const pColW = (W - 144) / 3;
    pList.slice(0, 9).forEach((pItem, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const px = 72 + col * pColW;
      const py = secY + 30 + row * 76;

      drawRoundedRect(ctx3, px, py, pColW - 14, 66, 8, '#F8FAFC');
      ctx3.fillStyle = '#FF7F33';
      ctx3.fillRect(px, py + 8, 2.5, 50);

      ctx3.fillStyle = '#0F172A';
      ctx3.textAlign = 'left';
      ctx3.font = 'bold 19px sans-serif';
      ctx3.fillText(
        `${activeMahaObj.planet} - ${nextAntarObj.planet} - ${pItem.planet}`,
        px + 14,
        py + 28
      );

      ctx3.fillStyle = '#475569';
      ctx3.font = 'bold 16px sans-serif';
      ctx3.fillText(
        `${pItem.startDate} ${pItem.startTime} से ${pItem.endDate} ${pItem.endTime}`,
        px + 14,
        py + 52
      );
    });
  }

  // Convert all 3 canvases into a 3-page A4 PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  const img1 = canvas1.toDataURL('image/jpeg', 0.94);
  const img2 = canvas2.toDataURL('image/jpeg', 0.94);
  const img3 = canvas3.toDataURL('image/jpeg', 0.94);

  pdf.addImage(img1, 'JPEG', 0, 0, pdfW, pdfH);
  pdf.addPage();
  pdf.addImage(img2, 'JPEG', 0, 0, pdfW, pdfH);
  pdf.addPage();
  pdf.addImage(img3, 'JPEG', 0, 0, pdfW, pdfH);

  const safeName = (kundli.name || 'Janampatrika').trim().replace(/\s+/g, '_');
  const fileName = `JyotishWala_Kundli_${safeName}.pdf`;

  const pdfBlob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 1500);

  return blobUrl;
}
