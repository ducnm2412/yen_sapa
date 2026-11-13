type IconProps = { className?: string };

export function ZaloIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.78 1.47 5.26 3.77 6.87-.15 1.03-.6 2.36-1.6 3.33 0 0 2.6-.1 4.6-1.82.98.27 2.06.42 3.23.42 5.52 0 10-3.94 10-8.8S17.52 2 12 2Z" opacity=".18" />
      <path d="M6.2 8.4h4.1l-4.3 5.3h4.3v1.2H4.9v-.7l4.3-5.3H6.2V8.4Zm5.6 2.1c.4-.3.9-.5 1.4-.5 1.3 0 2.3 1 2.3 2.4s-1 2.5-2.3 2.5c-.5 0-1-.2-1.4-.5v.4h-1.1v-4.7h1.1v.4Zm1.3 3.3c.7 0 1.2-.6 1.2-1.4s-.5-1.4-1.2-1.4-1.3.6-1.3 1.4.6 1.4 1.3 1.4ZM16.4 8.2h1.1v6.7h-1.1V8.2Zm3.2 1.8c1.3 0 2.4 1 2.4 2.4s-1.1 2.5-2.4 2.5-2.4-1.1-2.4-2.5 1.1-2.4 2.4-2.4Zm0 3.8c.7 0 1.3-.6 1.3-1.4s-.6-1.4-1.3-1.4-1.3.6-1.3 1.4.6 1.4 1.3 1.4Z" />
    </svg>
  );
}

export function MessengerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.99-.88a.8.8 0 0 1 .53-.04c.91.25 1.88.39 2.9.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6.01 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.45 2.9h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}
