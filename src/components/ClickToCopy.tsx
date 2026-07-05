import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ClickToCopyProps {
  value: string;
  className?: string;
}

/** Click a phone number to copy it, with a brief mono "Copied" flash. */
export function ClickToCopy({ value, className = '' }: ClickToCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Modern Clipboard API blocked (older browser, restrictive permissions
      // policy) — fall back to the legacy selection-based copy technique.
      const input = document.createElement('textarea');
      input.value = value;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      document.body.removeChild(input);
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-cursor="copy"
      className={`group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-ember ${className}`}
      // Not a <p> and not `.label-mono`, so it gets none of the global
      // text-shadow rules that keep type readable over the black hole —
      // added directly here since the WhatsApp number must always be legible.
      style={{ textShadow: '0 1px 12px rgba(5, 5, 6, 0.9)' }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-ember" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{value}</span>
      <span className="label-mono" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}
