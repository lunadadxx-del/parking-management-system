# Parking Management System

A modern, full-stack parking management system built with React, Node.js, Express, and SQLite. This system provides real-time monitoring of parking lots, vehicle parking/checkout, and comprehensive analytics.

## Features

### 🅿️ Core Functionality
- **Parking Lot Management**: Create, view, update, and delete parking lots
- **Vehicle Parking**: Park vehicles with license plate tracking
- **Checkout System**: Automated checkout with duration-based billing
- **Real-time Updates**: Live updates of parking availability
- **Statistics Dashboard**: Visual analytics and occupancy rates

### 📊 Dashboard Features
- Real-time parking lot occupancy visualization
- Vehicle type distribution charts
- Revenue tracking and forecasting
- Peak hour analysis
- Historical data trends

### 🚗 Vehicle Management
- Support for multiple vehicle types (cars, motorcycles, trucks, SUVs, vans)
- License plate recognition
- Parking duration tracking
- Automated billing calculation
- Search and filter capabilities

## Technology Stack

### Backend
- **Node.js** with **Express** - REST API server
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Recharts** - Charting library
- **Axios** - HTTP client

## Project Structure

```
parkingSystem/
├── server/
│   └── index.js          # Express server with all API endpoints
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ParkingLots.jsx
│   │   │   ├── VehicleParking.jsx
│   │   │   ├── Statistics.jsx
│   │   │   └── ParkedVehicles.jsx
│   │   ├── App.jsx       # Main application component
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js # PostCSS configuration
├── package.json          # Backend dependencies
└── README.md            # This file
```

## API Endpoints

### Parking Lots
- `GET /api/parking-lots` - Get all parking lots
- `GET /api/parking-lots/:id` - Get specific parking lot
- `POST /api/parking-lots` - Create new parking lot
- `DELETE /api/parking-lots/:id` - Delete parking lot

### Vehicle Operations
- `POST /api/park` - Park a vehicle
- `POST /api/checkout` - Check out a vehicle
- `GET /api/vehicles/parked` - Get all parked vehicles

### Statistics
- `GET /api/stats` - Get system statistics

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the project root:
   ```bash
   cd parkingSystem
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### One-Command Setup
From the project root, you can run:
```bash
npm run install-all
```

This will install both backend and frontend dependencies.

## Database

The system uses SQLite with automatic database initialization. On first run, the system will:
1. Create a `parking.db` file
2. Create necessary tables (parking_lots, vehicles, users)
3. Insert sample parking lot data

### Database Schema
- **parking_lots**: Stores parking lot information (name, capacity, rates)
- **vehicles**: Tracks parked vehicles (license plate, check-in/out times)
- **users**: User management (future feature)

## Usage Guide

### 1. View Dashboard
- Access the dashboard at `http://localhost:3000`
- View real-time statistics and charts

### 2. Manage Parking Lots
- Navigate to "Parking Lots" tab
- Add new parking lots with capacity and hourly rates
- Monitor occupancy with visual indicators

### 3. Park a Vehicle
- Go to "Park Vehicle" tab
- Enter license plate and select vehicle type
- Choose available parking lot
- Confirm parking

### 4. Check Out Vehicle
- Navigate to "Parked Vehicles" tab
- View all currently parked vehicles
- Click "Check Out" to process payment
- System calculates parking duration and charges automatically

### 5. View Analytics
- Dashboard provides comprehensive analytics
- View occupancy rates by lot
- Monitor revenue trends
- Analyze vehicle type distribution

## Features in Detail

### Real-time Updates
- Parking lot availability updates in real-time
- Vehicle count refreshes automatically
- Statistics update every 10 seconds

### Responsive Design
- Mobile-friendly interface
- Adapts to different screen sizes
- Touch-friendly controls

### Error Handling
- Form validation with user feedback
- Database error handling
- Graceful degradation

## Future Enhancements

### Planned Features
1. **User Authentication** - Admin and user roles
2. **Payment Integration** - Stripe/PayPal integration
3. **Reservation System** - Pre-book parking spots
4. **Mobile App** - React Native application
5. **License Plate Recognition** - Camera integration
6. **Email/SMS Notifications** - Reminders and receipts
7. **Multi-language Support** - Internationalization
8. **Advanced Analytics** - Predictive analytics and ML

### Technical Improvements
1. **Database Migration** - PostgreSQL for production
2. **API Documentation** - Swagger/OpenAPI
3. **Testing Suite** - Unit and integration tests
4. **Dockerization** - Containerized deployment
5. **CI/CD Pipeline** - Automated testing and deployment

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in `server/index.js` (line 8) or `client/vite.config.js`

2. **Database errors**
   - Delete `parking.db` file and restart server

3. **CORS issues**
   - Ensure backend is running on port 5000
   - Check proxy configuration in `vite.config.js`

4. **Missing dependencies**
   - Run `npm install` in both root and client directories

### Logs
- Backend logs appear in the terminal running the server
- Frontend logs appear in browser console (F12)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please create an issue in the repository.

---

**Happy Parking!** 🚗💨