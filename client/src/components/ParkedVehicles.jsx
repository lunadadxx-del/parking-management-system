import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCar, FaMotorcycle, FaTruck, FaParking, FaClock, FaMoneyBillWave, FaSignOutAlt, FaSearch } from 'react-icons/fa'

const ParkedVehicles = ({ onCheckout }) => {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [checkingOut, setCheckingOut] = useState(null)

    useEffect(() => {
        fetchParkedVehicles()
        const interval = setInterval(fetchParkedVehicles, 5000) // Refresh every 5 seconds
        return () => clearInterval(interval)
    }, [])

    const fetchParkedVehicles = async () => {
        try {
            const response = await axios.get('/api/vehicles/parked')
            setVehicles(response.data)
        } catch (error) {
            console.error('Error fetching parked vehicles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = async (licensePlate) => {
        if (!window.confirm(`Check out vehicle ${licensePlate}?`)) return

        setCheckingOut(licensePlate)
        try {
            const response = await axios.post('/api/checkout', { license_plate: licensePlate })
            alert(`Vehicle checked out successfully!\nTotal charge: $${response.data.total_charge}`)
            fetchParkedVehicles()
            onCheckout?.()
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to check out vehicle')
        } finally {
            setCheckingOut(null)
        }
    }

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'motorcycle': return <FaMotorcycle className="text-xl" />
            case 'truck': return <FaTruck className="text-xl" />
            default: return <FaCar className="text-xl" />
        }
    }

    const getParkingDuration = (checkInTime) => {
        const checkIn = new Date(checkInTime)
        const now = new Date()
        const diffMs = now - checkIn
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m`
        }
        return `${diffMinutes}m`
    }

    const calculateEstimatedCharge = (checkInTime, hourlyRate = 5) => {
        const checkIn = new Date(checkInTime)
        const now = new Date()
        const diffHours = (now - checkIn) / (1000 * 60 * 60)
        return (Math.ceil(diffHours) * hourlyRate).toFixed(2)
    }

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.parking_lot_name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'all' || vehicle.vehicle_type === filterType
        return matchesSearch && matchesType
    })

    const vehicleTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'car', label: 'Cars' },
        { value: 'motorcycle', label: 'Motorcycles' },
        { value: 'truck', label: 'Trucks' },
        { value: 'suv', label: 'SUVs' },
        { value: 'van', label: 'Vans' },
    ]

    if (loading && vehicles.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Parked Vehicles</h2>
                    <p className="text-gray-600">Currently parked vehicles across all parking lots</p>
                </div>
                <div className="mt-4 md:mt-0 text-lg font-bold">
                    <span className="text-primary-700">{vehicles.length}</span>
                    <span className="text-gray-600"> vehicles parked</span>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Vehicles
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 input-field"
                                placeholder="Search by license plate or parking lot..."
                            />
                        </div>
                    </div>

                    {/* Vehicle Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input-field"
                        >
                            {vehicleTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                        </label>
                        <select className="input-field" defaultValue="newest">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="plate">License Plate</option>
                            <option value="lot">Parking Lot</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vehicles Grid */}
            {filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                    <FaCar className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No vehicles parked</h3>
                    <p className="mt-2 text-gray-500">
                        {searchTerm || filterType !== 'all'
                            ? 'No vehicles match your search criteria.'
                            : 'All parking lots are currently empty.'}
                    </p>
                    {(searchTerm || filterType !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterType('all')
                            }}
                            className="mt-4 btn-secondary"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => (
                        <div key={vehicle.id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="p-3 bg-primary-100 text-primary-800 rounded-lg mr-4">
                                        {getVehicleIcon(vehicle.vehicle_type)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{vehicle.license_plate}</h3>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <FaParking className="mr-2" />
                                            <span>{vehicle.parking_lot_name || 'Unknown Lot'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`badge ${vehicle.vehicle_type === 'motorcycle' ? 'badge-success' : vehicle.vehicle_type === 'truck' ? 'badge-warning' : 'badge-primary'}`}>
                                    {vehicle.vehicle_type}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Parking Duration */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <FaClock className="text-gray-600 mr-3" />
                                        <span className="text-gray-700">Parking Duration</span>
                                    </div>
                                    <span className="text-lg font-bold">
                                        {getParkingDuration(vehicle.check_in_time)}
                                    </span>
                                </div>

                                {/* Estimated Charge */}
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="text-yellow-600 mr-3" />
                                        <span className="text-gray-700">Estimated Charge</span>
                                    </div>
                                    <span className="text-lg font-bold text-yellow-700">
                                        ${calculateEstimatedCharge(vehicle.check_in_time, 5)}
                                    </span>
                                </div>

                                {/* Check-in Time */}
                                <div className="text-sm text-gray-600">
                                    <div className="font-medium mb-1">Check-in Time</div>
                                    <div>{new Date(vehicle.check_in_time).toLocaleString()}</div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => handleCheckout(vehicle.license_plate)}
                                    disabled={checkingOut === vehicle.license_plate}
                                    className="w-full btn-primary flex items-center justify-center"
                                >
                                    {checkingOut === vehicle.license_plate ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaSignOutAlt className="mr-2" />
                                            Check Out Vehicle
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {filteredVehicles.length > 0 && (
                <div className="card mt-8">
                    <h3 className="text-xl font-bold mb-4">Parking Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-700">{filteredVehicles.length}</div>
                            <div className="text-sm text-gray-600">Total Parked</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">
                                {filteredVehicles.filter(v => v.vehicle_type === 'car').length}
                            </div>
                            <div className="text-sm text-gray-600">Cars</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-700">
                                {filteredVehicles.filter(v => v.vehicle_type === 'motorcycle').length}
                            </div>
                            <div className="text-sm text-gray-600">Motorcycles</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-700">
                                {filteredVehicles.reduce((sum, v) => sum + parseFloat(calculateEstimatedCharge(v.check_in_time, 5)), 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Estimated Revenue</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="card bg-primary-50 border-primary-200 mt-8">
                <h3 className="text-xl font-bold mb-4 text-primary-800">Parking Management Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-bold mb-2">Checkout Process</h4>
                        <ul className="text-sm text-primary-700 space-y-1">
                            <li>• Click "Check Out Vehicle" to process payment</li>
                            <li>• System calculates parking duration automatically</li>
                            <li>• Receipt is generated upon checkout</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Vehicle Tracking</h4>
                        <ul className="text-sm text-primary-700 space-y-1">
                            <li>• Real-time updates every 5 seconds</li>
                            <li>• Search by license plate or parking lot</li>
                            <li>• Filter by vehicle type</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Revenue Management</h4>
                        <ul className="text-sm text-primary-700 space-y-1">
                            <li>• Estimated charges shown for each vehicle</li>
                            <li>• Different rates for vehicle types</li>
                            <li>• Peak hour pricing available</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParkedVehicles