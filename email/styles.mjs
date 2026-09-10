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
//
// WHAT BUTTONDOWN DOES TO THESE ON DELIVERY (measured 2026-09-09, two probe
// sends read back from Gmail as delivered HTML; the rules are in
// email/buttondown-modern.css). Its "modern" template runs a CSS inliner over
// the body: a property we did not set is filled from its stylesheet, and its
// !important rules overwrite ours. So: p/li/h1-h6 get margin 16px 0, p/li get
// 16px/24px, links are the tint colour #0E9C86 underlined, whatever we say.
// A fenced block WITH a language tag is re-rendered by its highlighter and
// loses every style below; a plain fence keeps ours. The values here are set
// to what actually arrives, so the preview stops lying, and every colour is
// explicit because a missing one is filled with Buttondown's (code got
// color:#fff and vanished on a light chip). The naked/custom templates and
// the css field are paid; the account is on the free plan.
export const TAG_STYLES = {
  p: `font-family:${SANS};font-size:16px;line-height:24px;color:${INK};margin:16px 0;`,
  li: `font-family:${SANS};font-size:16px;line-height:24px;color:${INK};margin:8px 0 0;`,
  ul: 'margin:16px 0;padding-left:20px;',
  ol: 'margin:16px 0;padding-left:20px;',
  h1: `font-family:${DISPLAY};font-weight:400;font-size:30px;line-height:1.18;color:${INK};margin:16px 0;`,
  h2: `font-family:${DISPLAY};font-weight:400;font-size:21px;line-height:1.28;color:${INK};margin:16px 0;`,
  h3: `font-family:${DISPLAY};font-weight:400;font-size:17px;line-height:1.35;color:${INK};margin:16px 0;`,
  strong: `font-weight:600;color:${INK};`,
  em: 'font-style:italic;',
  // Buttondown forces a { color: <tint> !important; text-decoration: underline }
  // on every link. The tint IS our teal, so the theme says the same thing
  // rather than pretending an ink link with a teal border-bottom will arrive.
  a: `color:${TEAL};text-decoration:underline;`,
  img: 'display:block;width:100%;height:auto;margin:28px 0 0;',
  hr: `border:0;border-top:1px solid ${RULE};margin:34px 0 0;max-width:100%;`, // Buttondown fills max-width:300px if absent
  blockquote: `margin:24px 0 0;padding:2px 0 2px 16px;border-left:2px solid ${TEAL};color:${DIM};`,
  code: `font-family:'SF Mono',Menlo,Consolas,monospace;font-size:14px;color:${INK};background:#F5F5F3;padding:2px 5px;`, // colour explicit: Buttondown fills #fff
  // pre-wrap, not overflow: Gmail and Outlook ignore overflow-x, so a long line
  // in a 600px column is either wrapped by us or cut off by them. Authors keep
  // code lines under ~72 characters so the wrap rarely fires on desktop.
  pre: "font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.6;background:#0B0B0B;color:#EFEADD;padding:18px 20px;margin:24px 0 0;white-space:pre-wrap;word-break:break-word;",
};

// A <code> inside a <pre> inherits the block. Without this the inline-code
// style (light grey chip) lands inside the dark block and the file renders as
// a grey slab with white text on it (found 2026-09-09 in the first issue to
// ship a code block).
const PRE_CODE = 'font-family:inherit;font-size:inherit;background:none;padding:0;color:inherit;';

