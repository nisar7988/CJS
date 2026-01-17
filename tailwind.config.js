/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#2F6FED",
                primaryDark: "#1E56D6",
                primaryLight: "#EAF1FF",
                background: "#EDF4FF",
                surface: "#FFFFFF",
                surfaceAlt: "#F1F4F9",
                text: "#0F172A",
                textMuted: "#64748B",
                textLight: "#94A3B8",
                textOnPrimary: "#FFFFFF",
                border: "#E2E8F0",
                divider: "#EEF2F7",
                success: "#22C55E",
                successLight: "#DCFCE7",
                warning: "#F59E0B",
                warningLight: "#FEF3C7",
                danger: "#EF4444",
                dangerLight: "#FEE2E2",
                info: "#3B82F6",
                infoLight: "#DBEAFE",
                shadow: "rgba(15, 23, 42, 0.08)",
                overlay: "rgba(15, 23, 42, 0.35)",
            },
            fontSize: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '22px',
                xxl: '28px',
            },
            spacing: {
                xs: '6px',
                sm: '10px',
                md: '14px',
                lg: '18px',
                xl: '24px',
                xxl: '32px',
            },
            borderRadius: {
                sm: '10px',
                md: '14px',
                lg: '18px',
                xl: '22px',
                pill: '999px',
            }
        },
    },
    plugins: [],
}