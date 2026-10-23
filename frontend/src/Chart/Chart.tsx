import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import type { TooltipContentProps } from "recharts";

import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import type { Crime, Category, Filters } from "../types/crime";

import "./Chart.css";


type ChartProps = {
  crimes: Crime[];
  filters: Filters;
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>

      {payload.map((item) => (
        <p key={String(item.dataKey)}>
          {String(item.dataKey)}: {item.value}
        </p>
      ))}
    </div>
  );
}


export default function Chart({ crimes, filters }: ChartProps) {

  // Full 24 hours divided into 2-hour intervals
  const hours = [
    "12 - 2 AM",
    "2 - 4 AM",
    "4 - 6 AM",
    "6 - 8 AM",
    "8 - 10 AM",
    "10 AM - 12 PM",
    "12 - 2 PM",
    "2 - 4 PM",
    "4 - 6 PM",
    "6 - 8 PM",
    "8 - 10 PM",
    "10 PM - 12 AM"
  ];

  // Create one bucket for every 2-hour interval
  const timelineData = hours.map((hour) => ({
    time: hour,
    violence: 0,
    theft: 0,
    property: 0,
    alcoholDrugs: 0,
    publicOrder: 0,
    other: 0
  }));

  // Go through every crime and add it to the correct
  // 2-hour interval and crime category
  crimes.forEach((crime) => {

    // Convert occurredStart into a Date object
    const date = new Date(crime.occurredStart);

    // Skip invalid dates
    if (isNaN(date.getTime())) {
      return;
    }

    // Get hour only
    const hour = date.getHours();

    const category = crime.category as Category;

    // If sexualCrime, then skip this
    if (category === "sexualCrime") {
      return;
    }

    // Find the correct 2-hour interval
    //
    // 0, 1   -> index 0
    // ...
    // 22, 23 -> index 11
    const index = Math.floor(hour / 2);

    // Add crime to its category
    timelineData[index][category]++;
  });

  const totalShown = timelineData.reduce((total, bucket) => {
    if (filters.violence) {
      total += bucket.violence;
    }

    if (filters.theft) {
      total += bucket.theft;
    }

    if (filters.property) {
      total += bucket.property;
    }

    if (filters.alcoholDrugs) {
      total += bucket.alcoholDrugs;
    }

    if (filters.publicOrder) {
      total += bucket.publicOrder;
    }

    if (filters.other) {
      total += bucket.other;
    }

    return total;
  }, 0);

  return (
    <section className="section">
      <p className="label">
        INCIDENT TIMELINE
      </p>
      <h2>
        Incidents by Time
      </h2>
      <p>
        Explore when reported incidents most commonly occurred
        throughout the day. (Some may not be displayed due to invalid time)
      </p>

      <div className="chartCard">
        {/* Chart header */}
        <div className="chartHeader">
          <div className="chartHeaderLeft">
            <h3>Crime Activity</h3>
            <p>24-hour activity in 2-hour intervals</p>
          </div>
          <div className="chartTotal">
            {totalShown} total incidents
          </div>
        </div>

        {/* Chart */}
        <div className="chartContainer">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              // Load in the data
              data={timelineData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0
              }}
            >
              {/* Horizontal grid lines */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                // Put the property from the data araay
                // Also divides the charts into different section
                dataKey="time"
                tickLine={false}
              />

              <YAxis
                // The y value will be determined by the bar below
                tickLine={false}
                axisLine={false}
              />

              {/* Change the hover color */}
              <Tooltip content={CustomTooltip} />

              {/* Stacked crime categories, this repeats for every single x value*/}
              {filters.violence && (
                <Bar
                  // This make the y value the theft property
                  dataKey="violence"
                  // Same stackId make them stacj together
                  stackId="crime"
                  // This allows customized styling
                  className="chart-bar-violence"
                />
              )}

              {filters.theft && (
                <Bar
                  dataKey="theft"
                  stackId="crime"
                  className="chart-bar-theft"
                />
              )}

              {filters.property && (
                <Bar
                  dataKey="property"
                  stackId="crime"
                  className="chart-bar-property"
                />
              )}

              {filters.alcoholDrugs && (
                <Bar
                  dataKey="alcoholDrugs"
                  stackId="crime"
                  className="chart-bar-alcoholDrugs"
                />
              )}

              {filters.publicOrder && (
                <Bar
                  dataKey="publicOrder"
                  stackId="crime"
                  className="chart-bar-publicOrder"
                />
              )}

              {filters.other && (
                <Bar
                  dataKey="other"
                  stackId="crime"
                  className="chart-bar-other"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}