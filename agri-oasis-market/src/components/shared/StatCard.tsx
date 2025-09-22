
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className = "",
}: StatCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <div className="text-2xl font-bold">{value}</div>
            
            {trend && trendValue && (
              <div className="flex items-center mt-1">
                {trend === "up" && (
                  <span className="text-green-500 text-xs mr-1">↑</span>
                )}
                {trend === "down" && (
                  <span className="text-red-500 text-xs mr-1">↓</span>
                )}
                {trend === "neutral" && (
                  <span className="text-gray-500 text-xs mr-1">→</span>
                )}
                <span 
                  className={`text-xs ${
                    trend === "up" ? "text-green-500" : 
                    trend === "down" ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="w-10 h-10 rounded-full bg-agri-green-light/20 flex items-center justify-center text-lg">
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
