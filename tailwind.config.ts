import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Classical Art Enhancement Colors
        "classical-gold": "hsl(var(--classical-gold))",
        "classical-bronze": "hsl(var(--classical-bronze))",
        "royal-purple": "hsl(var(--royal-purple))",
        "marble-white": "hsl(var(--marble-white))",
        "ink-black": "hsl(var(--ink-black))",
        
        feynman: {
          navy: "hsl(var(--feynman-navy))",
          terminal: "hsl(var(--feynman-terminal))",
          quantum: "hsl(var(--feynman-quantum))",
          classical: "hsl(var(--feynman-classical))",
          warm: "hsl(var(--feynman-warm))",
          cool: "hsl(var(--feynman-cool))",
          text: "hsl(var(--feynman-text))",
          muted: "hsl(var(--feynman-muted))",
          subtle: "hsl(var(--feynman-subtle))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-classical': 'var(--gradient-classical)',
        'gradient-marble': 'var(--gradient-marble)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-royal': 'var(--gradient-royal)',
        'gradient-terminal': 'var(--gradient-terminal)',
        'pattern-grid': 'var(--pattern-grid)',
        'pattern-dots': 'var(--pattern-dots)',
        'pattern-terminal': 'var(--pattern-terminal)',
        'pattern-classical': 'var(--pattern-classical)',
        'pattern-renaissance': 'var(--pattern-renaissance)',
        'pattern-marble-veins': 'var(--pattern-marble-veins)',
        'pattern-classical-grid': 'var(--pattern-classical-grid)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
        'classical': 'var(--shadow-classical)',
        'glow': 'var(--shadow-glow)',
        'royal': 'var(--shadow-royal)',
        'terminal': 'var(--shadow-terminal)',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
        'physics': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "classical-float": "classical-float 25s ease-in-out infinite",
        "quantum-pulse": "quantum-pulse 2.5s ease-in-out infinite",
        "energy-wave": "energy-wave 4s ease-in-out infinite",
        "typewriter": "typewriter 3s steps(40, end)",
        "cursor-blink": "cursor-blink 1s infinite step-end",
        "marble-shimmer": "marble-shimmer 3s ease-in-out infinite",
        "royal-entrance": "royal-entrance 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "particle-float": "particle-float 25s linear infinite",
        "terminal-glow": "terminal-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
