import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ritual' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

// Exported so links (e.g. external checkout) can share the button look.
export function buttonClasses(variant: Variant = 'primary', className?: string) {
  return cn(
    'inline-flex items-center justify-center font-body text-[11px] font-medium tracking-[3px] uppercase px-10 py-4 transition-all duration-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    variant === 'primary' && 'bg-bone text-void hover:bg-white hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(240,237,232,0.15)]',
    variant === 'outline' && 'bg-transparent text-bone border border-white/20 hover:border-white/50 hover:bg-white/[0.03]',
    variant === 'ritual' && 'bg-transparent text-celestine border border-ritual-violet/40 hover:border-ritual-violet/80 hover:bg-ritual-violet/[0.08] hover:shadow-[0_0_30px_rgba(109,90,205,0.15)]',
    variant === 'ghost' && 'bg-transparent text-muted border-none px-5 hover:text-bone',
    className,
  )
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />
}
