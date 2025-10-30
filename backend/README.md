# SchoolPay Verify Backend API

Backend API for the SchoolPay Verify system - a comprehensive school payment verification platform.

## Features

- **Payment Code Generation**: Generate unique payment codes for students
- **Receipt Upload & Analysis**: AI-powered receipt verification using OpenAI
- **Admin Dashboard**: Comprehensive admin interface for managing receipts
- **Authentication**: JWT-based authentication for admin users
- **File Upload**: Secure file upload with validation
- **Database**: PostgreSQL via Supabase
- **Real-time Analytics**: Dashboard metrics and activity tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT
- **File Upload**: Multer
- **AI/OCR**: OpenAI GPT-4 Vision API
- **Image Processing**: Sharp

## Prerequisites

- Node.js (v14.x or higher)
- Supabase account
- OpenAI API key (optional, for AI features)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` and update with your credentials
   - Required variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Supabase anonymous key
     - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
     - `JWT_SECRET`: Secret key for JWT tokens
     - `OPENAI_API_KEY`: OpenAI API key (optional)

4. Initialize the database:
   ```bash
   npm run init-db
   ```
   This will display the SQL schema. Copy and run it in your Supabase SQL Editor.

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify JWT token

### Payment Codes

- `POST /api/payment-codes` - Generate payment code
- `GET /api/payment-codes/:code/verify` - Verify payment code
- `GET /api/payment-codes/:code` - Get payment code details

### Receipts

- `POST /api/receipts` - Upload receipt (multipart/form-data)
- `GET /api/receipts` - Get all receipts (Admin, with filters)
- `GET /api/receipts/:id` - Get receipt by ID (Admin)
- `GET /api/receipts/reference/:referenceId` - Get receipt by reference ID
- `PATCH /api/receipts/:id` - Update receipt status (Admin)
- `POST /api/receipts/bulk-update` - Bulk update receipts (Admin)

### Dashboard

- `GET /api/dashboard/metrics` - Get dashboard metrics (Admin)
- `GET /api/dashboard/activities` - Get recent activities (Admin)

## Database Schema

The system uses the following tables:

- **payment_codes**: Stores generated payment codes
- **receipts**: Stores uploaded receipts and analysis results
- **admin_users**: Admin user accounts
- **activity_logs**: System activity logs

See `src/utils/initDatabase.js` for the complete schema.

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database (Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# AI Services
OPENAI_API_KEY=your-openai-api-key

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,application/pdf

# Admin Credentials
ADMIN_EMAIL=admin@schoolpay.edu
ADMIN_PASSWORD=SchoolAdmin2025!

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── paymentCodeController.js
│   │   ├── receiptController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── upload.js            # File upload handling
│   │   ├── validator.js         # Request validation
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── paymentCodeRoutes.js
│   │   ├── receiptRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   └── aiService.js         # AI/OCR service
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── initDatabase.js      # Database initialization
│   └── server.js                # Main server file
├── uploads/                     # Uploaded files directory
├── .env                        # Environment variables
├── package.json
└── README.md
```

## AI Receipt Analysis

The system uses OpenAI's GPT-4 Vision API to analyze receipts:

1. Extracts payment amount, date, and transaction details
2. Verifies against expected payment information
3. Provides confidence score
4. Flags suspicious receipts
5. Auto-verifies high-confidence matches

## Authentication

The system uses JWT tokens for authentication:

- Admin users login with email/password
- JWT token is returned on successful login
- Token must be included in Authorization header: `Bearer <token>`
- Token expires after 24 hours (configurable)

## File Upload

- Accepts: JPG, PNG, PDF
- Maximum size: 10MB
- Files are stored in the `uploads/` directory
- Automatic file validation and sanitization

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

Run in production mode:
```bash
npm start
```

## Security Notes

1. Always use HTTPS in production
2. Keep JWT_SECRET secure and never commit it
3. Use strong admin passwords
4. Regularly update dependencies
5. Implement rate limiting in production
6. Use environment-specific configurations

## Testing

To test the API:

1. Use the provided Postman collection (if available)
2. Or use curl/httpie:

```bash
# Generate payment code
curl -X POST http://localhost:3001/api/payment-codes \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "studentId": "STU123456",
    "studentEmail": "john@example.com",
    "session": "2024/2025",
    "expectedAmount": 100.00
  }'

# Admin login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolpay.edu",
    "password": "SchoolAdmin2025!"
  }'
```

## Troubleshooting

**Database connection issues:**
- Verify Supabase credentials
- Check if Supabase project is active
- Run the SQL schema in Supabase SQL Editor

**File upload errors:**
- Check uploads directory permissions
- Verify MAX_FILE_SIZE setting
- Ensure file type is allowed

**AI analysis not working:**
- Verify OPENAI_API_KEY is set
- Check OpenAI account credits
- System falls back to manual review if AI fails

## License

MIT

## Support

For issues or questions, please contact support@schoolpay.edu
