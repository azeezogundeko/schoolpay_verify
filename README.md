# SchoolPay Verify

A comprehensive school payment verification system that allows students to generate payment codes, upload receipts, and enables administrators to review and verify payments efficiently using AI-powered receipt analysis.

## 🎯 Overview

SchoolPay Verify streamlines the payment verification process for educational institutions by:
- Generating unique payment codes for students
- Accepting receipt uploads with automatic AI analysis
- Providing an admin dashboard for efficient payment review
- Using OpenAI GPT-4 Vision for intelligent receipt verification

## ✨ Features

### Student Features
- **Payment Code Generation**: Generate unique, time-bound payment codes
- **Receipt Upload**: Upload payment receipts (JPG, PNG, PDF up to 10MB)
- **Real-time Processing**: See upload and verification progress
- **Status Tracking**: Check verification status anytime

### Admin Features
- **Dashboard Analytics**: View metrics and statistics
- **Receipt Management**: Review, approve, or reject receipts
- **Bulk Operations**: Process multiple receipts simultaneously
- **Activity Logs**: Track all system activities
- **AI-Assisted Review**: Automatic receipt analysis with confidence scores
- **Advanced Filtering**: Filter by status, session, date range, amount

### AI-Powered Analysis
- Automatic text extraction from receipts
- Payment amount and date verification
- Confidence scoring
- Automatic flagging of suspicious receipts
- Match validation against expected payment details

## 🏗️ Architecture

This is a full-stack application with:
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase)
- **AI/OCR**: OpenAI GPT-4 Vision API
- **Authentication**: JWT-based

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Supabase account (for database)
- OpenAI API key (optional, for AI features)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd schoolpay_verify
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Configure environment variables
# Update .env with your API keys

# Start frontend development server
npm start
```

The frontend will run on `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Configure environment variables
# Update backend/.env with your credentials

# Initialize database
npm run init-db
# Copy and run the SQL output in Supabase SQL Editor

# Start backend development server
npm run dev
```

The backend API will run on `http://localhost:3001`

## 📁 Project Structure

```
schoolpay_verify/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (AI, etc.)
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Main server file
│   ├── uploads/               # Uploaded files
│   ├── .env                   # Backend environment variables
│   └── package.json
├── src/                       # Frontend source
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components
│   │   ├── payment-code-generation/
│   │   ├── receipt-upload/
│   │   ├── upload-confirmation-status/
│   │   ├── admin-login/
│   │   ├── admin-dashboard/
│   │   └── receipt-review-detail/
│   ├── styles/                # Global styles
│   ├── App.jsx                # Main app component
│   └── Routes.jsx             # Route definitions
├── public/                    # Static assets
├── .env                       # Frontend environment variables
└── package.json               # Frontend dependencies
```

## 🔧 Configuration

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend Environment Variables (backend/.env)
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
ADMIN_EMAIL=admin@schoolpay.edu
ADMIN_PASSWORD=SchoolAdmin2025!
FRONTEND_URL=http://localhost:5173
```

## 🎓 User Workflows

### Student Workflow
1. Visit the application
2. Enter student details and generate payment code
3. Make payment (external)
4. Upload payment receipt with the code
5. System processes and analyzes receipt
6. Check verification status

### Admin Workflow
1. Login to admin portal
2. View dashboard with metrics
3. Review pending receipts
4. Approve, reject, or flag receipts
5. Add notes for students
6. Export reports

## 🔐 Authentication

**Admin Login:**
- Default credentials:
  - Email: `admin@schoolpay.edu`
  - Password: `SchoolAdmin2025!`

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Payment Codes
- `POST /api/payment-codes` - Generate payment code
- `GET /api/payment-codes/:code/verify` - Verify code

### Receipts
- `POST /api/receipts` - Upload receipt
- `GET /api/receipts` - List all receipts (Admin)
- `PATCH /api/receipts/:id` - Update receipt status (Admin)

### Dashboard
- `GET /api/dashboard/metrics` - Get metrics (Admin)
- `GET /api/dashboard/activities` - Get activities (Admin)

Full API documentation available in `backend/README.md`

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Redux Toolkit
- React Router v6
- React Hook Form
- Framer Motion
- Recharts / D3.js

### Backend
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT Authentication
- Multer (file upload)
- OpenAI API
- Bcrypt

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests (if configured)
cd backend
npm test
```

## 📦 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or Render
- Ensure environment variables are set
- Set up Supabase in production

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS configuration
- Input sanitization
- SQL injection prevention via Supabase client

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React, Node.js, and Supabase
- AI capabilities by OpenAI
- UI components styled with TailwindCSS

## 📞 Support

For issues or questions:
- Email: support@schoolpay.edu
- Phone: +1 (555) 123-4567
- Hours: 9 AM - 6 PM

---

Built with ❤️ for educational institutions
