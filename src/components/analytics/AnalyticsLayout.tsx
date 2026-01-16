import { Card, CardContent } from '@/components/ui/card';
import { Car, Clock, Filter, Users, XCircle, Zap } from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, valueColor, bgColor }) => {
  return (
    <Card className={`${bgColor} border-none`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-lg">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-xs font-medium mb-1">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between h-48 gap-3 px-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 gap-2">
          <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
            <div
              className="w-full bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-t-lg transition-all hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: '20px'
              }}
            />
          </div>
          <span className="text-gray-400 text-xs">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

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

  const userGrowthData = [
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
      <div className=" space-y-6">
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
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1C2936] rounded-lg text-sm text-gray-300 hover:bg-[#1C2936] transition-colors">
                <Filter className="w-4 h-4" />
                Filter by Months
              </button>
            </div>
            <BarChart data={userGrowthData} />
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
                    <button className="text-green-400 text-sm font-medium hover:text-green-300">
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
                    <button className="text-red-400 text-sm font-medium hover:text-red-300">
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