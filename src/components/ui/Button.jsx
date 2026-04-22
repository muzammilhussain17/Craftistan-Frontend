import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    leftIcon,
    rightIcon,
    ...props
}) {
    const base = [
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-300',
        'disabled:pointer-events-none disabled:opacity-40',
        'select-none whitespace-nowrap',
    ].join(' ');

    const variants = {
        // Deep charcoal — primary authority button
        primary: [
            'bg-stone-900 text-stone-50 rounded-full',
            'hover:bg-stone-800 hover:shadow-soft-lg',
            'active:scale-[0.97] active:shadow-none',
            'shadow-soft',
        ].join(' '),

        // Warm gold CTA — use sparingly on key actions
        gold: [
            'bg-ochre text-white rounded-full',
            'hover:bg-ochre-dark hover:shadow-gold',
            'active:scale-[0.97]',
            'shadow-gold',
        ].join(' '),

        // Clean outlined — secondary actions
        secondary: [
            'bg-white text-stone-800 rounded-full border border-stone-200',
            'hover:border-stone-400 hover:shadow-soft',
            'active:scale-[0.97]',
            'shadow-xs',
        ].join(' '),

        // Outlined with gold border on hover
        outline: [
            'bg-transparent text-stone-700 rounded-full border border-stone-200',
            'hover:border-ochre hover:text-ochre',
            'active:scale-[0.97]',
        ].join(' '),

        // Minimal ghost for navigation
        ghost: [
            'bg-transparent text-stone-500 rounded-lg',
            'hover:bg-stone-100 hover:text-stone-900',
            'active:scale-[0.97]',
        ].join(' '),

        // Destructive
        danger: [
            'bg-red-600 text-white rounded-full',
            'hover:bg-red-700 hover:shadow-soft-lg',
            'active:scale-[0.97]',
        ].join(' '),
    };

    const sizes = {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
        xl: 'px-10 py-4 text-lg',
    };

    return (
        <button
            className={twMerge(clsx(base, variants[variant], sizes[size], className))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : leftIcon ? (
                <span className="w-4 h-4 flex-shrink-0">{leftIcon}</span>
            ) : null}
            {children}
            {rightIcon && !isLoading && (
                <span className="w-4 h-4 flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
}
