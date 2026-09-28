// Runs before first paint so the page never flashes the wrong theme.
// Pattern from the Next.js "Preventing flash before hydration" guide.
//
// The site is light by default — the visitor's system setting is deliberately
// ignored. Dark is opt-in through the header toggle, and that choice is what
// localStorage remembers.
const script = `(function(){try{var t=localStorage.getItem("sbft-theme");if(t!=="light"&&t!=="dark"){t="light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
