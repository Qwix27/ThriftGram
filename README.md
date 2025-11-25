# Thrift Marketplace

A modern, full-stack thrift marketplace built with Next.js 14, React 18, Supabase, and Stripe. This application allows users to buy and sell pre-loved items in a beautiful, responsive interface.

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS and Framer-inspired design system
- **User Authentication**: Secure authentication with Supabase Auth
- **Product Management**: Create, edit, and manage product listings
- **Image Upload**: Secure image upload and storage with Supabase Storage
- **Payment Processing**: Integrated Stripe payments for secure transactions
- **Real-time Updates**: Live updates using Supabase real-time subscriptions
- **Responsive Design**: Mobile-first design that works on all devices
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.0.0 or later
- npm 8.0.0 or later
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd thrift-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your actual values:

- **Supabase**: Get your project URL and anon key from your Supabase dashboard
- **Stripe**: Get your publishable and secret keys from your Stripe dashboard
- **NextAuth**: Generate a secret key for NextAuth

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations (if any) in your Supabase SQL editor
3. Enable Row Level Security (RLS) on your tables
4. Set up storage buckets for image uploads

### 5. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhooks for payment processing

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
thrift-marketplace/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (dashboard)/     # Dashboard routes
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable components
│   │   ├── ui/              # Base UI components
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility functions
│   │   ├── supabase.ts      # Supabase client
│   │   ├── stripe.ts        # Stripe configuration
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Design System

The project uses a custom design system inspired by Framer with:

- **Color Palette**: Primary, secondary, accent, success, warning, error, and neutral colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to other platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

See `.env.local.example` for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/thrift-marketplace/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer](https://framer.com/) for design inspiration

---

Made with ❤️ by [Your Name]


