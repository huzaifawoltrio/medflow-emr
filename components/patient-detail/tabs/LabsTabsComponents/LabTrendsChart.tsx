// components/patient-detail/tabs/LabsTabsComponents/LabTrendsChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from "recharts";

interface LabTrendsChartProps {
  data: any[];
  config: any[];
}

export function LabTrendsChart({ data, config }: LabTrendsChartProps) {
  // Filter data to only include points that have at least one non-null value
  const filteredData = data.filter((point) =>
    config.some(
      (configItem) =>
        point[configItem.key] !== null && point[configItem.key] !== undefined
    )
  );

  // Custom tooltip to handle null values gracefully
  const CustomLabTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium mb-2 text-gray-900">
            {new Date(label).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <div className="space-y-1">
            {payload
              .filter(
                (entry: any) =>
                  entry.value !== null && entry.value !== undefined
              )
              .sort((a: any, b: any) => b.value - a.value) // Sort by value descending
              .map((entry: any, index: number) => {
                const configItem = config.find((c) => c.key === entry.dataKey);
                const isOutOfRange = isValueOutOfNormalRange(
                  entry.value,
                  configItem
                );

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className={isOutOfRange ? "font-medium" : ""}>
                        {configItem?.name || entry.name}:
                      </span>
                    </span>
                    <span
                      className={`font-medium ${
                        isOutOfRange ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {formatLabValue(entry.value, configItem)}{" "}
                      {configItem?.unit}
                      {isOutOfRange && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </span>
                  </div>
                );
              })}
          </div>
          {payload.some((entry: any) =>
            isValueOutOfNormalRange(
              entry.value,
              config.find((c) => c.key === entry.dataKey)
            )
          ) && (
            <p className="text-xs text-red-600 mt-2 border-t pt-2">
              * Outside normal range
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot component to highlight abnormal values
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (cx === undefined || cy === undefined) return null;

    const configItem = config.find((c) => c.key === dataKey);
    const value = payload[dataKey];

    if (value === null || value === undefined) return null;

    const isAbnormal = isValueOutOfNormalRange(value, configItem);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isAbnormal ? 5 : 3}
        fill={isAbnormal ? "#ef4444" : "#fff"}
        stroke={props.stroke}
        strokeWidth={isAbnormal ? 3 : 2}
        className={isAbnormal ? "animate-pulse" : ""}
      />
    );
  };

  return (
    <div className="h-80 w-full">
      {filteredData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No lab data available for the selected period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 10%", "dataMax + 10%"]}
            />
            <Tooltip content={<CustomLabTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

            {/* Render lines for each lab value */}
            {config.map((item) => {
              // Only render line if there's data for this lab value
              const hasData = filteredData.some(
                (point) =>
                  point[item.key] !== null && point[item.key] !== undefined
              );

              if (!hasData) return null;

              return (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  stroke={item.color}
                  strokeWidth={2}
                  name={item.name}
                  dot={<CustomDot />}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: item.color,
                    stroke: "#fff",
                  }}
                  connectNulls={false} // Don't connect lines through null values
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Helper function to format lab values appropriately
function formatLabValue(value: number, config: any): string {
  if (value === null || value === undefined) return "N/A";

  // Round to appropriate decimal places based on the lab type
  switch (config?.key) {
    case "creatinine":
      return value.toFixed(1);
    case "hemoglobin":
    case "glucose":
    case "total_cholesterol":
      return value.toFixed(0);
    case "wbc":
      return value.toFixed(1);
    case "alt":
      return value.toFixed(0);
    default:
      return value.toFixed(1);
  }
}

// Helper function to determine if a value is outside normal range
function isValueOutOfNormalRange(value: number, config: any): boolean {
  if (value === null || value === undefined || !config) return false;

  // Parse normal range and check if value is outside it
  const normalRange = config.normalRange;

  if (normalRange.includes("-")) {
    const [min, max] = normalRange.split("-").map(parseFloat);
    return value < min || value > max;
  } else if (normalRange.startsWith("<")) {
    const max = parseFloat(normalRange.substring(1));
    return value >= max;
  } else if (normalRange.startsWith(">")) {
    const min = parseFloat(normalRange.substring(1));
    return value <= min;
  }

  return false;
}

// Helper function to get the severity of an abnormal value
function getAbnormalSeverity(
  value: number,
  config: any
): "mild" | "moderate" | "severe" {
  if (!isValueOutOfNormalRange(value, config)) return "mild";

  const normalRange = config.normalRange;

  if (normalRange.includes("-")) {
    const [min, max] = normalRange.split("-").map(parseFloat);
    const range = max - min;

    if (value < min) {
      const deviation = (min - value) / range;
      if (deviation > 0.5) return "severe";
      if (deviation > 0.2) return "moderate";
      return "mild";
    } else if (value > max) {
      const deviation = (value - max) / range;
      if (deviation > 0.5) return "severe";
      if (deviation > 0.2) return "moderate";
      return "mild";
    }
  }

  return "mild";
}
