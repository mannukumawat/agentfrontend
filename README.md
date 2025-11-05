# CRM Frontend

React frontend for CRM system with role-based dashboards.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

The app will run on `http://localhost:3000` by default.

## Features

- **Login**: Authenticate as Admin or Agent
- **Admin Dashboard**: Manage agents and customers, assign customers to agents
- **Agent Dashboard**: View assigned customers
- **Customer Management**: Create, edit, view customers with file uploads
- **Call History**: Add and view call history for customers

## Components

- `Login`: Authentication form
- `AdminDashboard`: Admin-specific features
- `AgentDashboard`: Agent-specific features
- `CustomerList`: Paginated list with filters
- `CustomerForm`: Create/edit customer with file uploads
- `CustomerDetail`: View customer details and call history
- `CallHistoryForm`: Add call history entries

## State Management

Uses React Context (`AuthContext`) for authentication state.

## Routing

- `/login` - Login page
- `/admin` - Admin dashboard
- `/agent` - Agent dashboard
- `/customers` - Customer list
- `/customers/new` - Create customer
- `/customers/:id` - Customer details
- `/customers/:id/edit` - Edit customer
