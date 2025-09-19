import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const vitalsConfig = [
  { key: "hr", name: "Heart Rate", color: "#ef4444", unit: "bpm" },
  { key: "temp", name: "Temperature", color: "#f97316", unit: "°F" },
  { key: "resp", name: "Respiratory", color: "#10b981", unit: "rpm" },
];

interface VitalsChartProps {
  data: any[];
}

export function VitalsChart({ data }: VitalsChartProps) {
  const CustomVitalsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((entry: any, index: number) => {
            const config = vitalsConfig.find((c) => c.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.value} {config?.unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="font-medium mb-3 text-gray-700">Vitals Trends</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomVitalsTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="hr"
              name="Heart Rate"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              name="Temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="resp"
              name="Respiratory"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
