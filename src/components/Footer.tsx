import { LiveClock } from './LiveClock';
import { links } from '../tokens';

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rule border-t px-5 pb-8 pt-16 md:px-10">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <span
            className="text-[color:var(--fg)]"
            style={{ fontVariationSettings: "'opsz' 24, 'wght' 540", fontSize: '1.05rem', letterSpacing: '-0.02em' }}
          >
            Grenwall<sup className="align-super text-[0.55em]">®</sup>
          </span>
          <p className="text-body text-muted mt-4">
            AI automations and agents for businesses that would rather not do the
            same thing twice.
          </p>
        </div>

        <nav className="flex flex-col gap-3" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} data-cursor-hover className="label-mono link-line w-fit">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="label-mono link-line w-fit"
          >
            WhatsApp
          </a>
          <span className="label-mono">{links.whatsappPhoneDisplay}</span>
          <LiveClock />
        </div>
      </div>

      {/* The wordmark as landscape — edge-to-edge, half-buried below the fold
          line like a signature carved into the page's floor. */}
      <div
        className="pointer-events-none mt-16 select-none overflow-hidden whitespace-nowrap text-center leading-[0.76]"
        aria-hidden="true"
      >
        <span
          className="text-[clamp(4rem,15.5vw,18rem)]"
          style={{
            fontVariationSettings: "'opsz' 32, 'wght' 540",
            letterSpacing: '-0.045em',
            color: 'var(--fg)',
            opacity: 0.08,
          }}
        >
          Grenwall
        </span>
      </div>

      <div className="rule mt-6 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
        <span className="label-mono">&copy; {year} Grenwall Systems</span>
        <span className="label-mono text-faint">If the work repeats, it can be automated.</span>
      </div>
    </footer>
  );
}
