# TikSave - TikTok Video Downloader

A modern, full-stack TikTok video downloader application built with Node.js backend and React.js frontend. Download TikTok videos in HD quality without watermarks.

## ✨ Features

- 🎥 Download TikTok videos without watermark (HD quality)
- 💧 Download videos with watermark
- 🎵 Extract audio as MP3
- 🎨 Modern, responsive UI with dark mode
- ⚡ Fast and secure
- 📱 Mobile-friendly design

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- RapidAPI (TikTok Downloader API)
- Axios for HTTP requests
- CORS enabled

**Frontend:**
- React.js 18
- Vite (fast build tool)
- React Router for navigation
- TailwindCSS for styling
- Material Symbols icons

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher) installed
- npm or yarn package manager
- RapidAPI account with TikTok Downloader API subscription

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/HyuraFE/Project-Tiktok.git
cd Project-Tiktok
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file and add your RapidAPI key
# RAPIDAPI_KEY=your_actual_rapidapi_key_here

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Getting RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in
3. Search for "TikTok Downloader" API
4. Subscribe to the API (free tier available)
5. Copy your API key from the dashboard
6. Paste it in `backend/.env` file

## 📖 Usage

1. Open your browser and go to `http://localhost:5173`
2. Paste a TikTok video URL in the input field
3. Click "Download Now"
4. Wait for the video preview to load
5. Choose your download option:
   - **Download MP4 (HD)** - High quality without watermark
   - **With Watermark** - Original video with TikTok watermark
   - **Extract Audio (MP3)** - Audio only

## 📁 Project Structure

```
Project-Tiktok/
├── backend/
│   ├── controllers/
│   │   └── tiktokController.js
│   ├── routes/
│   │   └── tiktokRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── BottomNav.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Preview.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🎨 Design Features

- **Color Scheme**: Purple primary (#a413ec) with dark mode support
- **Typography**: Plus Jakarta Sans font family
- **Icons**: Material Symbols Outlined
- **Effects**: Glass morphism, smooth transitions, hover states

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure port 5000 is not in use
- Check if `.env` file exists with valid RapidAPI key

**Frontend won't start:**
- Make sure port 5173 is not in use
- Delete `node_modules` and run `npm install` again

**Downloads not working:**
- Verify your RapidAPI key is valid
- Check if you have remaining API quota
- Ensure backend server is running

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🌐 Deployment

### Deploy to Vercel

This project can be easily deployed to Vercel:

1. **Push to GitHub** (already done ✅)
2. **Import to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables (see below)
3. **Environment Variables**:
   - `RAPIDAPI_KEY`: Your RapidAPI key
   - `RAPIDAPI_HOST`: `tiktok-video-no-watermark2.p.rapidapi.com`
4. **Deploy!**

For detailed instructions, see [Vercel Deployment Guide](./VERCEL_DEPLOY.md)

**Quick Deploy:**
```bash
# Commit and push changes
.\deploy.ps1

# Or manually:
git add .
git commit -m "Deploy to production"
git push origin master
```

## 👤 Author

**HyuraFE**
- GitHub: [@HyuraFE](https://github.com/HyuraFE)
- Email: notohyura@gmail.com

## 🙏 Acknowledgments

- TikTok Downloader API by RapidAPI
- Design inspiration from modern mobile apps
- React and Vite communities
