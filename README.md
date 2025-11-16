# Invoice Management System

An invoice generating website with automated task-based email scheduling functionality.

## Features

- 📊 **Dashboard** - Statistics and analytics for invoices and accounts
- 💼 **Account Management** - Full CRUD operations for client accounts
- 🧾 **Invoice Management** - Create, edit, and manage invoices with template support
- 📧 **Email Scheduler** - Automated email delivery for invoices
- 💱 **Multi-Currency Support** - USD and Georgian Lari with NBG exchange rate integration
- 🔄 **Recurring Invoices** - Automatic invoice creation on specific days with fixed amounts
- 📝 **Template System** - PI ID generation with YY+AccountID+ExtraID+MM format

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   └── figma/          # Figma imported components
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── data/               # Mock data
├── styles/             # Global styles
├── imports/            # Figma design imports
└── App.tsx             # Main application component
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4.0** - Styling
- **Shadcn/UI** - Component library
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **date-fns** - Date manipulation

## Database Integration (Future)

To persist data across sessions, integrate with Supabase:
- Store invoices, accounts, templates, and email schedules
- Real-time updates
- User authentication

## License

Private project for client invoice management.
