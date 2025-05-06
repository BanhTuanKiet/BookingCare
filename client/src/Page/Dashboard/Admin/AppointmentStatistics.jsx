import axios from '../../../Util/AxiosConfig'
import React, { useEffect, useState } from 'react'
import { Col, Row, Card } from 'react-bootstrap'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function AppointmentStatistics() {
  const [appointmentsPerMonth, setAppointmentsMonth] = useState([])
  const [appointmentsPerWeek, setAppointmentsPerWeek] = useState([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [total, setTotal] = useState(0)
  const [prevTotal, setPrevTotal] = useState(20)

  useEffect(() => {
    const fetchAppointmentsPerMonth = async () => {
      try {
        const response = await axios.get(`/appointments/statistics/${month}/${year}`)
        setAppointmentsMonth(response.data)
        setTotal(response.data.reduce((sum, item) => sum + item?.appointments, 0))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAppointmentsPerMonth()
  }, [month, year])

  useEffect(() => {
    let prevMonth 
    let preYear
    if (month === 1) {
      prevMonth = 12
      preYear = year - 1 
    } else {
      prevMonth = month - 1
      preYear = year
    }

    const fetchPrevAppointmentsPerMonth = async () => {
      try {
        const response = await axios.get(`/appointments/statistics/${prevMonth}/${preYear}`)
        setPrevTotal(response.data.reduce((sum, item) => sum + item?.appointments, 0))
      } catch (error) {
        console.log(error)
      }
    }

    fetchPrevAppointmentsPerMonth()
  }, [month, year])

  useEffect(() => {
        const fetchAppointmentsPerWeek = async () => {
            try {
                const response = await axios.get(`/appointments/statistics/${month}/week`)
                setAppointmentsPerWeek(response.data)
            } catch (error) {
                console.log(error)
            }            
        }

        fetchAppointmentsPerWeek()
    }, [month])

  const pieData = {
    labels: ['Chờ xác nhận', 'Đã xác nhận', 'Đã khám', 'Đã hoàn thành', 'Đã hủy'],
    datasets: [
        {
            data: [
                appointmentsPerMonth[0]?.appointments || 0,
                appointmentsPerMonth[1]?.appointments || 0,
                appointmentsPerMonth[2]?.appointments || 0,
                appointmentsPerMonth[3]?.appointments || 0,
                appointmentsPerMonth[4]?.appointments || 0,
            ],
            backgroundColor: ['#0dcaf0', '#FF9800', '#198754', '#0d6efd', '#dc3545'],
            borderWidth: 1,
        },
    ],
  }

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const barData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Lịch hẹn theo tuần',
        data: [
            appointmentsPerWeek[0]?.appointments || 0,
            appointmentsPerWeek[1]?.appointments || 0,
            appointmentsPerWeek[2]?.appointments || 0,
            appointmentsPerWeek[3]?.appointments || 0,
        ],
        backgroundColor: '#0d6efd',
      },
    ],
  }

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const rateChange = prevTotal === 0 ? 0 : (((total - prevTotal) / prevTotal) * 100).toFixed(1)

  return (
    <div className='container py-4'>
      <Row className='mb-4'>
        <Col>
          <h4>Thống kê lịch hẹn tháng {month}</h4>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, idx) => (
              <option key={idx} value={idx + 1}>
                Tháng {idx + 1}
              </option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[...Array(5)].map((_, idx) => {
              const y = new Date().getFullYear() - idx
              return (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              )
            })}
          </select>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={4}>
          <Card className='p-3'>
            <h5>Tổng số lịch hẹn</h5>
            <h3>{total}</h3>
            <p className={rateChange >= 0 ? 'text-success' : 'text-danger'}>
              So với tháng trước: {rateChange}%
            </p>
          </Card>

          <Card className='px-3 my-3'>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
              {pieData.labels.map((label, idx) => (
                <li key={idx} style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      backgroundColor: pieData.datasets[0].backgroundColor[idx],
                      marginRight: 8,
                      borderRadius: '50%',
                    }}
                  ></span>
                  {label}: {pieData.datasets[0].data[idx]}
                </li>
              ))}
            </ul>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='p-3'>
            <h5 className='text-center mb-3'>Biểu đồ tháng</h5>
            <Pie data={pieData} options={pieOptions} />
          </Card>
        </Col>

        <Col md={4}>
          <Card className='p-3'>
            <h5 className='text-center mb-3'>Biểu đồ theo tuần</h5>
            <Bar data={barData} options={barOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AppointmentStatistics
