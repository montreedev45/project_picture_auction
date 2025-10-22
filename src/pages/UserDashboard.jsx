import React from "react";
import "./dashBoard.css";
import { Pie, PieChart } from "recharts";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

function DashBoard({ onAuthAction }) {
  //Pie Chart
  const data = [
    { name: "Group A", value: 300 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
  ];
  const RADIAN = Math.PI / 180;
  const COLORS = ["#ffb4d5", "#b4beff", "#ffd4c4", "#FF8042"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    //old I have to enter any in } : any) => { So is the type script
    //We can't use typescript in file .JSX
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };
  //Bar Chart
  const data2 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 8,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 18,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const renderCustomizedLabel2 = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text
          x={x + width / 2}
          y={y - radius}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value.split(" ")[1]}
        </text>
      </g>
    );
  };

  return (
    <div className="body-dash">
      <div className="container-dash">
        <div className="pieChart-dash">
          <h2>User DashBoard</h2>
          <div className="pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={700} height={700}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="slicer">
            <label htmlFor="slicer">
              <input className="dash-box1" type="checkbox" />
              <span>My Bids</span>
            </label>
            <label htmlFor="slicer">
              <input className="dash-box2" type="checkbox" />
              <span>My winning</span>
            </label>
            <label htmlFor="slicer">
              <input className="dash-box3" type="checkbox" />
              <span>Ended</span>
            </label>
          </div>
        </div>

        <div className="barChacrt-dash">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" minPointSize={5}>
                <LabelList dataKey="name" content={renderCustomizedLabel2} />
              </Bar>
              <Bar dataKey="uv" fill="#82ca9d" minPointSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
