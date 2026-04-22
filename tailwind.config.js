/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Core neutrals — deeper, richer contrast for enterprise feel
                stone: {
                    50: '#FDFCFB',   // pristine off-white surface
                    100: '#F5F3F0',  // warm page background
                    200: '#E8E4DF',  // subtle dividers
                    300: '#D0CBC4',  // muted borders
                    400: '#A89F97',  // disabled / placeholder
                    500: '#78716C',  // secondary text
                    600: '#57534E',  // body text
                    700: '#3D3934',  // strong body
                    800: '#26221E',  // near-black text
                    900: '#141210',  // deep charcoal — signature dark
                    950: '#0A0908',  // midnight black
                },
                // Premium Gold Accent — used minimally as a precision mark
                gold: {
                    50: '#FBF4E8',
                    100: '#F5E4C2',
                    200: '#EAC87D',
                    300: '#D9A84B',
                    400: '#C48A1E',  // ← primary CTA accent
                    500: '#B46C24',  // ochre — brand anchor
                    600: '#9B5A1A',
                    700: '#7D4312',
                    800: '#5C2F0C',
                    900: '#3B1B06',
                },
                // Renamed for clarity — same semantics
                ochre: {
                    DEFAULT: '#B46C24',
                    light: '#D99858',
                    dark: '#8A4F16',
                },
                // Warm terracotta — secondary cultural accent
                terracotta: {
                    DEFAULT: '#A65D57',
                    light: '#C7857F',
                    dark: '#7D3E39',
                },
                // Muted sage — supporting accent
                sage: {
                    DEFAULT: '#7C8C74',
                    light: '#A3B39B',
                    dark: '#5A6953',
                },
                // Ivory — premium surface for feature sections
                ivory: {
                    DEFAULT: '#F9F5EE',
                    warm: '#F3EDE1',
                    deep: '#E8DDD0',
                },
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                urdu: ['"Noto Nastaliq Urdu"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.65rem', { lineHeight: '1rem' }],
            },
            letterSpacing: {
                'editorial': '-0.035em',
                'display': '-0.025em',
                'micro': '0.12em',
                'label': '0.08em',
            },
            boxShadow: {
                // Layered system — each step adds perceived depth
                'xs': '0 1px 3px 0 rgba(20,18,16,0.04)',
                'soft': '0 4px 20px -2px rgba(20,18,16,0.07)',
                'soft-lg': '0 10px 40px -4px rgba(20,18,16,0.10)',
                'soft-xl': '0 20px 60px -8px rgba(20,18,16,0.14)',
                'soft-2xl': '0 30px 80px -10px rgba(20,18,16,0.22)',
                'gold': '0 4px 24px -4px rgba(180,108,36,0.30)',
                'gold-lg': '0 8px 40px -6px rgba(180,108,36,0.40)',
                'gold-glow': '0 0 40px -6px rgba(180,108,36,0.50)',
                'inner-soft': 'inset 0 1px 3px rgba(20,18,16,0.06)',
                'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
                'card-hover': '0 20px 60px -8px rgba(20,18,16,0.22), 0 0 0 1px rgba(180,108,36,0.12)',
            },
            borderRadius: {
                'xl2': '1.125rem',
                'xl3': '1.5rem',
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
            transitionDuration: {
                '200': '200ms',
                '400': '400ms',
                '600': '600ms',
            },
            animation: {
                'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease-in-out infinite',
            },
            keyframes: {
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 4px 24px -4px rgba(180,108,36,0.30)' },
                    '50%': { boxShadow: '0 4px 40px -2px rgba(180,108,36,0.60), 0 0 20px -4px rgba(180,108,36,0.35)' },
                },
                gradientShift: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            backgroundImage: {
                'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [],
}
