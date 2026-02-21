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
const API_URL = import.meta.env.VITE_BACKEND_URL

function DashBoard({ onAuthAction }) {
  const [dataDashboardPie, setdataDashboardPie] = useState([])
  const [dataDashboardBar, setdataDashboardBar] = useState([])
  const [dropdown, setDropdown] = useState([])
  const [visiblekey, setVisiblekey] = useState({
    myBid : true,
    myWinning: true,
    saveItem: true
  })
  const currentUserId = localStorage.getItem("acc_id")

  useEffect(() => {
    const fecth_dataDashboard = async () => {
      try {
        const URL = `${API_URL}/api/auction/products`;
        const res = await axios.get(URL, {
          params: { page: "dashboard", userId: currentUserId , dropdownMonth: dropdown}
        });
        const apiDataPie = res.data.dashboardPiechart || [];
        const apiDataBar = res.data.dashboardBarchart || [];
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
  }, [dropdown]);


  const aggregatedData = Object.values(dataDashboardBar.reduce((acc, item) => {
    const key = `${item.month}-${item.week}`;
    if (!acc[key]) {
      acc[key] = { ...item }; // สร้างก้อนใหม่ถ้ายังไม่มี
    } else {
      acc[key].price += item.price; // ถ้ามีแล้วให้บวกราคาเพิ่ม
    }
    return acc;
  }, {}));


  const sortedData = [...aggregatedData].sort((a, b) => {
    // 1. เรียงเดือน (ถ้ามีหลายเดือน)
    // หากข้อมูลมีเดือนเดียว ข้ามไปเช็ก week ได้เลย
    const monthOrder = { "January": 1, "February": 2, "March": 3 , "April":4 , "May":5, "June":6,
    "July":7, "August":8, "September":9, "October":10, "November":11, "December":12/* ...จนครบ */ };
    if (a.month !== b.month) {
      return monthOrder[a.month] - monthOrder[b.month];
    }

    // 2. เรียงสัปดาห์ (W1, W2, W3, W4)
    // ใช้การดึงตัวเลขหลังตัว 'W' ออกมาเปรียบเทียบ
    const weekA = parseInt(a.week.replace('W', ''));
    const weekB = parseInt(b.week.replace('W', ''));
    
    return weekA - weekB;
  });

  console.log(sortedData)


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
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="body-dash">
      <div className="container-dash">
        <div className="pieChart-dash">
          <div className="dropdown-dashBoard">
            <select selected={dropdown} onChange={(e)=> setDropdown(e.target.value)}>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
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
              data={sortedData}
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
              {/* <Legend /> */}
              <Bar dataKey="price" fill="#8884d8" minPointSize={5}>
                {/* <LabelList dataKey="price" content={renderCustomizedLabel2} /> */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
