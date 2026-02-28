# eBay Clone

A full-stack e-commerce marketplace application inspired by eBay, built with modern technologies.

## Features

### User Features
- User authentication (register, login, logout)
- Profile management
- Password reset via email
- Email verification

### Buying Features
- Browse products by categories
- Advanced search with filters
- Product details with multiple images
- Add to cart functionality
- Secure checkout with Stripe
- Order history
- Product reviews and ratings

### Selling Features
- Create product listings
- Upload multiple images
- Set prices (fixed, auction, best offer)
- Manage inventory
- Track sales and performance
- Store customization

### Auction Features
- Real-time bidding
- Bid history
- Outbid notifications
- Automatic bid increments
- Auction timer

### Communication
- Buyer-seller messaging system
- Real-time chat with WebSockets
- Notification system (email + in-app)

### Admin Features
- User management
- Content moderation
- Dispute resolution
- Analytics dashboard

## Tech Stack

### Frontend
- React.js
- Redux Toolkit (state management)
- TailwindCSS (styling)
- React Router (routing)
- Stripe.js (payments)
- Socket.io-client (real-time)
- Axios (HTTP requests)

### Backend
- Node.js
- Express.js
- PostgreSQL (database)
- Prisma (ORM)
- Redis (caching)
- Elasticsearch (search)
- JWT (authentication)
- Socket.io (real-time)
- Nodemailer (emails)
- Stripe (payments)
- AWS S3 (file storage)

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis
- Elasticsearch
- Docker (optional)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ebay-clone.git
cd ebay-clone