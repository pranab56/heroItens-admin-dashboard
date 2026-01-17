"use client";

import { Bar, CartesianGrid, BarChart as ReBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BarChartProps {
  data: {
    month: string;
    value: number;
  }[];
}

export const BarChart = ({ data }: BarChartProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2D3748] p-3 rounded-lg border border-slate-700 shadow-lg">
          <p className="text-gray-300 text-sm font-medium">{`Month: ${label}`}</p>
          <p className="text-cyan-400 font-bold text-lg">{`Users: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom bar shape with gradient
  const CustomBar = (props: any) => {
    const { x, y, width, height } = props;
    return (
      <g>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="url(#barGradient)"
          rx={4} // Rounded corners at the top
          ry={4}
          className="cursor-pointer transition-all hover:opacity-80 hover:scale-y-105 origin-bottom"
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#374151"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={{ stroke: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          axisLine={{ stroke: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Bar
          dataKey="value"
          shape={<CustomBar />}
          barSize={Math.max(30, 400 / data.length)} // Dynamic bar size based on data length
          radius={[4, 4, 0, 0]}
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
};