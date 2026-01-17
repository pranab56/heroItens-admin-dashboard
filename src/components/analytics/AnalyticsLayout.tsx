"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Car, Clock, Filter, Users, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { BarChart } from './BarChart';
import { StatsCard } from './StatsCard';

export default function AnalyticsLayout() {
  const statsData = [
    {
      id: 1,
      icon: Users,
      title: 'Total Users',
      value: '12,450',
      valueColor: 'text-cyan-400',
      bgColor: 'bg-[#1C2936]'
    },
    {
      id: 2,
      icon: Car,
      title: 'Total Cars',
      value: '4,200',
      valueColor: 'text-cyan-400',
      bgColor: 'bg-[#1C2936]'
    },
    {
      id: 3,
      icon: Zap,
      title: 'Total Votes',
      value: '45.2k',
      valueColor: 'text-cyan-400',
      bgColor: 'bg-[#1C2936]'
    },
    {
      id: 4,
      icon: Clock,
      title: 'Pending Cars',
      value: '188',
      valueColor: 'text-yellow-400',
      bgColor: 'bg-[#1C2936]'
    },
    {
      id: 5,
      icon: XCircle,
      title: 'Reject Cars',
      value: '27',
      valueColor: 'text-red-400',
      bgColor: 'bg-[#1C2936]'
    }
  ];

  // Original full year data
  const fullYearData = [
    { month: 'Jan', value: 850 },
    { month: 'Feb', value: 650 },
    { month: 'Mar', value: 900 },
    { month: 'Apr', value: 1200 },
    { month: 'May', value: 950 },
    { month: 'Jun', value: 800 },
    { month: 'Jul', value: 1100 },
    { month: 'Aug', value: 1300 },
    { month: 'Sep', value: 1150 },
    { month: 'Oct', value: 950 },
    { month: 'Nov', value: 750 },
    { month: 'Dec', value: 1200 }
  ];

  // Filter options
  const filterOptions = [
    { id: '3months', label: 'Last 3 Months', months: 3 },
    { id: '6months', label: 'Last 6 Months', months: 6 },
    { id: 'year', label: 'This Year', months: 12 },
    { id: 'all', label: 'All Time', months: 12 }
  ];

  const [selectedFilter, setSelectedFilter] = useState('year');
  const [userGrowthData, setUserGrowthData] = useState(fullYearData);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);

    let filteredData = [];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // 0-based index

    switch (filterId) {
      case '3months':
        // Get last 3 months (including current month)
        filteredData = fullYearData.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);
        break;
      case '6months':
        // Get last 6 months
        filteredData = fullYearData.slice(Math.max(0, currentMonthIndex - 5), currentMonthIndex + 1);
        break;
      case 'year':
        // Get full year data
        filteredData = [...fullYearData];
        break;
      case 'all':
        // For demonstration, showing 2 years of data
        const previousYearData = [
          { month: 'Jan', value: 700 },
          { month: 'Feb', value: 550 },
          { month: 'Mar', value: 800 },
          { month: 'Apr', value: 1100 },
          { month: 'May', value: 850 },
          { month: 'Jun', value: 700 },
          { month: 'Jul', value: 1000 },
          { month: 'Aug', value: 1200 },
          { month: 'Sep', value: 1050 },
          { month: 'Oct', value: 850 },
          { month: 'Nov', value: 650 },
          { month: 'Dec', value: 1100 }
        ];

        // Combine with current year data, adding year suffix
        filteredData = [
          ...previousYearData.map(item => ({ ...item, month: `${item.month} '24` })),
          ...fullYearData.map(item => ({ ...item, month: `${item.month} '25` }))
        ];
        break;
      default:
        filteredData = [...fullYearData];
    }

    setUserGrowthData(filteredData);
  };

  const pendingVerifications = [
    {
      id: 1,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      ownerName: 'Jane Cooper',
      date: 'October 24, 2025'
    },
    {
      id: 2,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      ownerName: 'Jane Cooper',
      date: 'October 24, 2025'
    },
    {
      id: 3,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      ownerName: 'Jane Cooper',
      date: 'October 24, 2025'
    }
  ];

  const topRankedCars = [
    {
      id: 1,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      carName: 'Hypercars',
      carModel: 'W16 Quad...',
      votes: '12,450'
    },
    {
      id: 2,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      carName: 'Hypercars',
      carModel: 'W16 Quad...',
      votes: '12,450'
    },
    {
      id: 3,
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&h=60&fit=crop',
      carName: 'Hypercars',
      carModel: 'W16 Quad...',
      votes: '12,450'
    }
  ];

  return (
    <div className="">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsData.map((stat) => (
            <StatsCard
              key={stat.id}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              valueColor={stat.valueColor}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* User Growth Chart */}
        <Card className="bg-[#1C2936] border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">User Growth</h2>

              {/* Filter Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1C2936] border border-slate-700 rounded-lg text-sm text-gray-300 hover:bg-[#2D3748] transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter by Months
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#1C2936] border border-slate-700 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterChange(option.id)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-[#2D3748] transition-colors ${selectedFilter === option.id
                        ? 'text-cyan-400 bg-[#2D3748]'
                        : 'text-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {selectedFilter === option.id && (
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Display */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-400">Showing:</span>
              <div className="flex flex-wrap gap-2">
                {filterOptions
                  .filter(option => selectedFilter === option.id)
                  .map(option => (
                    <span
                      key={option.id}
                      className="px-3 py-1 bg-cyan-400/10 text-cyan-400 text-xs rounded-full border border-cyan-400/20"
                    >
                      {option.label}
                    </span>
                  ))}
              </div>
            </div>

            <BarChart data={userGrowthData} />

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Users (Period)</p>
                  <p className="text-2xl font-semibold text-white">
                    {userGrowthData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Average Monthly</p>
                  <p className="text-2xl font-semibold text-white">
                    {Math.round(userGrowthData.reduce((sum, item) => sum + item.value, 0) / userGrowthData.length).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Highest Month</p>
                  <p className="text-2xl font-semibold text-white">
                    {Math.max(...userGrowthData.map(item => item.value)).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Growth Rate</p>
                  <p className="text-2xl font-semibold text-green-400">
                    {(() => {
                      if (userGrowthData.length >= 2) {
                        const first = userGrowthData[0].value;
                        const last = userGrowthData[userGrowthData.length - 1].value;
                        const growth = ((last - first) / first) * 100;
                        return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
                      }
                      return '0%';
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <Card className="bg-[#1C2936] border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Pending Verifications</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 pb-3 border-b border-slate-700">
                  <span>Car Image</span>
                  <span>Owner Name</span>
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {pendingVerifications.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-4 items-center">
                    <img
                      src={item.carImage}
                      alt="Car"
                      className="w-20 h-12 rounded-lg object-cover"
                    />
                    <span className="text-gray-300 text-sm">{item.ownerName}</span>
                    <span className="text-gray-400 text-sm">{item.date}</span>
                    <button className="text-green-400 hover:underline cursor-pointer text-sm font-medium hover:text-green-300">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Ranked Cars */}
          <Card className="bg-[#1C2936] border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Top Ranked Cars</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 pb-3 border-b border-slate-700">
                  <span>Car Image</span>
                  <span>Total Votes</span>
                  <span>Action</span>
                </div>
                {topRankedCars.map((item) => (
                  <div key={item.id} className="grid grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.carImage}
                        alt="Car"
                        className="w-20 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-gray-300 text-sm font-medium">{item.carName}</p>
                        <p className="text-gray-500 text-xs">{item.carModel}</p>
                      </div>
                    </div>
                    <span className="text-gray-300 text-sm">{item.votes}</span>
                    <button className="text-red-400 hover:underline cursor-pointer text-sm font-medium hover:text-red-300">
                      Reset
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}