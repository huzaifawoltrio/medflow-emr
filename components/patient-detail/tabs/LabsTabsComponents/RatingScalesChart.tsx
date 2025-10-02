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

interface RatingScalesChartProps {
  data: any[];
}

export function RatingScalesChart({ data }: RatingScalesChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number, name: string) => [
              value,
              name
                .replace("PHQ9", "PHQ-9")
                .replace("GAD7", "GAD-7")
                .replace("PCL5", "PCL-5"),
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="PHQ9"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="PHQ-9 (Depression)"
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="GAD7"
            stroke="#06b6d4"
            strokeWidth={2}
            name="GAD-7 (Anxiety)"
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="PCL5"
            stroke="#f59e0b"
            strokeWidth={2}
            name="PCL-5 (PTSD)"
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
