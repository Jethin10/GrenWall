import { Monogram } from './Monogram';

const LINKS = [
  { label: 'Work', href: '#what-we-build' },
  { label: 'Approach', href: '#why-grenwall' },
  { label: 'Contact', href: '#contact', cursor: 'open' },
];

function NavLink({ label, href, cursor }: { label: string; href: string; cursor?: string }) {
  return (
    <a href={href} data-cursor-hover data-cursor={cursor} className="group label-mono relative">
      {label}
      <span
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover:scale-x-100"
        aria-hidden="true"
      />
    </a>
  );
}

/** Minimal, understated site-wide nav — a monogram and a few quiet, underline-wipe links. */
export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="#hero" data-cursor-hover aria-label="Grenwall — back to top">
        <Monogram className="h-8 w-8 text-bone" />
      </a>
      <div className="flex items-center gap-7">
        {LINKS.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
    </nav>
  );
}
