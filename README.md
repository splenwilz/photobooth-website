# PhotoBoothX Website

The official website and web dashboard for **PhotoBoothX** — professional photo booth software trusted by 10,000+ operators worldwide.

## About

PhotoBoothX is a complete photo booth solution that includes:

- **Desktop App**: Capture photos, apply templates, and print instantly (Windows & Mac)
- **Mobile App**: Monitor and manage booths remotely (iOS & Android)
- **Web Dashboard**: Analytics, alerts, and booth management
- **Admin Panel**: User management, subscriptions, and revenue tracking

## Features

- 📷 **Camera Integration**: USB webcams (Logitech C920, C922, BRIO) and DSLR tethering (Canon, Nikon, Sony)
- 🖨️ **Instant Printing**: DNP, HiTi, and Mitsubishi dye-sub printers
- 🎨 **100+ Templates**: Photo strips, 4x6, GIFs, boomerangs
- 💳 **Payments**: Coin acceptors, card readers, and custom pricing
- 📱 **Mobile Management**: Real-time alerts, revenue tracking, remote restart
- 📊 **Analytics**: Transaction history, revenue reports, usage stats

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **React**: v19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```
app/
├── (main)/          # Public pages (home, features, pricing, docs, downloads)
├── (auth)/          # Authentication (signin, signup)
├── (dashboard)/     # User dashboard (booths, analytics, alerts, settings)
└── (admin)/         # Admin panel (users, subscriptions, revenue, tickets)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd photobooth-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Related Projects

- **PhotoBoothX Desktop**: Main booth software (Windows)
- **PhotoBoothX Mobile**: Companion app (iOS/Android)

## License

Proprietary - All rights reserved.
