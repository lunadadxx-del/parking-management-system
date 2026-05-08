import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaParking, FaCar, FaDollarSign, FaChartBar, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import ParkingLots from './components/ParkingLots'
import VehicleParking from './components/VehicleParking'
import Statistics from './components/Statistics'
import ParkedVehicles from './components/ParkedVehicles'

function App() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
        const interval = setInterval(fetchStats, 10000) // Refresh every 10 seconds
        return () => clearInterval(interval)
    }, [])

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/stats')
            setStats(response.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
        { id: 'parking-lots', label: 'Parking Lots', icon: <FaParking /> },
        { id: 'park-vehicle', label: 'Park Vehicle', icon: <FaCar /> },
        { id: 'parked-vehicles', label: 'Parked Vehicles', icon: <FaSignInAlt /> },
        { id: 'checkout', label: 'Check Out', icon: <FaSignOutAlt /> },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                            <FaParking className="h-8 w-8 text-primary-600 mr-3" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Parking Management System</h1>
                                <p className="text-gray-600">Efficient parking space management and monitoring</p>
                            </div>
                        </div>
                        {stats && (
                            <div className="mt-4 sm:mt-0 flex space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary-700">{stats.available_spaces}</div>
                                    <div className="text-sm text-gray-600">Available Spaces</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.parked_vehicles}</div>
                                    <div className="text-sm text-gray-600">Parked Vehicles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-700">{stats.total_lots}</div>
                                    <div className="text-sm text-gray-600">Parking Lots</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && <Statistics stats={stats} />}
                        {activeTab === 'parking-lots' && <ParkingLots />}
                        {activeTab === 'park-vehicle' && <VehicleParking onPark={fetchStats} />}
                        {activeTab === 'parked-vehicles' && <ParkedVehicles onCheckout={fetchStats} />}
                        {activeTab === 'checkout' && (
                            <div className="card">
                                <h2 className="text-2xl font-bold mb-6">Check Out Vehicle</h2>
                                <p className="text-gray-600 mb-4">
                                    Use the "Parked Vehicles" tab to view and check out vehicles.
                                </p>
                                <button
                                    onClick={() => setActiveTab('parked-vehicles')}
                                    className="btn-primary"
                                >
                                    Go to Parked Vehicles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-gray-500 text-sm">
                        <p>Parking Management System © {new Date().getFullYear()} - All rights reserved</p>
                        <p className="mt-1">Real-time monitoring system for efficient parking management</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App