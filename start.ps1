# TikSave - Quick Start Script
# This script will help you set up and run the application

Write-Host "🚀 TikSave - TikTok Downloader Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. Install dependencies (first time setup)" -ForegroundColor White
Write-Host "2. Run backend server only" -ForegroundColor White
Write-Host "3. Run frontend only" -ForegroundColor White
Write-Host "4. Run both (backend + frontend)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        Set-Location ..
        
        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        
        Write-Host ""
        Write-Host "✓ Installation complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Edit backend/.env and add your RapidAPI key" -ForegroundColor Yellow
        Write-Host "   RAPIDAPI_KEY=your_actual_key_here" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Then run this script again and choose option 4 to start the app" -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
        Set-Location backend
        npm start
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting frontend..." -ForegroundColor Yellow
        Set-Location frontend
        npm run dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting both backend and frontend..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Opening backend in new window..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"
        
        Start-Sleep -Seconds 2
        
        Write-Host "Opening frontend in new window..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"
        
        Write-Host ""
        Write-Host "✓ Both servers are starting!" -ForegroundColor Green
        Write-Host "Check the new windows for server status" -ForegroundColor Cyan
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}
