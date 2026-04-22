import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={twMerge("animate-pulse rounded-md bg-stone-200/80", className)}
            {...props}
        />
    );
}
