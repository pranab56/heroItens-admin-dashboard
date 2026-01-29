import { Card, CardContent } from '../ui/card';
interface StatsCardProps {
  icon: any;
  title: string;
  value: string | number;
  valueColor: string;
  bgColor: string;
}

export const StatsCard = ({ icon: Icon, title, value, valueColor, bgColor }: StatsCardProps) => {
  return (
    <Card className={`${bgColor} border-none p-0`}>
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