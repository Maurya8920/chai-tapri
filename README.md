# ☕ Chai Tapri — 24x7 90s Hindi Film Music Radio

> **"Kadak Chai, Purani Yaadein, 90s Ke Afsaane"**  
> An ambient web radio streaming timeless 90s Bollywood classics 24x7 with authentic roadside tea stall ambiance, vintage vinyl record player, immersive rain atmosphere, and real-time community presence.

---

## 🌟 Features & Highlights

- **Seamless 24x7 Continuous Audio Stream**:
  - Engineered with a 100% hidden, off-screen YouTube IFrame audio bridge (`#youtubeBridge`).
  - No YouTube watermarks, video embeds, or UI controls visible to listeners.
  - Continuous full-song playback with native sequencing; automatically advances to the next track on `YT.PlayerState.ENDED`.
  - Loops seamlessly back to the beginning after the 41st song.
  - Initial load starts on a randomized track, followed by sequential playlist order.
  - Seamless error recovery (auto-skips unavailable or region-restricted videos on errors `100`, `101`, `150`).
- **41 Hand-Curated Golden Era Tracks**:
  - Full catalog of 90s romantic, monsoon, and nostalgic Hindi film classics stored locally in `src/chai-tapri-songs.json`.
  - Rich metadata: Track title, singers/artists, film/album name, and duration.
  - Integrated with browser **Media Session API** (lock screen / notification bar playback controls and artwork).
- **Delux Vintage Vinyl Player Bar**:
  - Frosted glassmorphism player dock floating at the base of the viewport.
  - **64px spinning circular vinyl record** with center spindle hole; spins synchronously during playback and pauses when paused.
  - Rotating Chaiwala one-liners ticker when idle ("*Chai garam hai boss, bas play button dabao!*", etc.).
  - Scrubbable progress bar, volume control, mute toggle, and previous/next track navigation.
- **🌧️ "Baarish?" Atmospheric Engine**:
  - One-click rain toggle from the hero pill button.
  - High-performance HTML5 Canvas particle rain simulation with puddle splashes and periodic lightning flash vignettes.
  - Web Audio API white-noise rain texture and stereo thunder rumble synthesizer (no external audio files needed).
- **🔴 Real-Time Online Presence Counter**:
  - Supabase Realtime Presence integration displaying live listener counts.
  - Built-in natural diurnal variation algorithm fallback when Supabase credentials are not configured.
- **Interactive Modals & Community Integrations**:
  - 💬 **Live Tapri Chat**: Interactive community chat simulation with realistic listener messages and live post capability.
  - 💰 **Part-Time Earning**: Modal linking to partner channel opportunities.
  - 🤝 **Support & Feedback**: Direct inquiry form with pre-configured mailto link (`pr@rjmedia.in`).
  - 📲 **WhatsApp Share**: One-click sharing with custom invite text.
- **Crawlable & SEO-Optimized Content Section**:
  - Rich Below-Hero content section rendered in warm dark wood/amber palette (`#120806`).
  - "Welcome to Chai Tapri" narrative story.
  - 3 Glass feature cards (*24x7 90s Radio*, *Rain & Ambience*, *Free & Open*).
  - 6-item interactive FAQ accordion.
  - Full semantic footer with copyright and quick navigation.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: YouTube IFrame Player API + Web Audio API (Rain & Thunder synthesis)
