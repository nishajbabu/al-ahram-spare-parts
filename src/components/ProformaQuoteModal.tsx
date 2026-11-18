import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Copy, Download, FileSpreadsheet, Printer, X } from 'lucide-react';
import {
  CurrencyCode,
  DispatchLane,
  PricingMode,
  QuoteBagItem,
  SparePart,
  VehicleFitment,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { DISPATCH_LANES } from '../utils/whatsapp';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface ProformaQuoteModalProps {
  isOpen: boolean;
  items: QuoteBagItem[];
  catalogMap: Record<string, SparePart>;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  dispatchLane: DispatchLane;
  fitment: VehicleFitment;
  customerName: string;
  customerPhone: string;
  destination: string;
  notes: string;
  onClose: () => void;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function ProformaQuoteModal({
  isOpen,
  items,
  catalogMap,
  currency,
  pricingMode,
  dispatchLane,
  fitment,
  customerName,
  customerPhone,
  destination,
  notes,
  onClose,
}: ProformaQuoteModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadedCsv, setDownloadedCsv] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const quoteMeta = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const suffix = String(
      1000 +
        ((items.length * 137 +
          items.reduce((acc, i) => acc + i.quantity * 19, 0)) %
          8999)
    );
    return {
      dateLabel: now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      quoteRef: `AHM-${y}${m}${d}-${suffix}`,
    };
  }, [items]);

  const rows = useMemo(() => {
    return items
      .map((item) => {
        const part = catalogMap[item.partId];
        if (!part) return null;
        const variant = part.variants[item.variantId];
        const tier = getBulkTierPricing(
          variant.priceAED,
          item.quantity,
          pricingMode
        );
        const lineAED = tier.unitPriceAED * item.quantity;
        const retailLineAED = variant.priceAED * item.quantity;
        return {
          key: `${item.partId}-${item.variantId}`,
          part,
          variant,
          tier,
          quantity: item.quantity,
          lineAED,
          retailLineAED,
          itemFitment: item.fitment,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [items, catalogMap, pricingMode]);

  const subtotalAED = rows.reduce((sum, r) => sum + r.lineAED, 0);
  const retailBaselineAED = rows.reduce((sum, r) => sum + r.retailLineAED, 0);
  const totalSavingsAED = Math.max(0, retailBaselineAED - subtotalAED);
  const secondaryCurrency: CurrencyCode = currency === 'AED' ? 'USD' : 'AED';
  const activeLane = DISPATCH_LANES[dispatchLane];

  const vehicleText =
    [fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ') ||
    'Multi-Platform / General Specification';

  const buildFormattedPlainText = () => {
    const lines = [
      'AL AHRAM AUTO PARTS LLC — PROFORMA PARTS QUOTE',
      'Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)',
      'WhatsApp: +971 55 224 8090 | Landline: +971 6 539 6988 | alahram123@outlook.com',
      '----------------------------------------------------------------------',
      `Quote Ref: ${quoteMeta.quoteRef}`,
      `Date: ${quoteMeta.dateLabel}`,
      `Pricing Mode: ${pricingMode === 'bulk' ? 'Bulk Workshop / Trade' : 'Retail Direct'}`,
      `Primary Currency: ${currency}`,
      `Buyer / Workshop: ${customerName.trim() || 'Valued Client / Workshop'}`,
      ...(customerPhone.trim() ? [`Phone: ${customerPhone.trim()}`] : []),
      `Destination: ${destination.trim() || 'UAE / GCC'}`,
      `Vehicle Fitment: ${vehicleText}`,
      ...(fitment.vin ? [`Verified Chassis / VIN: ${fitment.vin}`] : []),
      `Dispatch Route: ${activeLane.label} (${activeLane.transit})`,
      '----------------------------------------------------------------------',
      'ITEMIZED HARDWARE:',
      ...rows.map(
        (r, idx) =>
          `${idx + 1}. ${r.part.name} [${r.variant.label}]\n   SKU: ${r.variant.sku} | OE Ref: ${r.variant.oeReference} | Tier: ${r.tier.tierLabel}\n   Qty: ${r.quantity} × ${formatMoney(r.tier.unitPriceAED, currency)} = ${formatMoney(r.lineAED, currency)}`
      ),
      '----------------------------------------------------------------------',
      ...(totalSavingsAED > 0
        ? [`Trade / Bulk Savings: -${formatMoney(totalSavingsAED, currency)}`]
        : []),
      `ESTIMATED TOTAL (${currency}): ${formatMoney(subtotalAED, currency)}`,
      `Equivalent (${secondaryCurrency}): ${formatMoney(subtotalAED, secondaryCurrency)}`,
      ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
      '----------------------------------------------------------------------',
      'Valid for 7 days from issue date. Confirm availability via WhatsApp +971 55 224 8090.',
    ];
    return lines.join('\n');
  };

  const buildStandaloneHtmlDocument = () => {
    const rowHtml = rows
      .map(
        (r) => `
        <tr>
          <td class="mono">
            <div class="bold">${escapeHtml(r.variant.sku)}</div>
            <div class="muted">${escapeHtml(r.variant.oeReference)}</div>
          </td>
          <td>
            <div class="bold">${escapeHtml(r.part.name)}</div>
            <div class="muted">${escapeHtml(r.variant.label)} · ${escapeHtml(r.tier.tierLabel)}</div>
          </td>
          <td class="right mono">${r.quantity}</td>
          <td class="right mono">${escapeHtml(formatMoney(r.tier.unitPriceAED, currency))}</td>
          <td class="right mono bold">${escapeHtml(formatMoney(r.lineAED, currency))}</td>
        </tr>`
      )
      .join('');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Proforma Quote ${escapeHtml(quoteMeta.quoteRef)} — Al Ahram Auto Parts LLC</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111318;
      background: #f4f5f7;
      margin: 0;
      padding: 32px 16px;
    }
    .sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #d4d7dd;
      padding: 36px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0b0b0d;
      padding-bottom: 18px;
      margin-bottom: 22px;
      gap: 20px;
    }
    .brand { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 6px; }
    .accent { color: #dc2626; }
    .sub { font-size: 12px; color: #4b5563; line-height: 1.5; margin: 0; }
    .meta { text-align: right; font-size: 12px; line-height: 1.6; }
    .meta-title { font-size: 14px; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 4px; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      border: 1px solid #d4d7dd;
      background: #f9fafb;
      padding: 14px 16px;
      margin-bottom: 24px;
      font-size: 12px;
      line-height: 1.6;
    }
    .label { font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; color: #4b5563; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
    th {
      text-align: left;
      border-bottom: 2px solid #0b0b0d;
      padding: 9px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #374151;
    }
    td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .right { text-align: right; }
    .mono { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; }
    .bold { font-weight: 600; }
    .muted { color: #6b7280; font-size: 11px; margin-top: 2px; }
    .totals { display: flex; justify-content: flex-end; border-top: 2px solid #0b0b0d; padding-top: 14px; }
    .totals-box { width: 300px; font-size: 13px; }
    .tot-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .tot-grand { font-size: 17px; font-weight: 700; border-top: 1px solid #d4d7dd; margin-top: 6px; padding-top: 8px; }
    .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #4b5563; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1 class="brand">AL AHRAM <span class="accent">AUTO PARTS</span> LLC</h1>
        <p class="sub">Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)</p>
        <p class="sub">WhatsApp: +971 55 224 8090 · Landline: +971 6 539 6988 · alahram123@outlook.com</p>
      </div>
      <div class="meta mono">
        <div class="meta-title">PROFORMA PARTS QUOTE</div>
        <div>Ref: ${escapeHtml(quoteMeta.quoteRef)}</div>
        <div>Date: ${escapeHtml(quoteMeta.dateLabel)}</div>
        <div>Tier Mode: ${pricingMode === 'bulk' ? 'Bulk Workshop' : 'Retail Direct'}</div>
        <div>Currency: ${escapeHtml(currency)}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="label">Buyer / Workshop</div>
        <div class="bold">${escapeHtml(customerName.trim() || 'Valued Client / Workshop')}</div>
        ${customerPhone.trim() ? `<div>Tel / WhatsApp: ${escapeHtml(customerPhone.trim())}</div>` : ''}
        <div>Destination: ${escapeHtml(destination.trim() || 'UAE / GCC')}</div>
      </div>
      <div>
        <div class="label">Vehicle Fitment &amp; Logistics</div>
        <div class="bold">${escapeHtml(vehicleText)}</div>
        ${fitment.vin ? `<div class="mono">VIN: ${escapeHtml(fitment.vin)}</div>` : ''}
        <div>Route: ${escapeHtml(activeLane.label)} (${escapeHtml(activeLane.transit)})</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>SKU / OE Ref</th>
          <th>Component &amp; Grade</th>
          <th class="right">Qty</th>
          <th class="right">Unit (${escapeHtml(currency)})</th>
          <th class="right">Line Total</th>
        </tr>
      </thead>
      <tbody>
        ${rowHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        ${
          totalSavingsAED > 0
            ? `<div class="tot-row accent"><span>Workshop / Fleet Savings</span><span class="mono">-${escapeHtml(formatMoney(totalSavingsAED, currency))}</span></div>`
            : ''
        }
        <div class="tot-row tot-grand">
          <span>Estimated Total (${escapeHtml(currency)})</span>
          <span class="mono">${escapeHtml(formatMoney(subtotalAED, currency))}</span>
        </div>
        <div class="tot-row muted">
          <span>Equivalent (${escapeHtml(secondaryCurrency)})</span>
          <span class="mono">${escapeHtml(formatMoney(subtotalAED, secondaryCurrency))}</span>
        </div>
      </div>
    </div>

    ${notes.trim() ? `<div class="footer"><strong>Special Notes / VIN Instructions:</strong> ${escapeHtml(notes.trim())}</div>` : ''}
    <div class="footer">
      All components are inspected and dispatched from Al Ahram Auto Parts LLC, Sharjah, UAE. Quote valid for 7 calendar days.
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadHtml = () => {
    const htmlContent = buildStandaloneHtmlDocument();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlAhram-Proforma-${quoteMeta.quoteRef}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  const handleDownloadCsv = () => {
    const escapeCsv = (val: string | number) =>
      `"${String(val).replace(/"/g, '""')}"`;

    const headers = [
      'Quote Ref',
      'Date',
      'SKU',
      'OE Reference',
      'Part Name',
      'Hardware Grade',
      'Pricing Tier',
      'Qty',
      `Unit Price (${currency})`,
      `Line Total (${currency})`,
      'Vehicle Fitment',
      'VIN',
      'Dispatch Route',
    ];

    const dataRows = rows.map((r) => [
      quoteMeta.quoteRef,
      quoteMeta.dateLabel,
      r.variant.sku,
      r.variant.oeReference,
      r.part.name,
      r.variant.label,
      r.tier.tierLabel,
      r.quantity,
      formatMoney(r.tier.unitPriceAED, currency),
      formatMoney(r.lineAED, currency),
      vehicleText,
      fitment.vin || '',
      activeLane.label,
    ]);

    const csvString = [headers, ...dataRows]
      .map((line) => line.map(escapeCsv).join(','))
      .join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlAhram-Manifest-${quoteMeta.quoteRef}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloadedCsv(true);
    setTimeout(() => setDownloadedCsv(false), 2200);
  };

  const handleCopyQuote = async () => {
    const text = buildFormattedPlainText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleFallbackPrint = () => {
    try {
      window.print();
    } catch {
      // Sandboxed environments may block print dialogs; download & copy remain available.
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Proforma Quote Preview"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: GALLERY_EASE }}
            className="w-full max-w-4xl bg-[#111116] border border-white/20 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Dark Obsidian Action Toolbar */}
            <div className="px-5 py-4 bg-[#14141A] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-[#DC2626]">
                  {quoteMeta.quoteRef} · {quoteMeta.dateLabel}
                </p>
                <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                  Proforma Quote Preview
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="h-9 px-3.5 inline-flex items-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  {downloaded ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {downloaded
                      ? 'Downloaded .html Quote'
                      : 'Download Proforma Quote (.html)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="h-9 px-3.5 inline-flex items-center gap-2 text-xs font-medium text-[#F4F5F7] bg-[#0B0B0D] border border-white/20 hover:border-white/50 rounded-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  {downloadedCsv ? (
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {downloadedCsv ? 'CSV Exported' : 'Export CSV'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="h-9 px-3.5 inline-flex items-center gap-2 text-xs font-medium text-[#F4F5F7] bg-[#0B0B0D] border border-white/20 hover:border-white/50 rounded-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copied ? 'Copied Quote Text' : 'Copy Formatted Quote'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleFallbackPrint}
                  title="Print using browser dialog (if permitted)"
                  className="h-9 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] hover:text-white bg-[#0B0B0D] border border-white/15 hover:border-white/35 rounded-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Proforma Preview"
                  className="w-9 h-9 inline-flex items-center justify-center text-[#9CA3AF] hover:text-white border border-white/15 hover:border-white/35 rounded-sm transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* High-Contrast Printable Paper Sheet */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-[#0B0B0D]">
              <div
                id="proforma-print-sheet"
                className="bg-white text-[#111318] p-6 sm:p-10 rounded-sm shadow-lg max-w-3xl mx-auto"
              >
                {/* Letterhead */}
                <div className="border-b-2 border-[#0B0B0D] pb-5 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-[#0B0B0D]">
                      AL AHRAM <span className="text-[#DC2626]">AUTO PARTS</span> LLC
                    </h1>
                    <p className="text-xs text-[#374151] mt-1">
                      Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)
                    </p>
                    <p className="text-xs text-[#374151] mt-0.5">
                      WhatsApp: +971 55 224 8090 · Landline: +971 6 539 6988 · alahram123@outlook.com
                    </p>
                  </div>

                  <div className="sm:text-right text-xs font-mono space-y-0.5 shrink-0">
                    <p className="font-bold text-sm text-[#0B0B0D]">
                      PROFORMA PARTS QUOTE
                    </p>
                    <p className="text-[#374151]">Ref: {quoteMeta.quoteRef}</p>
                    <p className="text-[#374151]">Date: {quoteMeta.dateLabel}</p>
                    <p className="text-[#374151]">
                      Mode: {pricingMode === 'bulk' ? 'Bulk Workshop' : 'Retail Direct'}
                    </p>
                    <p className="text-[#374151]">Currency: {currency}</p>
                  </div>
                </div>

                {/* Buyer & Vehicle Fitment Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6 border border-[#D4D7DD] bg-[#F9FAFB] p-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-semibold">
                      Buyer / Workshop Details
                    </p>
                    <p className="font-semibold text-[#111318]">
                      {customerName.trim() || 'Valued Client / Workshop'}
                    </p>
                    {customerPhone.trim() && (
                      <p className="text-[#374151]">Tel: {customerPhone.trim()}</p>
                    )}
                    <p className="text-[#374151]">
                      Destination: {destination.trim() || 'UAE / GCC'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-semibold">
                      Selected Vehicle &amp; Dispatch
                    </p>
                    <p className="font-semibold text-[#111318]">{vehicleText}</p>
                    {fitment.vin && (
                      <p className="font-mono text-[#111318]">VIN: {fitment.vin}</p>
                    )}
                    <p className="text-[#374151]">
                      Route: {activeLane.label} ({activeLane.transit})
                    </p>
                  </div>
                </div>

                {/* Itemized SKU Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#0B0B0D] text-left text-[11px] uppercase tracking-wider text-[#374151]">
                        <th className="py-2.5 pr-3">SKU / OE Ref</th>
                        <th className="py-2.5 pr-3">Description &amp; Tier</th>
                        <th className="py-2.5 px-2 text-right">Qty</th>
                        <th className="py-2.5 px-2 text-right">Unit ({currency})</th>
                        <th className="py-2.5 pl-2 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {rows.map((r) => (
                        <tr key={r.key}>
                          <td className="py-3 pr-3 font-mono align-top">
                            <div className="font-semibold text-[#111318]">
                              {r.variant.sku}
                            </div>
                            <div className="text-[10px] text-[#6B7280]">
                              {r.variant.oeReference}
                            </div>
                          </td>
                          <td className="py-3 pr-3 align-top">
                            <div className="font-semibold text-[#111318]">
                              {r.part.name}
                            </div>
                            <div className="text-[11px] text-[#4B5563]">
                              {r.variant.label} · {r.tier.tierLabel}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-mono tabular-nums align-top">
                            {r.quantity}
                          </td>
                          <td className="py-3 px-2 text-right font-mono tabular-nums align-top">
                            {formatMoney(r.tier.unitPriceAED, currency)}
                          </td>
                          <td className="py-3 pl-2 text-right font-mono font-semibold tabular-nums align-top text-[#111318]">
                            {formatMoney(r.lineAED, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Block with AED & USD Reference */}
                <div className="flex justify-end border-t-2 border-[#0B0B0D] pt-4">
                  <div className="w-full sm:w-80 space-y-1.5 text-xs">
                    {totalSavingsAED > 0 && (
                      <div className="flex justify-between text-[#DC2626] font-medium">
                        <span>Workshop / Fleet Savings</span>
                        <span className="font-mono tabular-nums">
                          -{formatMoney(totalSavingsAED, currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline text-base font-bold text-[#0B0B0D] pt-1">
                      <span>Estimated Total ({currency})</span>
                      <span className="font-mono tabular-nums">
                        {formatMoney(subtotalAED, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#6B7280]">
                      <span>Equivalent ({secondaryCurrency})</span>
                      <span className="font-mono tabular-nums">
                        {formatMoney(subtotalAED, secondaryCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {notes.trim() && (
                  <p className="mt-5 text-xs border-t border-[#E5E7EB] pt-3 text-[#374151]">
                    <span className="font-semibold text-[#111318]">Notes:</span>{' '}
                    {notes.trim()}
                  </p>
                )}

                <p className="mt-6 text-[11px] text-[#6B7280] border-t border-[#E5E7EB] pt-3">
                  Valid for 7 calendar days · Dispatched from Sharjah, UAE with worldwide air &amp; overland shipping options.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
