import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "Contact Support", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-canvas py-12 border-t border-white/5 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 max-w-[1300px] mx-auto w-full">
        <div className="text-lg font-display-lg font-bold text-primary-fixed-dim">InterviewAI</div>
        <div className="flex flex-wrap justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface-variant/70 font-body-sm text-body-sm hover:text-primary-fixed-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/60">
          © 2024 InterviewAI. Powered by Neural Synthesis.
        </p>
      </div>
    </footer>
  );
}
