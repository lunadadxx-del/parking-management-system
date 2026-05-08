import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCar, FaMotorcycle, FaTruck, FaParking, FaCheckCircle } from 'react-icons/fa'

const VehicleParking = ({ onPark }) => {
    const [parkingLots, setParkingLots] = useState([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        license_plate: '',
        vehicle_type: 'car',
        parking_lot_id: ''
    })

    useEffect(() => {
        fetchParkingLots()
    }, [])

    const fetchParkingLots = async () => {
        try {
            const response = await axios.get('/api/parking-lots')
            setParkingLots(response.data)
            if (response.data.length > 0 && !formData.parking_lot_id) {
                setFormData(prev => ({ ...prev, parking_lot_id: response.data[0].id }))
            }
        } catch (error) {
            console.error('Error fetching parking lots:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const response = await axios.post('/api/park', formData)
            setSuccess(true)
            onPark?.()

            // Reset form
            setFormData({
                license_plate: '',
                vehicle_type: 'car',
                parking_lot_id: parkingLots.length > 0 ? parkingLots[0].id : ''
            })

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000)
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to park vehicle. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'motorcycle': return <FaMotorcycle className="text-xl" />
            case 'truck': return <FaTruck className="text-xl" />
            default: return <FaCar className="text-xl" />
        }
    }

    const vehicleTypes = [
        { value: 'car', label: 'Car', icon: <FaCar /> },
        { value: 'motorcycle', label: 'Motorcycle', icon: <FaMotorcycle /> },
        { value: 'truck', label: 'Truck', icon: <FaTruck /> },
        { value: 'suv', label: 'SUV', icon: <FaCar /> },
        { value: 'van', label: 'Van', icon: <FaTruck /> }
    ]

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Park a Vehicle</h2>
                <p className="text-gray-600 mt-2">Enter vehicle details to park in available parking lot</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Form */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* License Plate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Plate Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCar className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="license_plate"
                                        value={formData.license_plate}
                                        onChange={handleInputChange}
                                        className="pl-10 input-field uppercase"
                                        placeholder="ABC-1234"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vehicle Type
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {vehicleTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, vehicle_type: type.value })}
                                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${formData.vehicle_type === type.value
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-2xl mb-2 text-primary-600">{type.icon}</span>
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parking Lot Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Parking Lot
                                </label>
                                <div className="space-y-3">
                                    {parkingLots.map((lot) => (
                                        <div
                                            key={lot.id}
                                            onClick={() => setFormData({ ...formData, parking_lot_id: lot.id })}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.parking_lot_id === lot.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <FaParking className="text-primary-600 mr-3" />
                                                    <div>
                                                        <h4 className="font-bold">{lot.name}</h4>
                                                        <p className="text-sm text-gray-600">{lot.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-primary-700">
                                                        {lot.available_spaces} spaces
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        ${lot.hourly_rate}/hour
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-sm">
                                                    <span>Availability</span>
                                                    <span className="font-medium">
                                                        {lot.available_spaces > 10 ? 'Good' : lot.available_spaces > 0 ? 'Limited' : 'Full'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className={`h-2 rounded-full ${lot.available_spaces > 10 ? 'bg-green-500' : lot.available_spaces > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${((lot.total_spaces - lot.available_spaces) / lot.total_spaces) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Error and Success Messages */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                                        <div>
                                            <p className="text-green-800 font-medium">Vehicle parked successfully!</p>
                                            <p className="text-green-700 text-sm">License plate: {formData.license_plate}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || parkingLots.length === 0}
                                    className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Park Vehicle'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right column - Information */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FaParking className="mr-2" />
                            Parking Instructions
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <div className="bg-primary-100 text-primary-800 rounded-full p-1 mr-3">
                                    <span className="text-xs font-bold">1</span>
                                </div>
                                <span>Enter the vehicle's license plate number</span>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-primary-100 text-primary-800 rounded-full p-1 mr-3">
                                    <span className="text-xs font-bold">2</span>
                                </div>
                                <span>Select the vehicle type</span>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-primary-100 text-primary-800 rounded-full p-1 mr-3">
                                    <span className="text-xs font-bold">3</span>
                                </div>
                                <span>Choose an available parking lot</span>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-primary-100 text-primary-800 rounded-full p-1 mr-3">
                                    <span className="text-xs font-bold">4</span>
                                </div>
                                <span>Click "Park Vehicle" to confirm</span>
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-bold mb-4">Vehicle Types</h3>
                        <div className="space-y-3">
                            {vehicleTypes.map((type) => (
                                <div key={type.value} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-primary-600 mr-3">{type.icon}</span>
                                    <div>
                                        <div className="font-medium">{type.label}</div>
                                        <div className="text-sm text-gray-600">
                                            {type.value === 'motorcycle' ? 'Half parking rate' :
                                                type.value === 'truck' ? 'Double parking rate' : 'Standard rate'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card bg-primary-50 border-primary-200">
                        <h3 className="text-xl font-bold mb-2 text-primary-800">Need Help?</h3>
                        <p className="text-primary-700 mb-3">
                            If you encounter any issues while parking, please contact the parking attendant.
                        </p>
                        <div className="text-sm text-primary-600">
                            <p>• Ensure license plate is correctly entered</p>
                            <p>• Check parking lot availability before selecting</p>
                            <p>• Keep your parking ticket for checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleParking