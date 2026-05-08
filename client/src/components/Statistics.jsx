import React from 'react'
import { FaChartBar, FaCar, FaParking, FaMoneyBillWave, FaClock, FaUsers } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Statistics = ({ stats }) => {
    if (!stats) return null

    // Sample data for charts
    const occupancyData = [
        { name: 'Main Lot', spaces: 100, occupied: 55, available: 45 },
        { name: 'West Garage', spaces: 80, occupied: 58, available: 22 },
        { name: 'East Lot', spaces: 50, occupied: 0, available: 50 },
    ]

    const revenueData = [
        { name: 'Mon', revenue: 1250 },
        { name: 'Tue', revenue: 1890 },
        { name: 'Wed', revenue: 2100 },
        { name: 'Thu', revenue: 1780 },
        { name: 'Fri', revenue: 2450 },
        { name: 'Sat', revenue: 1950 },
        { name: 'Sun', revenue: 1450 },
    ]

    const vehicleTypeData = [
        { name: 'Cars', value: 65, color: '#3b82f6' },
        { name: 'Motorcycles', value: 15, color: '#10b981' },
        { name: 'Trucks', value: 10, color: '#f59e0b' },
        { name: 'SUVs', value: 10, color: '#8b5cf6' },
    ]

    const statCards = [
        {
            title: 'Total Parking Spaces',
            value: stats.total_spaces,
            icon: <FaParking className="text-3xl" />,
            color: 'bg-blue-500',
            textColor: 'text-blue-700',
            change: '+5%',
        },
        {
            title: 'Available Spaces',
            value: stats.available_spaces,
            icon: <FaCar className="text-3xl" />,
            color: 'bg-green-500',
            textColor: 'text-green-700',
            change: '-2%',
        },
        {
            title: 'Parked Vehicles',
            value: stats.parked_vehicles,
            icon: <FaCar className="text-3xl" />,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-700',
            change: '+12%',
        },
        {
            title: 'Occupancy Rate',
            value: `${Math.round(((stats.total_spaces - stats.available_spaces) / stats.total_spaces) * 100)}%`,
            icon: <FaChartBar className="text-3xl" />,
            color: 'bg-purple-500',
            textColor: 'text-purple-700',
            change: '+3%',
        },
        {
            title: 'Avg. Stay Time',
            value: '2.5h',
            icon: <FaClock className="text-3xl" />,
            color: 'bg-pink-500',
            textColor: 'text-pink-700',
            change: '-0.5h',
        },
        {
            title: 'Daily Revenue',
            value: '$2,450',
            icon: <FaMoneyBillWave className="text-3xl" />,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-700',
            change: '+8%',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-gray-600">Real-time statistics and analytics for your parking system</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">{card.title}</p>
                                <p className={`text-2xl font-bold mt-2 ${card.textColor}`}>{card.value}</p>
                                <p className="text-xs mt-1">
                                    <span className={card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                        {card.change}
                                    </span>
                                    <span className="text-gray-500 ml-1">from yesterday</span>
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${card.color} text-white`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Occupancy Chart */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <FaChartBar className="mr-2" />
                        Parking Lot Occupancy
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="occupied" name="Occupied Spaces" fill="#3b82f6" />
                                <Bar dataKey="available" name="Available Spaces" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vehicle Type Distribution */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <FaCar className="mr-2" />
                        Vehicle Type Distribution
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={vehicleTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {vehicleTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {vehicleTypeData.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm">{item.name}: {item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="card lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <FaMoneyBillWave className="mr-2" />
                        Weekly Revenue Trend
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                <Legend />
                                <Bar dataKey="revenue" name="Daily Revenue ($)" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="card bg-primary-50 border-primary-200">
                <h3 className="text-xl font-bold mb-4 text-primary-800">System Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded-lg">
                        <h4 className="font-bold mb-2">Peak Hours</h4>
                        <p className="text-gray-600">8:00 AM - 10:00 AM and 4:00 PM - 6:00 PM</p>
                        <div className="mt-3 text-sm text-primary-600">
                            <p>• 85% occupancy during peak hours</p>
                            <p>• Consider dynamic pricing</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                        <h4 className="font-bold mb-2">Most Popular Lot</h4>
                        <p className="text-gray-600">Main Parking Lot (55% occupancy)</p>
                        <div className="mt-3 text-sm text-primary-600">
                            <p>• Highest revenue generator</p>
                            <p>• Consider expanding capacity</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                        <h4 className="font-bold mb-2">Recommendations</h4>
                        <div className="mt-3 text-sm text-primary-600">
                            <p>• Add 20 more spaces to West Garage</p>
                            <p>• Implement premium parking spots</p>
                            <p>• Consider valet service during peak</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="btn-primary flex items-center">
                        <FaCar className="mr-2" />
                        Park New Vehicle
                    </button>
                    <button className="btn-secondary flex items-center">
                        <FaUsers className="mr-2" />
                        Generate Report
                    </button>
                    <button className="btn-secondary flex items-center">
                        <FaChartBar className="mr-2" />
                        View Analytics
                    </button>
                    <button className="btn-secondary flex items-center">
                        <FaMoneyBillWave className="mr-2" />
                        Manage Pricing
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Statistics