- **Presence / Backend (Optional)**: [Supabase Realtime](https://supabase.com/)
- **PWA Ready**: `vite-plugin-pwa` with manifest and service worker precaching

---

## 📁 Project Structure

```
chai-tapri/
├── dist/                     # Compiled production bundle ready for deployment
├── public/
│   ├── bg-clean.png          # High-resolution Chai Tapri background plate
│   ├── favicon.svg           # Hot chai cup SVG favicon
│   ├── manifest.json         # PWA Web App Manifest
│   ├── pwa-192x192.svg       # PWA 192px icon
│   └── pwa-512x512.svg       # PWA 512px icon
├── src/
│   ├── assets/               # Static bundled assets
│   ├── components/
│   │   ├── BelowHero.tsx     # Crawlable content: About story, 3 cards, FAQ, Footer
│   │   ├── EarningModal.tsx  # Part-Time Earning channel popup modal
│   │   ├── Hero.tsx          # Full viewport hero with giant Devanagari typography
│   │   ├── LiveChatModal.tsx # Interactive tapri listener chat modal
│   │   ├── OnlineBadge.tsx   # Realtime listener count badge
│   │   ├── PlayerBar.tsx     # Vintage glass player dock with spinning vinyl record
│   │   ├── RainEngine.tsx    # Canvas rain animator + Web Audio storm synth
│   │   ├── SupportModal.tsx  # Support & feedback inquiry modal
│   │   └── TopNav.tsx        # Glassy top bar with status, theme pill & links
│   ├── context/
│   │   └── PlayerContext.tsx # Central audio engine & state manager
│   ├── chai-tapri-songs.json # 41-song golden catalog with YouTube IDs & credits
│   ├── config.ts             # Global site metadata, URLs, and playlist ID
│   ├── App.tsx               # Main application container & offscreen audio bridge
│   ├── index.css             # Tailwind v4 directives & custom animations
│   └── main.tsx              # React DOM entry point
├── package.json              # Dependencies and build scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration with PWA plugin
```

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### 2. Installation
```bash
# Clone or navigate into the project directory
cd chai-tapri

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
This runs `tsc -b` and compiles optimized static assets into the `dist/` directory in ~1 second.

### 5. Preview Production Build
```bash
npm run preview
```
Runs a local preview server on `http://localhost:4173` testing the exact output in `dist/`.

---

## ⚙️ Configuration & Customization

### Changing Site Settings (`src/config.ts`)
Modify `src/config.ts` to update branding, email, or social links:

```typescript
export const CONFIG = {
  siteName: "Chai Tapri",
  playlistId: "PLinVjP-aRmls8uOhkaktXvWZv_fwgGyDz",
  siteUrl: "https://chaitapri.in",
  contactEmail: "pr@rjmedia.in",
  partTimeEarningUrl: "https://whatsapp.com/channel/0029VajyupYAjPXTOvgg2Z41",
  whatsappShareUrl: "https://api.whatsapp.com/send?text=",
};
```

### Adding or Modifying Songs (`src/chai-tapri-songs.json`)
The song catalog is stored as a simple JSON array. To add or adjust tracks, append objects to `src/chai-tapri-songs.json`:

```json
{
  "id": "e-ORhEE9VVg",
  "title": "Tip Tip Barsa Paani",
  "artist": "Udit Narayan, Alka Yagnik",
  "film": "Mohra (1994)",
  "duration": "5:58"
}
```

### (Optional) Supabase Realtime Setup
To connect real-time online listener tracking across multiple sessions:
1. Create a free project at [Supabase](https://supabase.com).
2. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. If omitted or left blank, the app will automatically use the built-in natural diurnal listener curve fallback without errors.

---

## 🌐 Deployment Guide

Because Chai Tapri is a pure client-side static web application, the generated `dist/` folder can be hosted anywhere for free or low cost.

### 1. Hostinger / cPanel Shared Hosting
1. Run `npm run build` to generate the `dist/` folder.
2. In Hostinger hPanel or cPanel, open **File Manager**.
3. Navigate to `public_html/`.
4. Upload all files from the `dist/` folder directly into `public_html/`.
5. Ensure `.htaccess` exists in `public_html/` to support SPA routing:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### 2. Vercel
1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

### 3. Netlify
1. Drag and drop the `dist/` folder directly into the Netlify Drop dashboard at [app.netlify.com/drop](https://app.netlify.com/drop), or:
2. Connect your Git repository to Netlify:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. If using client-side routing, add a `public/_redirects` file:
   ```
   /*    /index.html   200
   ```

---

## ☕ Attribution & Credits

- **Concept & Curation**: Chai Tapri Radio Team
- **UI Design Reference**: Inspired by [deluxsalon.in](https://deluxsalon.in/)
- **Music**: Timeless melodies by Bollywood legends of the 1990s (Kumar Sanu, Alka Yagnik, Udit Narayan, Lata Mangeshkar, Kavita Krishnamurthy, Sonu Nigam, and more)
- **Audio Stream**: YouTube IFrame Player API (non-hosted, non-commercial ambient radio stream)

---

*Enjoy your cup of chai and happy listening! ☕🎵*