// The authored blocks: raw HTML an issue pastes into its markdown to get rhythm.
// Written as functions rather than CSS classes for the same reason as above, and
// exported so the drafting skill can call them instead of hand-typing style
// attributes that then drift issue to issue.
export const blocks = {
  lede: (text) => `<p style="font-family:${SANS};font-size:17px;line-height:1.62;color:${DIM};margin:14px 0 0;">${text}</p>`,

  rule: () => `<hr style="border:0;border-top:2px solid ${INK};margin:24px 0 0;max-width:100%;">`,

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
    // Ink button, teal label: Buttondown forces link colour to the teal tint, so
    // a teal button arrived teal-on-teal (invisible, founder 2026-09-09). Teal on
    // ink measures 5.6:1. (.buttondown-button would give white on teal, 3.9:1.)
    + `<a href="${href}" style="display:inline-block;background:${INK};color:${TEAL};font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:13px 24px;text-decoration:none;">${button}</a>`
    + '</div>',

  signoff: (paras, name) => `<div style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${RULE};">`
    + paras.map((p) => `<p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${INK};margin:0 0 14px;">${p}</p>`).join('')
    + `<p style="font-family:${DISPLAY};font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${INK};margin:16px 0 0;">${name}</p>`
    + '</div>',

  // ---- blocks added 2026-09-09 for the weekly "one installable file" issue ----

  // KICKER: one dim line under the title. Issue number, read time, what the
  // reader leaves with. The masthead cannot carry the issue number (Buttondown
  // has no template variable for it), so it lives here.
  kicker: (text) => `<p style="font-family:${SANS};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${DIM};margin:12px 0 0;">${text}</p>`,

  // FILE BAR: the tab above a code block. Path in teal, meta in grey, on the
  // same ink as the block so the two read as one object. A two-cell table, not a
  // float: a floated span wrapped under the path in the 2026-09-09 preview. The
  // fenced code block MUST follow it directly; inlineStyles() zeroes its top margin.
  filebar: (file, meta) => `<table role="presentation" data-vk="filebar" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:24px 0 0;background:#1A1A1A;border-bottom:1px solid #2A2A2A;"><tr>`
    + `<td style="padding:10px 20px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:12px;color:${TEAL};">${file}</td>`
    + (meta ? `<td style="padding:10px 20px;text-align:right;white-space:nowrap;font-family:${SANS};font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8C8C8C;">${meta}</td>` : '')
    + '</tr></table>',

  // TRIED THIS WEEK: at most two rows, each a verdict chip and one sentence.
  // The chip is the product; a row without a verdict is a feed item.
  strip: (rows) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:16px 0 0;">`
    + rows.map(({ verdict, text }) => {
      const yes = /^yes/i.test(verdict);
      const chip = `background:${yes ? TEAL : '#E2E2E2'};color:${yes ? '#04120F' : INK};`;
      return `<tr><td style="padding:12px 0;border-top:1px solid ${RULE};vertical-align:top;width:72px;">`
        + `<span style="display:inline-block;${chip}font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:4px 8px;">${verdict}</span></td>`
        + `<td style="padding:12px 0 12px 14px;border-top:1px solid ${RULE};vertical-align:top;font-family:${SANS};font-size:14px;line-height:1.6;color:${INK};">${text}</td></tr>`;
    }).join('')
    + '</table>',

  // ONE QUESTION: the reply ask as an object, not a plea at the bottom. One
  // question, answerable in a line, with the promise that a reply gets read.
  question: (q, note) => `<div style="margin:34px 0 0;border:2px solid ${INK};padding:22px 26px;">`
    + `<span style="display:block;font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${TEAL};margin:0 0 10px;">One question</span>`
    + `<p style="font-family:${DISPLAY};font-size:19px;line-height:1.35;color:${INK};margin:0;">${q}</p>`
    + (note ? `<p style="font-family:${SANS};font-size:13px;line-height:1.6;color:${DIM};margin:12px 0 0;">${note}</p>` : '')
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
  // <pre><code> : the code tag inherits the block (see PRE_CODE).
  out = out.replace(/(<pre[^>]*>\s*<code[^>]*?)\sstyle="[^"]*"/g, `$1 style="${PRE_CODE}"`);
  // A code block directly under a file bar is the same object: no gap.
  out = out.replace(/(<table[^>]*data-vk="filebar"[\s\S]*?<\/table>)\s*(<pre style="[^"]*?)margin:24px 0 0;/g, '$1$2margin:0;');
  return out;
}
