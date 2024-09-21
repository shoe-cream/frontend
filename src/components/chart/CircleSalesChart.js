import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import sendGetEmployeeReportRequest from '../../requests/GetReportEmployee';

// Chart.js에서 사용될 기본 요소들을 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// 더미 데이터 생성
const dummyData = [
  { date: '2024-09-01', orderCount: 10, totalPrice: 5000000, marginRate: 15 },
  { date: '2024-09-02', orderCount: 8, totalPrice: 3500000, marginRate: 10 },
  { date: '2024-09-03', orderCount: 12, totalPrice: 6000000, marginRate: 12 },
  { date: '2024-09-04', orderCount: 5, totalPrice: 2000000, marginRate: 8 },
  { date: '2024-09-05', orderCount: 15, totalPrice: 7500000, marginRate: 20 },
  { date: '2024-09-06', orderCount: 7, totalPrice: 3000000, marginRate: 7 },
  { date: '2024-09-07', orderCount: 11, totalPrice: 5500000, marginRate: 18 },
];

const generateRecentFiveDaysRanges = () => {
  const ranges = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() - i);

      const startDate = currentDate.toISOString().slice(0, 10);
      const endDate = currentDate.toISOString().slice(0, 10);

      ranges.unshift({ startDate, endDate });
  }

  return ranges;
};

const SalesPerformanceChart = ( {employee} ) => {
  // 데이터 처리
  const [employeeAllReport, setEmployeeAllReport] = useState([]);
  const [recentFiveDaysReport, setRecentFiveDaysReport] = useState([]);
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const labels = recentFiveDaysReport.map(item => item.date); // 날짜 리스트
  const orderCounts = recentFiveDaysReport.map(item => item.totalOrderCount); // 하루 주문 건수
  const totalPrices = recentFiveDaysReport.map(item => item.totalOrderPrice); // 하루 총 금액
  const margins = recentFiveDaysReport.map(item => item.margin);// 마진율


//   useEffect(() => {
//     sendGetEmployeeReportRequest(state, startDate, endDate, setEmployeeAllReport, setIsLoading);
// }, [state, startDate, endDate]);


useEffect(() => {
  const fetchDailyReports = async () => {
    const ranges = generateRecentFiveDaysRanges();
    const dailyReport = [];

    for (const range of ranges) {
      await sendGetEmployeeReportRequest(state, range.startDate, range.endDate, (data) => {
        const filteredData = data.filter(item => item.employeeId === employee.data.employeeId);
        
        if (filteredData.length > 0) {
          const firstData = filteredData[0];
          dailyReport.push({
            date: range.startDate,
            margin: firstData.marginRate,
            totalOrderCount: firstData.totalOrderCount,
            totalOrderPrice: firstData.totalOrderPrice
          });
        } else {
          dailyReport.push({
            date: range.startDate,
            margin: 0,
            totalOrderCount: 0,
            totalOrderPrice: 0
          });
        }
      }, setIsLoading);
    }
    setRecentFiveDaysReport(dailyReport);
  };

  if (employee.data && employee.data.employeeId) {
    fetchDailyReports();
  }
}, [state, employee.data]);


  // 차트에 들어갈 데이터 구조
  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',  // 막대 차트로 주문 건수 표시
        label: '주문 건수',
        data: orderCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        yAxisID: 'y',  // 첫 번째 y축에 해당하는 데이터
      },
      {
        type: 'line',  // 선형 차트로 총 금액 표시
        label: '총 금액 (원)',
        data: totalPrices,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y1',  // 두 번째 y축에 해당하는 데이터
      },
      {
        type: 'line',  // 선형 차트로 마진율 표시
        label: '마진율 (%)',
        data: margins,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',  // 총 금액과 같은 y축을 사용 (마진율)
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    interaction: {
      mode: 'index', // 마우스 오버 시 여러 데이터셋의 값 표시
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '주문 건수',
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '총 금액 (원) / 마진율 (%)',
        },
        ticks: {
          callback: function (value, index, ticks) {
            if (index === 0) {
              return value + '%';  // 마진율 표시
            }
            return value.toLocaleString() + '원';  // 금액은 원 단위로 표시
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.dataset.label === '마진율 (%)') {
              return tooltipItem.raw + '%';
            } else if (tooltipItem.dataset.label === '총 금액 (원)') {
              return tooltipItem.raw.toLocaleString() + '원';
            }
            return tooltipItem.raw;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SalesPerformanceChart;
