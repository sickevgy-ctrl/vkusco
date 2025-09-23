// Brand configuration — replace these values per your brandbook
// Colors are hex; fonts are Google Fonts names (or local font-families)
export default {
  name: 'Вкусная компания',
  colors: {
    // Olive green palette derived from the provided logo
    primary: '#3A4F2E',
    primary600: '#314426',
    primary700: '#293920',
    secondary: '#111827',
    accent: '#6F8F4B',
    surface: '#FFFFFF',
    muted: '#F3F4F6'
  },
  fonts: {
    primary: { family: 'Montserrat', weights: [300, 500, 900] },
    display: { family: 'Cormorant Garamond', weights: [400, 700] }
  },
  radius: {
    md: '12px',
    lg: '16px',
    xl: '20px'
  }
} as const
