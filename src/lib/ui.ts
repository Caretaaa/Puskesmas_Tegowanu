import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** shadcn-style button recipe consumed by Astro markup and React islands. */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-teal-900 text-white hover:bg-teal-800 shadow-card hover:shadow-lift',
        outline: 'border-2 border-teal-800 text-teal-900 hover:bg-teal-900 hover:text-white',
        ghost: 'text-teal-800 hover:bg-teal-100/70',
        mint: 'bg-mint text-teal-950 hover:bg-mint-deep hover:text-white',
        white: 'bg-white text-teal-900 shadow-card hover:bg-teal-50',
        amber: 'bg-amber-400 text-teal-950 hover:bg-amber-500',
        link: 'text-teal-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'text-sm px-4 py-2',
        md: 'text-[0.95rem] px-6 py-3',
        lg: 'text-base px-7 py-3.5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
export type ButtonSize = NonNullable<Parameters<typeof buttonVariants>[0]>['size'];