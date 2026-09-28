import Script from "next/script";

// Runs before first paint so the page never flashes the wrong theme.
// Pattern from the Next.js "Preventing flash before hydration" guide.
//
// The site is light by default — the visitor's system setting is deliberately
// ignored. Dark is opt-in through the header toggle, and that choice is what
// localStorage remembers.
const script = `(function(){try{var t=localStorage.getItem("sbft-theme");if(t!=="light"&&t!=="dark"){t="light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

// next/script with beforeInteractive: a bare <script> rendered from a
// component trips React 19's "scripts inside React components are never
// executed" warning.
export function ThemeScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- App Router root layout supports it
    <Script id="theme-script" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
