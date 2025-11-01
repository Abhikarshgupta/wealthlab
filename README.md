# Wealth Manager

A comprehensive financial planning and investment calculator application built with React and Vite.

## Features

- Multiple investment calculators (SIP, SGB, FD, NSC, etc.)
- Real-time gold price fetching via GoldAPI.io
- Goal planning and corpus calculation
- Dark mode support
- Responsive design

## Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
VITE_GOLDAPI_KEY=your-goldapi-key-here
```

To get your GoldAPI.io API key:
1. Sign up at https://www.goldapi.io/
2. Copy your API key from the dashboard
3. Add it to `.env.local` file

**Note:** The `.env.local` file is gitignored and won't be committed to version control.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Gold Price API

The application uses GoldAPI.io for fetching real-time gold prices. The API has rate limiting:
- **Rate Limit**: Once per user per 24 hours (stored in localStorage)
- **Fallback**: If API fails or rate limit is reached, uses fallback price (₹6,500/gram)
- **Caching**: API responses are cached for 1 hour

The API key is stored in environment variables and supports fetching prices for:
- Gold (XAU)
- Silver (XAG)
- Platinum (XPT)
- Palladium (XPD)

## Project Structure

```
src/
├── components/
│   ├── calculators/      # Individual calculator components
│   └── common/          # Reusable UI components
├── utils/
│   ├── calculations.js  # Financial calculation functions
│   ├── goldPriceService.js  # Gold price API integration
│   └── formatters.js    # Formatting utilities
└── store/              # Zustand state management
```

## Technologies

- React 19
- Vite
- TailwindCSS
- React Hook Form
- Zustand
- Highcharts

## License

MIT
