import { AGENT_DISCOVERY_HTML_LINKS } from '@/lib/agent-discovery';

/** RFC 8288 discovery links in HTML (supplements HTTP Link response header on `/`). */
export default function AgentDiscoveryLinks() {
  return (
    <>
      {AGENT_DISCOVERY_HTML_LINKS.map((link) => (
        <link
          key={`${link.rel}-${link.href}`}
          rel={link.rel}
          href={link.href}
          {...('type' in link && link.type ? { type: link.type } : {})}
          {...('title' in link && link.title ? { title: link.title } : {})}
        />
      ))}
    </>
  );
}
