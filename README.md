# SurfBoard

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Project Overview

A weather-focused dashboard designed for surfers to check optimal surfing conditions before heading out by providing real-time weather analysis.

**Tech Stack & Approach:**
- Next.js 16.1.1 with React 19.2.3 and TypeScript
- SCSS modules for component-scoped styling
- React compiler (Babel plugin) for optimization
- **Motion** (Framer Motion) - Smooth entrance animations for chart displays
- **React Google Charts** - Visualization of weather data across multiple chart types
- **OpenMeteo** - Free weather API client for forecasting and geocoding
- **Sass** - Preprocessing for stylesheets

**Architecture:** Server-rendered layout with a client-side Dashboard component. Component-based structure (Header, Dashboard) with separation of concerns.

## React Hooks Usage

- **`useState`** (6 instances):
  - `isLoading` - Tracks loading state during API calls
  - `loc` - Stores user input (city/zipcode)
  - `windSpeedData, windDirectionData, visData, rainData` - Store chart data arrays
  - `colorScheme, chartColor, chartTextColor` - Track system theme preferences

- **`useEffect`** (1 instance):
  - Detects system color scheme preference via `window.matchMedia('prefers-color-scheme')`
  - Dynamically updates chart styling to match OS theme (dark/light)

## Key Concepts & Features

### Dual API Integration
- **Geocoding API**: Converts city/zipcode input → latitude/longitude (Open-Meteo)
- **Weather Forecast API**: Retrieves hourly and daily weather conditions

### Data Transformation Pipeline
- Processes raw weather API response into 24-hour arrays
- Structures data specifically for Google Charts (requires `[label, value]` format)
- Handles timezone conversion using UTC offset
- Builds 4 separate datasets: wind speed, wind direction, visibility, precipitation

### Chart Types
- **Wind Speed**: Line chart (24-hour progression)
- **Wind Direction**: Line chart (degrees 0-360)
- **Visibility**: Scatter chart (distance in meters)
- **Precipitation**: Area chart (rain + snowfall overlay)

### System Theme Detection
- Uses `window.matchMedia()` to detect OS preference
- Automatically adjusts chart backgrounds and text colors
- Responsive to system setting changes

### Animations
- Uses Motion's `AnimatePresence` and `motion.div`
- Charts scale from 0 to 1 with fade-out on unmount
- 0.5s animation duration for smooth presentation

### State Management
- Conditional rendering: shows loading message → displays charts → returns to prompt
- Form validation: button disabled until location is entered
- Loading indicator ("Dipping our toes...") during data fetch

## User Flow

1. User enters city/zipcode in form
2. Form submission triggers geocoding lookup
3. Loading state activated
4. Weather data fetched for coordinates
5. 24-hour data transformed into chart format
6. Charts animate in after 1.5s delay
7. User can enter new location to reset/reload

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.