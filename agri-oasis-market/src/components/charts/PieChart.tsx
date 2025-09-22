
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  title?: string;
  height?: number;
  colors?: string[];
}

const SimplePieChart = ({ 
  data, 
  nameKey, 
  dataKey, 
  title,
  height = 300,
  colors = ["#65A30D", "#84CC16", "#4D7C0F", "#FBBF24", "#F97316"]
}: PieChartProps) => {
  // Make sure we don't run out of colors
  const getColor = (index: number) => colors[index % colors.length];

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimplePieChart;
