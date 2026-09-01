// THE EMAIL BODY STYLE MAP — the single source of truth for how an issue reads.
//
// WHY INLINE AND NOT A STYLESHEET. Buttondown's `css` field is a paid feature:
// PATCHing it returns 400 css__not_allowed on the current plan (measured
// 2026-09-01). So the body is styled attribute by attribute, per send, by
// newsletter-send.mjs. That is not a workaround to be embarrassed about, it is
// what every serious email template does anyway: Gmail's clipping, Outlook's Word
// engine and a decade of client bugs all punish <style> and respect style="".
//
// The masthead and footer do NOT come from here. They live at account level in
// header.html / footer.html, pushed by newsletter-theme.mjs, so an issue sent by
// hand from the Buttondown UI still wears them.
//
// Palette is the SITE's: ink #0B0B0B, white page, teal #0E9C86. Founder pick
// from two mocks, 2026-09-01 (DECISIONS.md).

const SANS = "'Inter Tight', Inter, 'Helvetica Neue', Arial, sans-serif";
const DISPLAY = "'Archivo', 'Inter Tight', 'Helvetica Neue', Arial, sans-serif";
const INK = '#111111';
const DIM = '#5A5A5A';
const TEAL = '#0E9C86';
const RULE = '#E2E2E2';

// tag -> style. Applied to the top-level tags marked() emits. A tag missing from
// this map keeps the client's default, which is why the list is deliberately
// complete for the subset the issues actually use rather than clever.
export const TAG_STYLES = {
  p: `font-family:${SANS};font-size:16px;line-height:1.7;color:${INK};margin:20px 0 0;`,
  li: `font-family:${SANS};font-size:16px;line-height:1.7;color:${INK};margin:8px 0 0;`,
  ul: 'margin:16px 0 0;padding-left:20px;',
  ol: 'margin:16px 0 0;padding-left:20px;',
  h1: `font-family:${DISPLAY};font-weight:400;font-size:30px;line-height:1.18;color:${INK};margin:34px 0 0;`,
  h2: `font-family:${DISPLAY};font-weight:400;font-size:21px;line-height:1.28;color:${INK};margin:38px 0 0;`,
  h3: `font-family:${DISPLAY};font-weight:400;font-size:17px;line-height:1.35;color:${INK};margin:30px 0 0;`,
  strong: `font-weight:600;color:${INK};`,
  em: 'font-style:italic;',
  a: `color:${INK};text-decoration:none;box-shadow:inset 0 -2px 0 ${TEAL};`,
  img: 'display:block;width:100%;height:auto;margin:28px 0 0;',
  hr: `border:0;border-top:1px solid ${RULE};margin:34px 0 0;`,
  blockquote: `margin:24px 0 0;padding:2px 0 2px 16px;border-left:2px solid ${TEAL};color:${DIM};`,
  code: "font-family:'SF Mono',Menlo,Consolas,monospace;font-size:14px;background:#F5F5F3;padding:2px 5px;",
  pre: "font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.6;background:#0B0B0B;color:#EFEADD;padding:18px 20px;margin:24px 0 0;overflow-x:auto;",
};

// The authored blocks: raw HTML an issue pastes into its markdown to get rhythm.
// Written as functions rather than CSS classes for the same reason as above, and
// exported so the drafting skill can call them instead of hand-typing style
// attributes that then drift issue to issue.
export const blocks = {
  lede: (text) => `<p style="font-family:${SANS};font-size:17px;line-height:1.62;color:${DIM};margin:14px 0 0;">${text}</p>`,

  rule: () => `<hr style="border:0;border-top:2px solid ${INK};margin:24px 0 0;">`,

  section: (label) => `<div style="border-top:1px solid ${RULE};margin:36px 0 0;padding-top:14px;">`
    + `<span style="display:block;font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${TEAL};">${label}</span>`
    + '</div>',

  // Up to three cells. More than three and each one stops being legible on a
  // phone, where they stack anyway.
  stats: (cells) => {
    const td = cells.map((c, i) => `<td style="padding:17px 18px;vertical-align:top;${i < cells.length - 1 ? 'border-right:1px solid #262626;' : ''}">`
      + `<span style="display:block;font-family:${SANS};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#8C8C8C;margin:0 0 8px;">${c.k}</span>`
      + `<span style="display:block;font-family:${SANS};font-size:19px;font-weight:600;color:#FFFFFF;line-height:1.1;">${c.v}`
      + (c.note ? `<span style="display:block;font-size:11px;font-weight:400;color:#8C8C8C;letter-spacing:.05em;margin-top:5px;">${c.note}</span>` : '')
      + '</span></td>').join('');
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:24px 0 0;background:#0B0B0B;"><tr>${td}</tr></table>`;
  },

  arrow: () => `<span style="color:${TEAL};">&rarr;</span>`,

  caption: (text) => `<p style="font-family:${SANS};font-size:11px;line-height:1.55;color:${DIM};margin:10px 0 0;padding-left:12px;border-left:2px solid ${TEAL};">${text}</p>`,

  cta: ({ label, text, href, button }) => '<div style="margin:34px 0 0;background:#F5F5F3;padding:24px 26px;">'
    + `<span style="display:block;font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${TEAL};margin:0 0 9px;">${label}</span>`
    + `<p style="font-family:${SANS};font-size:15px;line-height:1.6;color:${INK};margin:0 0 16px;">${text}</p>`
    + `<a href="${href}" style="display:inline-block;background:${TEAL};color:#04120F;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:13px 24px;text-decoration:none;">${button}</a>`
    + '</div>',

  signoff: (paras, name) => `<div style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${RULE};">`
    + paras.map((p) => `<p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${INK};margin:0 0 14px;">${p}</p>`).join('')
    + `<p style="font-family:${DISPLAY};font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${INK};margin:16px 0 0;">${name}</p>`
    + '</div>',
};

// Inject style="" into every tag in TAG_STYLES that does not already carry one.
// "does not already carry one" is the important half: the authored blocks above
// are already styled, and re-styling them would flatten the design back to body
// copy. Attribute-level, not a DOM parse, because there is no DOM here and the
// input is marked()'s output, which is predictable.
export function inlineStyles(html) {
  let out = html;
  for (const [tag, style] of Object.entries(TAG_STYLES)) {
    out = out.replace(new RegExp(`<${tag}(\\s[^>]*)?>`, 'g'), (m, attrs = '') => {
      if (/\sstyle\s*=/.test(attrs || '')) return m;
      return `<${tag}${attrs || ''} style="${style}">`;
    });
  }
  return out;
}
