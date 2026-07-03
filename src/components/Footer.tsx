import { Monogram } from './Monogram';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-void px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <Monogram />
          <span className="font-display text-lg uppercase tracking-tight text-bone">Grenwall Systems</span>
        </div>
        <a href="#hero" data-cursor-hover className="group label-mono flex items-center gap-1.5 transition-colors hover:text-ember">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          Back to top
        </a>
        <p className="label-mono">©GRENWALL {year}</p>
      </div>
    </footer>
  );
}
