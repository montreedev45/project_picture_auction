import {useEffect, useMemo, React, useState} from "react";
import "./dashBoard.css";
import { Pie, PieChart } from "recharts";
import axios from "axios";
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
  const [dataDashboardPie, setdataDashboardPie] = useState([])
  const [dataDashboardBar, setdataDashboardBar] = useState([])
  const [visiblekey, setVisiblekey] = useState({
    myBid : true,
    myWinning: true,
    saveItem: true
  })
  const currentUserId = localStorage.getItem("acc_id")

  useEffect(() => {
    const fecth_dataDashboard = async () => {
      try {
        const API_URL = `http://localhost:5000/api/auction/products`;
        const res = await axios.get(API_URL, {
          params: { page: "dashboard", userId: currentUserId }
        });
        const apiDataPie = res.data.dashboardPiechart || [];
        const apiDataBar = res.data.dashboardBarchart || [];
        console.log(apiDataPie)
        console.log(apiDataBar)
        setdataDashboardPie(apiDataPie);
        setdataDashboardBar(apiDataBar)

      } catch (error) {
        console.log(error)
        let errorMessage = "fetch products failed, Pless check server";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        setdataDashboardPie([]); // setProducts ให้เป็น Array เปล่าเสมอ
        setdataDashboardBar([])
      } 
    };

    fecth_dataDashboard();
  }, []);

  const toggleVisibility = (key) => {
    console.log(visiblekey)
    setVisiblekey(prev => ({
      ...prev,
      [key] : !prev[key]
    }))
  }

  const filterData = useMemo(()=>{
    return dataDashboardPie.filter(item => visiblekey[item.key])
  }, [dataDashboardPie,visiblekey])

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
      uv: 10,
      pv: 20,
      amt: 50,
    },
    {
      name: "Page B",
      uv: 10,
      pv: 20,
      amt: 60,
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
                  data={filterData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataDashboardPie.map((entry, index) => (
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
            {dataDashboardPie.map((data)=>{
              return (
                <label htmlFor="slicer" key={data.id}>
                  <input className="dash-box" type="checkbox" checked={visiblekey[data.key]} onChange={() => toggleVisibility(data.key)}/>
                  <span>{data.name}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="barChacrt-dash">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dataDashboardBar}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="month" fill="#8884d8" minPointSize={5}>
                <LabelList dataKey="price" content={renderCustomizedLabel2} />
              </Bar>
              <Bar dataKey="month" fill="#82ca9d" minPointSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
