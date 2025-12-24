# 🚗 Driver Management System

A comprehensive, professional web-based management system for driver operations, deliveries, and salary tracking.

## 🎯 Overview

The Driver Management System is a full-featured back-office application designed for businesses that manage delivery drivers and partner companies. The system handles everything from driver onboarding to salary calculations, advances, and comprehensive reporting.

## ✨ Features

### 👥 Driver Management
- Complete driver profiles with personal information
- Document management (ID, Passport) with secure storage
- Driver status tracking (Training, Active, Suspended)
- Performance monitoring and KPI tracking
- WhatsApp integration for direct communication

### 🏢 Company Management
- Partner company profiles and contact information
- Flexible pricing models (per order / per stop)
- Custom order field requirements per company
- Fixed delivery instructions
- Company status management (Active / Paused)

### 📦 Order Management
- Dynamic order creation based on company settings
- Automatic revenue calculation
- Driver assignment
- Order status tracking
- Weekly and yearly organization

### 💰 Salary System
- Automated weekly salary calculation
- Training period handling (2 weeks, no salary)
- Bonus system for orders exceeding targets
- Manual waiver option with mandatory notes
- Salary history and tracking

### 💳 Advance/Loan System
- Flexible advance payments to drivers
- One-time or installment payment options
- Automatic deductions from weekly salaries
- Outstanding balance tracking
- Payment history

### 📊 Dashboard & Reports
- Real-time statistics and KPIs
- Revenue, profit, and salary tracking
- Driver performance rankings
- Company revenue distribution
- Weekly and monthly trends
- Export capabilities (PDF, Excel)

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide Icons** - Modern icon library

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage for documents
  - Real-time subscriptions

### Additional Libraries
- `react-hook-form` - Form management
- `zod` - Schema validation
- `date-fns` - Date manipulation
- `jspdf` & `xlsx` - Report generation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Set up the database**
   - Open Supabase SQL Editor
   - Copy and execute the contents of `database.sql`
   - This will create all tables, indexes, and sample data

6. **Configure Storage (for documents)**
   - Go to Supabase Storage
   - Create a new bucket named `driver-documents`
   - Set it to public access
   - Update CORS settings if needed

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
webapp/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── drivers/         # Driver management pages
│   │   ├── companies/       # Company management pages
│   │   ├── orders/          # Order management pages
│   │   ├── salaries/        # Salary management pages
│   │   ├── advances/        # Advance management pages
│   │   ├── reports/         # Reports pages
│   │   ├── settings/        # Settings pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Dashboard
│   ├── components/          # Reusable React components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── lib/                 # Library configurations
│   │   └── supabase.ts      # Supabase client
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   └── styles/              # Global styles
│       └── globals.css
├── public/                  # Static assets
├── database.sql             # Database schema
├── .env.example             # Environment template
├── .env.local               # Local environment (create this)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 💼 Business Logic

### Salary Calculation Rules

1. **Training Period**: First 2 weeks = £0 salary
2. **Below Target** (< 100 orders):
   - Default: £0 salary
   - Option: Admin can waive and pay £120 with mandatory note
3. **Meets Target** (= 100 orders): £120 base salary
4. **Exceeds Target** (> 100 orders): £120 + £1 per extra order

### Revenue Calculation
- **Per Order**: Fixed price × 1
- **Per Stop**: Price per stop × number of stops

### Advance Deductions
- Automatically deducted from weekly salary
- Cannot exceed salary amount
- Tracks remaining balance
- Supports installment plans

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Prepared for theme switching
- **Professional Dashboard**: Clean, modern interface
- **Real-time Search**: Fast filtering across all pages
- **Data Visualization**: Charts and graphs for insights
- **Intuitive Navigation**: Sidebar with clear sections
- **Modal Forms**: Clean popup forms for data entry
- **Status Badges**: Color-coded status indicators

## 🔐 Security Considerations

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) ready
- Input validation with Zod schemas
- SQL injection protection via Supabase
- Secure file upload handling
- Admin-only access (no driver login)

## 📊 Database Schema

### Key Tables
- `drivers` - Driver information and status
- `companies` - Partner company details
- `company_order_settings` - Custom field requirements
- `orders` - Order records with revenue tracking
- `weekly_salaries` - Salary calculations and history
- `advances` - Advance/loan records
- `advance_payments` - Payment tracking

All tables include:
- UUID primary keys
- Created/updated timestamps
- Proper foreign key relationships
- Indexes for performance

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
The application can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Run
- Any Node.js hosting

Remember to set environment variables in your hosting platform.

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Email integration
- [ ] SMS alerts to drivers
- [ ] Advanced analytics
- [ ] Mobile app for drivers
- [ ] GPS tracking integration
- [ ] Multi-language support (Arabic)
- [ ] Expense tracking
- [ ] Vehicle management
- [ ] Customer ratings

## 🐛 Troubleshooting

### Common Issues

**Database connection error**
- Verify Supabase credentials in `.env.local`
- Check if database tables are created

**Image upload not working**
- Ensure storage bucket is created
- Check bucket permissions (public)
- Verify CORS settings

**Build errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📝 License

This project is proprietary and confidential.

## 👨‍💻 Support

For issues, questions, or feature requests, please contact the development team.

---

**Built with ❤️ for efficient driver management**
