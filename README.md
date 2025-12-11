<div align="left">

# 🚧 Bookly - Event Management Platform

### 🎟️ Under Active Development

![Status](https://img.shields.io/badge/Status-Under_Construction-yellow?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

**A modern full-stack event discovery and booking platform**

</div>

---

## 📋 Project Overview

Bookly is a comprehensive event management platform that enables users to discover, create, and manage events. Built with cutting-edge web technologies, it provides a seamless experience for both event organizers and attendees.

### 🎯 Core Features (Planned)

- Event discovery with advanced filtering
- User authentication and authorization
- Event creation and management
- User profiles and event tracking
- Responsive, modern UI/UX
- Real-time updates and notifications

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16.0 (App Router)
- **UI Library:** React 19.2
- **Styling:** Tailwind CSS 4.0
- **Components:** Radix UI, Shadcn/ui
- **Form Management:** React Hook Form + Zod
- **State Management:** React Context API

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, CORS

---

## 📦 Build Plan & Progress

### Phase 1: Foundation ✅

- [x] Project setup and structure
- [x] Database schema design
- [x] Basic routing configuration
- [x] Development environment setup

### Phase 2: Authentication & User Management 🔄

- [x] User registration (signup)
- [x] User login with JWT
- [x] User logout functionality
- [x] Protected routes implementation
- [x] User profile page
- [x] User profile update functionality
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Profile picture upload

### Phase 3: Event Management 🔄

- [x] Event model and schema
- [x] Create event (authenticated users)
- [x] Get all events with pagination
- [x] Get event by ID
- [x] Get events by organizer
- [x] Update event
- [x] Delete event
- [x] Event filtering (category, date)
- [x] Event listing by user functionality
- [x] Show listed event of user in UI
- [ ] Event image upload
- [ ] Event capacity management
- [ ] Event status (draft, published, cancelled)

### Phase 4: Booking System 📅

- [ ] Booking model and schema
- [ ] Create booking
- [ ] View user bookings
- [ ] Cancel booking
- [ ] Booking confirmation emails
- [ ] Ticket generation
- [ ] QR code for tickets
- [ ] Check-in system

### Phase 5: UI/UX Enhancement 🎨

- [ ] Responsive design
- [ ] Modern component library (Radix UI)
- [x] Form validation
- [x] Toast notifications
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Animations and transitions
- [ ] Dark mode support
- [ ] Accessibility improvements

### Phase 6: Advanced Features 🚀

- [ ] Event recommendations
- [ ] User reviews and ratings
- [ ] Event categories and tags
- [ ] Social sharing
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Push notifications
- [ ] Analytics dashboard

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (right now its running locally)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bookly.git
cd bookly

# Backend setup
cd backend
npm install
# Create .env file with your configuration
npm run dev

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**

```env
MONGODB_URI=mongodb://localhost:27017/bookly
PORT=8080
JWT_SECRET=your_secret_key
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🎯 Upcoming Features

- 🔔 Real-time notifications
- 📧 Email integration
- 💳 Payment gateway integration
- 📱 Mobile app (React Native)
- 🌍 Multi-language support
- 📊 Analytics and insights

---

## 🤝 Contributing

This project is currently under active development. Contributions, issues, and feature requests are welcome!

---

<div align="left">

### 🚧 This project is actively being built. Check back for updates! 🚧

![Under Construction](https://img.shields.io/badge/🚧-Under_Construction-yellow?style=for-the-badge)

**Last Updated:** December 2025

</div>
