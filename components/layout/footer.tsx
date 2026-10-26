import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="font-display text-sm tracking-[5px] uppercase text-bone/60">
          Cult of Elysium
        </div>
        <div className="flex gap-8">
          {[
            { label: 'Shop', href: '/store' },
            { label: 'Collections', href: '/collections' },
            { label: 'About', href: '/about' },
            { label: 'Search', href: '/search' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-[3px] uppercase text-muted hover:text-bone transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="text-[10px] text-muted/50 tracking-[2px]">
          &copy; {new Date().getFullYear()} Cult of Elysium
        </div>
      </div>
    </footer>
  )
}
