module.exports = {
  content: [
    "./pages/*.{html,js}",
    "./index.html",
    "./js/*.js",
    "./components/*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#000000", // black - ink depth, professional authority, craft precision
        secondary: "#2E86AB", // blue-600 - creative flow, trustworthy expertise, local connection
        accent: "#84cc16", // fresh green - action energy, completion celebration, creative spark
        
        // Background Colors
        background: "#FFFFFF", // white - clean canvas, content clarity, gallery space
        surface: "#F8F9FA", // gray-50 - subtle separation, card backgrounds, gentle depth
        
        // Text Colors
        'text-primary': "#1A1A1A", // gray-900 - extended reading comfort, professional communication
        'text-secondary': "#666666", // gray-600 - clear hierarchy, supporting information, accessible contrast
        
        // Status Colors
        success: "#28A745", // green-600 - quote completion, order confirmation, positive progress
        warning: "#FFC107", // yellow-500 - file requirements, deadline notices, helpful alerts
        error: "#DC3545", // red-600 - form validation, gentle correction, helpful guidance
        
        // Additional Grays for UI
        gray: {
          50: "#F8F9FA", // surface
          100: "#F1F3F4",
          200: "#E8EAED",
          300: "#E5E5E5", // border
          400: "#BDC1C6",
          500: "#9AA0A6",
          600: "#666666", // text-secondary
          700: "#5F6368",
          800: "#3C4043",
          900: "#1A1A1A", // text-primary
        },
        
        // Blue variations for secondary
        blue: {
          500: "#2E86AB", // secondary
          600: "#2E86AB",
          700: "#1F5F7A",
        },
        
        // Green variations for accent
        green: {
          500: "#84cc16", // accent fresh green
          600: "#65a30d",
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
        'sans': ['Open Sans', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
        'accent': ['Dancing Script', 'cursive'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'subheading': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'subtle': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'prominent': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'ink-flow': '0 10px 40px rgba(46, 134, 171, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'ink-flow': 'inkFlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        inkFlow: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'ease-in-out',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}