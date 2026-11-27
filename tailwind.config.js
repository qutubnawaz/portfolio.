export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#101214', bg2: '#191D20', ink: '#F5F3ED', accent: '#FF6B35', mute: '#A7ADB2' },
    fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'] },
  } },
  plugins: [],
}
