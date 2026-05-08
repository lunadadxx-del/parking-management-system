const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./parking.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.run(`
    CREATE TABLE IF NOT EXISTS parking_lots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      total_spaces INTEGER NOT NULL,
      available_spaces INTEGER NOT NULL,
      location TEXT,
      hourly_rate REAL DEFAULT 5.0
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_plate TEXT UNIQUE NOT NULL,
      vehicle_type TEXT DEFAULT 'car',
      check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      check_out_time DATETIME,
      parking_lot_id INTEGER,
      status TEXT DEFAULT 'parked',
      FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id)
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Insert sample data if tables are empty
    db.get('SELECT COUNT(*) as count FROM parking_lots', (err, row) => {
        if (row.count === 0) {
            db.run(`
        INSERT INTO parking_lots (name, total_spaces, available_spaces, location, hourly_rate)
        VALUES 
          ('Main Parking Lot', 100, 45, '123 Main St', 5.0),
          ('West Parking Garage', 80, 22, '456 West Ave', 6.5),
          ('East Parking Lot', 50, 50, '789 East Blvd', 4.0)
      `);
            console.log('Sample parking lots inserted.');
        }
    });
}

// API Routes

// Get all parking lots
app.get('/api/parking-lots', (req, res) => {
    db.all('SELECT * FROM parking_lots', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get parking lot by ID
app.get('/api/parking-lots/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM parking_lots WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Parking lot not found' });
            return;
        }
        res.json(row);
    });
});

// Create a new parking lot
app.post('/api/parking-lots', (req, res) => {
    const { name, total_spaces, available_spaces, location, hourly_rate } = req.body;

    if (!name || total_spaces === undefined || available_spaces === undefined) {
        return res.status(400).json({ error: 'Name, total_spaces, and available_spaces are required' });
    }

    if (available_spaces > total_spaces) {
        return res.status(400).json({ error: 'Available spaces cannot exceed total spaces' });
    }

    db.run(
        'INSERT INTO parking_lots (name, total_spaces, available_spaces, location, hourly_rate) VALUES (?, ?, ?, ?, ?)',
        [name, total_spaces, available_spaces, location || '', hourly_rate || 5.0],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Parking lot created successfully',
                id: this.lastID,
                name,
                total_spaces,
                available_spaces
            });
        }
    );
});

// Delete a parking lot
app.delete('/api/parking-lots/:id', (req, res) => {
    const id = req.params.id;

    // Check if there are any parked vehicles in this lot
    db.get('SELECT COUNT(*) as count FROM vehicles WHERE parking_lot_id = ? AND status = ?', [id, 'parked'], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (row.count > 0) {
            return res.status(400).json({ error: 'Cannot delete parking lot with parked vehicles' });
        }

        db.run('DELETE FROM parking_lots WHERE id = ?', [id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (this.changes === 0) {
                res.status(404).json({ error: 'Parking lot not found' });
                return;
            }

            res.json({ message: 'Parking lot deleted successfully' });
        });
    });
});

// Park a vehicle
app.post('/api/park', (req, res) => {
    const { license_plate, vehicle_type, parking_lot_id } = req.body;

    if (!license_plate || !parking_lot_id) {
        return res.status(400).json({ error: 'License plate and parking lot ID are required' });
    }

    // Check if parking lot has available space
    db.get('SELECT available_spaces FROM parking_lots WHERE id = ?', [parking_lot_id], (err, lot) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!lot) {
            return res.status(404).json({ error: 'Parking lot not found' });
        }
        if (lot.available_spaces <= 0) {
            return res.status(400).json({ error: 'No available spaces in this parking lot' });
        }

        // Insert vehicle
        db.run(
            'INSERT INTO vehicles (license_plate, vehicle_type, parking_lot_id, status) VALUES (?, ?, ?, ?)',
            [license_plate, vehicle_type || 'car', parking_lot_id, 'parked'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Vehicle already parked' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                // Update available spaces
                db.run(
                    'UPDATE parking_lots SET available_spaces = available_spaces - 1 WHERE id = ?',
                    [parking_lot_id]
                );

                res.json({
                    message: 'Vehicle parked successfully',
                    vehicle_id: this.lastID,
                    check_in_time: new Date().toISOString()
                });
            }
        );
    });
});

// Check out a vehicle
app.post('/api/checkout', (req, res) => {
    const { license_plate } = req.body;

    if (!license_plate) {
        return res.status(400).json({ error: 'License plate is required' });
    }

    db.get(
        'SELECT * FROM vehicles WHERE license_plate = ? AND status = ?',
        [license_plate, 'parked'],
        (err, vehicle) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!vehicle) {
                return res.status(404).json({ error: 'No parked vehicle found with this license plate' });
            }

            const checkOutTime = new Date();
            const checkInTime = new Date(vehicle.check_in_time);
            const hoursParked = Math.ceil((checkOutTime - checkInTime) / (1000 * 60 * 60));

            // Get hourly rate
            db.get(
                'SELECT hourly_rate FROM parking_lots WHERE id = ?',
                [vehicle.parking_lot_id],
                (err, lot) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const totalCharge = hoursParked * (lot?.hourly_rate || 5.0);

                    // Update vehicle record
                    db.run(
                        'UPDATE vehicles SET check_out_time = ?, status = ? WHERE id = ?',
                        [checkOutTime.toISOString(), 'checked_out', vehicle.id],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            // Update available spaces
                            db.run(
                                'UPDATE parking_lots SET available_spaces = available_spaces + 1 WHERE id = ?',
                                [vehicle.parking_lot_id]
                            );

                            res.json({
                                message: 'Vehicle checked out successfully',
                                license_plate,
                                hours_parked: hoursParked,
                                total_charge: totalCharge.toFixed(2),
                                check_out_time: checkOutTime.toISOString()
                            });
                        }
                    );
                }
            );
        }
    );
});

// Get all parked vehicles
app.get('/api/vehicles/parked', (req, res) => {
    db.all(
        `SELECT v.*, p.name as parking_lot_name 
     FROM vehicles v 
     LEFT JOIN parking_lots p ON v.parking_lot_id = p.id 
     WHERE v.status = ?`,
        ['parked'],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// Get parking statistics
app.get('/api/stats', (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as total_lots FROM parking_lots', (err, row) => {
        stats.total_lots = row.total_lots;

        db.get('SELECT SUM(total_spaces) as total_spaces FROM parking_lots', (err, row) => {
            stats.total_spaces = row.total_spaces || 0;

            db.get('SELECT SUM(available_spaces) as available_spaces FROM parking_lots', (err, row) => {
                stats.available_spaces = row.available_spaces || 0;
                stats.occupied_spaces = stats.total_spaces - stats.available_spaces;

                db.get('SELECT COUNT(*) as parked_vehicles FROM vehicles WHERE status = ?', ['parked'], (err, row) => {
                    stats.parked_vehicles = row.parked_vehicles;

                    db.get('SELECT COUNT(*) as total_vehicles FROM vehicles', (err, row) => {
                        stats.total_vehicles = row.total_vehicles;
                        res.json(stats);
                    });
                });
            });
        });
    });
});

// --- User Management APIs ---

// Get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT id, email, name, phone, created_at FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create a new user
app.post('/api/users', (req, res) => {
    const { email, name, phone } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }

    db.run(
        'INSERT INTO users (email, name, phone) VALUES (?, ?, ?)',
        [email, name, phone || ''],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: 'User created successfully',
                id: this.lastID,
                email,
                name,
                phone
            });
        }
    );
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});


// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});