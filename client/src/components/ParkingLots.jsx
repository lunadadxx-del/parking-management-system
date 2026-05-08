import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaMapMarkerAlt, FaCar, FaMoneyBillWave, FaEdit, FaTrash, FaParking } from 'react-icons/fa'

const ParkingLots = () => {
    const [parkingLots, setParkingLots] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        total_spaces: 50,
        available_spaces: 50,
        location: '',
        hourly_rate: 5.0
    })

    useEffect(() => {
        fetchParkingLots()
    }, [])

    const fetchParkingLots = async () => {
        try {
            const response = await axios.get('/api/parking-lots')
            setParkingLots(response.data)
        } catch (error) {
            console.error('Error fetching parking lots:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: name === 'total_spaces' || name === 'available_spaces' || name === 'hourly_rate'
                ? parseFloat(value)
                : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/parking-lots', formData)
            fetchParkingLots()
            setShowForm(false)
            setFormData({
                name: '',
                total_spaces: 50,
                available_spaces: 50,
                location: '',
                hourly_rate: 5.0
            })
        } catch (error) {
            console.error('Error creating parking lot:', error)
            alert('Failed to create parking lot. Please try again.')
        }
    }

    const deleteParkingLot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this parking lot?')) return

        try {
            await axios.delete(`/api/parking-lots/${id}`)
            fetchParkingLots()
        } catch (error) {
            console.error('Error deleting parking lot:', error)
            alert('Failed to delete parking lot.')
        }
    }

    const getOccupancyPercentage = (total, available) => {
        const occupied = total - available
        return total > 0 ? Math.round((occupied / total) * 100) : 0
    }

    const getOccupancyColor = (percentage) => {
        if (percentage < 50) return 'bg-green-500'
        if (percentage < 80) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Parking Lots</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center"
                >
                    {showForm ? 'Cancel' : 'Add New Parking Lot'}
                </button>
            </div>

            {showForm && (
                <div className="card mb-8">
                    <h3 className="text-xl font-bold mb-4">Add New Parking Lot</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parking Lot Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Spaces
                                </label>
                                <input
                                    type="number"
                                    name="total_spaces"
                                    value={formData.total_spaces}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Available Spaces
                                </label>
                                <input
                                    type="number"
                                    name="available_spaces"
                                    value={formData.available_spaces}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="0"
                                    max={formData.total_spaces}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hourly Rate ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="hourly_rate"
                                    value={formData.hourly_rate}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">
                                Create Parking Lot
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parkingLots.map((lot) => {
                    const occupancyPercentage = getOccupancyPercentage(lot.total_spaces, lot.available_spaces)
                    return (
                        <div key={lot.id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{lot.name}</h3>
                                    <div className="flex items-center text-gray-600 mt-1">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{lot.location}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="text-gray-400 hover:text-primary-600">
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteParkingLot(lot.id)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Occupancy</span>
                                        <span className="text-sm font-bold">{occupancyPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getOccupancyColor(occupancyPercentage)}`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <FaCar className="text-primary-600 mr-2" />
                                            <span className="text-sm text-gray-600">Total Spaces</span>
                                        </div>
                                        <div className="text-2xl font-bold">{lot.total_spaces}</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <FaCar className="text-green-600 mr-2" />
                                            <span className="text-sm text-gray-600">Available</span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-700">{lot.available_spaces}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="text-primary-600 mr-2" />
                                        <span className="text-gray-700">Hourly Rate</span>
                                    </div>
                                    <span className="text-xl font-bold text-primary-700">${lot.hourly_rate}</span>
                                </div>

                                <div className="mt-4">
                                    <div className={`badge ${lot.available_spaces > 10 ? 'badge-success' : lot.available_spaces > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                        {lot.available_spaces > 10 ? 'Good Availability' : lot.available_spaces > 0 ? 'Limited Spaces' : 'Full'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {parkingLots.length === 0 && (
                <div className="text-center py-12">
                    <FaParking className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No parking lots</h3>
                    <p className="mt-2 text-gray-500">Get started by creating your first parking lot.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 btn-primary"
                    >
                        Add Parking Lot
                    </button>
                </div>
            )}
        </div>
    )
}

export default ParkingLots