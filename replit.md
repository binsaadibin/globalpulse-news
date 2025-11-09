# GlobalPulse News Platform

A full-stack multilingual international news platform built with React, featuring support for English, Arabic, and Urdu languages with proper RTL support.

## Overview

GlobalPulse News is a comprehensive news platform similar to BBC or Al Jazeera, featuring:

- **Multilingual Support**: Full support for English, Arabic, and Urdu with automatic RTL/LTR direction switching
- **Animated Theme Switching**: Smooth transitions between light and dark modes
- **Admin Dashboard**: Secure admin area for managing news articles and videos
- **Search & Filter**: Global search functionality and category/platform filtering
- **Video Integration**: Support for YouTube, Facebook, TikTok, and Instagram embeds
- **Multi-Admin System**: Support for multiple admin users with authentication

## Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Navigation header with search and auth
│   │   ├── Footer.tsx       # Site footer with multilingual support
│   │   ├── NewsCard.tsx     # Article display cards
│   │   ├── VideoCard.tsx    # Video embed cards
│   │   ├── LanguageSelector.tsx  # Language switching component
│   │   ├── ThemeToggle.tsx  # Dark/light mode toggle
│   │   ├── GlobalSearch.tsx # Search functionality
│   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   ├── contexts/            # React context providers
│   │   ├── ThemeContext.tsx      # Theme state management
│   │   ├── LanguageContext.tsx   # Language state management
│   │   └── AuthContext.tsx       # Authentication state
│   ├── pages/               # Application pages
│   │   ├── Home.tsx         # Main news homepage with search/filter
│   │   ├── Videos.tsx       # Video gallery with search/filter
│   │   ├── Dashboard.tsx    # Admin content management (protected)
│   │   └── Login.tsx        # Admin login page
│   └── App.tsx              # Main app with routing and providers
```

## Features

### Multilingual Support
- **Languages**: English, Arabic, Urdu
- **RTL Support**: Automatic direction switching for Arabic and Urdu
- **Fonts**: 
  - Noto Sans (English)
  - Noto Naskh Arabic (Arabic)
  - Noto Nastaliq Urdu (Urdu with enhanced line-height)

### Theme System
- Smooth animated transitions between light and dark modes
- All elements animate color changes (backgrounds, text, borders)
- Theme preference persisted in localStorage

### Authentication System
- Multi-admin support with credentials stored securely
- Protected dashboard route requiring authentication
- Login/logout functionality with session persistence
- Current user display in dashboard

**Demo Admin Accounts**:
- Username: `admin1`, Password: `admin123`
- Username: `admin2`, Password: `admin456`
- Username: `editor1`, Password: `editor123`

### Search & Filtering

**Homepage (Articles)**:
- Real-time search across article titles and descriptions
- Category filtering (Technology, Business, Sports, Politics, Environment, Health)
- Combined search and filter functionality
- Empty state handling

**Videos Page**:
- Real-time search across video titles and descriptions
- Platform filtering (YouTube, Facebook, TikTok, Instagram)
- Combined search and filter functionality
- Empty state handling

**Global Search**:
- Available in header on all pages
- Mobile-responsive with search in mobile menu
- Multilingual placeholders

### Dashboard Features
- **Protected Access**: Only accessible to authenticated admins
- **Current User Display**: Shows logged-in admin username
- **Article Management**:
  - Multilingual input fields (English, Arabic, Urdu)
  - Category selection
  - Image URL input
  - Publish/Draft actions
- **Video Management**:
  - Multilingual input fields
  - Platform selection (YouTube, Facebook, TikTok, Instagram)
  - Video URL input
  - Publish/Draft actions

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts (1-column mobile, 2-column tablet, 3-column desktop)
- Touch-friendly interface elements

## Technology Stack

**Frontend**:
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS for styling
- Shadcn UI components
- Lucide React icons

**Backend** (TODO):
- Express.js
- MongoDB Atlas
- Currently using in-memory storage for demo

## Color Scheme

**Light Mode**:
- Background: Very light blue-gray (#F9FAFB)
- Primary: Professional blue (#2563EB)
- Card: Light gray (#F3F4F6)

**Dark Mode**:
- Background: Deep dark blue-gray (#141619)
- Primary: Lighter blue (#3B82F6)
- Card: Dark gray (#1A1D21)

## Animation Details

All theme transitions use `300ms ease` timing:
- Background colors
- Text colors
- Border colors
- Card elevations
- Button states

## User Preferences

All user preferences are stored in localStorage:
- Selected theme (light/dark)
- Selected language (en/ar/ur)
- Authentication session (currentUser)

## Development Notes

- The application uses mock data for demonstration
- Admin authentication uses client-side validation (TODO: backend integration)
- All mock functionality is marked with `//todo: remove mock functionality` comments
- Real backend integration pending for:
  - Article/video CRUD operations
  - User authentication API
  - MongoDB Atlas connection

## Design Guidelines

Follows professional news platform design patterns:
- Information density with clean spacing
- Professional color palette
- Smooth animations without being distracting
- Accessibility-first approach
- Mobile-responsive layouts
