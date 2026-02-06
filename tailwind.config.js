/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#2563EB', // LabFlow Blue
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#F1F5F9', // Slate 100
                    foreground: '#0F172A' // Slate 900
                },
                destructive: {
                    DEFAULT: 'var(--destructive)',
                    foreground: 'var(--destructive-foreground)'
                },
                muted: {
                    DEFAULT: '#F8FAFC', // Slate 50
                    foreground: '#64748B' // Slate 500
                },
                accent: {
                    DEFAULT: '#EFF6FF', // Blue 50
                    foreground: '#1E40AF' // Blue 800
                },
                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F172A'
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F172A'
                },
                success: {
                    DEFAULT: '#DCFCE7', // Green 100
                    foreground: '#166534' // Green 800
                },
                warning: {
                    DEFAULT: '#FEF9C3', // Yellow 100
                    foreground: '#854D0E' // Yellow 800
                },
                sidebar: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#64748B', // Slate 500 for non-active
                    primary: '#2563EB', // Active Blue
                    'primary-foreground': '#FFFFFF',
                    accent: '#F1F5F9',
                    'accent-foreground': '#0F172A',
                    border: '#E2E8F0', // Slate 200
                    ring: '#2563EB',
                }
            },
            borderRadius: {
                lg: '0.5rem',
                md: '0.375rem',
                sm: '0.25rem'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}
