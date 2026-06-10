/**
 * RFC 8288 Link header + HTML discovery for agents (isitagentready / RFC 9727).
 * @see https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
 *
 * HTTP `Link` response header must be set at Cloudflare (GitHub Pages ignores `public/_headers`).
 * Keep this file, `public/_headers`, and `next.config.js` in sync.
 */
const SITE = 'https://appaw.store';

export const AGENT_LINK_HEADER_VALUE = [
  `<${SITE}/.well-known/api-catalog>; rel="api-catalog"`,
  `<${SITE}/llms.txt>; rel="describedby"; type="text/plain"`,
  `<${SITE}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"`,
  `</sitemap.xml>; rel="sitemap"`,
].join(', ');

/** HTML `<link>` equivalents — supplementary; scanners may require HTTP `Link` header. */
export const AGENT_DISCOVERY_HTML_LINKS = [
  { rel: 'api-catalog', href: `${SITE}/.well-known/api-catalog` },
  { rel: 'describedby', href: '/llms.txt', type: 'text/plain', title: 'LLM site summary' },
  {
    rel: 'describedby',
    href: '/.well-known/agent-skills/index.json',
    type: 'application/json',
    title: 'Agent skills index',
  },
  { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' },
] as const;
