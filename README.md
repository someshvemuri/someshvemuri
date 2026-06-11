# Modern Portfolio - Next.js + Tailwind CSS

A sleek, modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion. Features smooth animations, responsive design, and a contemporary aesthetic.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React meta-framework for production
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Motion library for React
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Language**: TypeScript - Type safety
- **Deployment**: GitHub Pages or Vercel

## 🎨 Features

✨ **Modern Design** - Clean, minimalist aesthetic with contemporary touches
⚡ **Smooth Animations** - Framer Motion for delightful micro-interactions
📱 **Fully Responsive** - Mobile-first design that works on all devices
🎯 **Performance Optimized** - Next.js image optimization and code splitting
🌐 **SEO Ready** - Metadata and semantic HTML
♿ **Accessible** - WCAG compliant components

## 🛠️ Setup

### Prerequisites
- Node.js 18+ and npm/yarn installed

### Installation

1. **Navigate to the portfolio directory:**
   ```bash
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Visit `http://localhost:3000` to see your portfolio

### Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment to GitHub Pages

### Option 1: Deploy with Static Export

1. **Update `next.config.js`:**
   ```javascript
   const nextConfig = {
     output: 'export',
     reactStrictMode: true,
     swcMinify: true,
   }
   module.exports = nextConfig
   ```

2. **Build and push:**
   ```bash
   npm run build
   git add .
   git commit -m "Deploy modern portfolio"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select `main` and `/root`

### Option 2: Deploy with Vercel (Recommended)

```bash
npx vercel
```

## 📋 File Structure

```
portfolio/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation with scroll effect
│   ├── Hero.tsx         # Hero section with animations
│   ├── Experience.tsx   # Work experience timeline
│   ├── Skills.tsx       # Skills showcase grid
│   └── Contact.tsx      # Contact section
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎯 Customization

Edit `components/` and `app/page.tsx` with your information. Styles are in `tailwind.config.js` and `app/globals.css`.

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## License

MIT

Built with ❤️ using modern web technologies.
