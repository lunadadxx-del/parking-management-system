# Product Requirements Document (PRD): Parking Management System

## 1. Overview
The Parking Management System is a modern, full-stack web application designed to track parking lots, manage vehicle parking/checkout, and provide real-time analytics. It serves as a centralized dashboard for parking attendants and administrators.

## 2. Current State (V1)
The application currently supports the following core capabilities:
- **Parking Lot Management:** Create, view, and delete parking lots with defined capacities and hourly rates.
- **Vehicle Tracking:** Park vehicles using license plate recognition, assign them to specific lots, and automatically calculate checkout charges based on duration.
- **Real-Time Dashboard:** Display live statistics, including available spaces, parked vehicles, and total lots.

### 2.1 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express
- **Database:** SQLite (Tables: `parking_lots`, `vehicles`, `users`)

## 3. Planned Features (V2 & Beyond)

### 3.1 User Management & Roles (Next Up)
- Implement user login/registration and expose the existing `users` table via API.
- Define roles: **Admin** (can manage lots, view revenue) and **Attendant** (can only park/checkout vehicles).

### 3.2 Payment Integration
- Add Stripe/PayPal integration for automated payment collection upon vehicle checkout.
- Generate digital receipts.

### 3.3 Reservation System
- Allow users to pre-book parking spots before arriving.
- Manage reservation time slots and handle no-shows.

### 3.4 Advanced Analytics
- Revenue tracking and forecasting charts.
- Peak hour analysis and vehicle type distribution.

## 4. Implementation Steps
1. **API Enhancement:** Add CRUD endpoints for the `users` table.
2. **Frontend Enhancement:** Add a "Users" tab to the dashboard.
3. **Authentication:** Add a login screen and route protection based on user roles.
