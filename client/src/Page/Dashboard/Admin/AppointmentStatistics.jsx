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
  const [month, setMonth] = useState(new Date().getMonth())
  const [total, setTotal] = useState(0)
  const [previousTotal, setPreviousTotal] = useState(20)

  useEffect(() => {
    const fetchAppointmentsPerMonth = async () => {
      try {
        const res = await axios.get(`/appointments/statistics/${month}`)
        // const prev = await axios.get(`/appointments/statistics/${month === 0 ? 11 : month - 1}`)
        setAppointmentsMonth(res.data)
        console.log(res.data)
        setTotal(res.data.reduce((sum, item) => sum + item.appointments, 0))
        // setPreviousTotal(prev.data.reduce((sum, item) => sum + item.appointments.length, 0))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAppointmentsPerMonth()
  }, [month])

  useEffect(() => {
        const fetchAppointmentsPerWeek = async () => {
            try {
                const response = await axios.get(`/appointments/statistics/${month}/week`)
                console.log(response.data)
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
            appointmentsPerWeek[0]?.count || 0,
            appointmentsPerWeek[1]?.count || 0,
            appointmentsPerWeek[2]?.count || 0,
            appointmentsPerWeek[3]?.count || 0,
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

  const rateChange = previousTotal === 0 ? 0 : (((total - previousTotal) / previousTotal) * 100).toFixed(1)

  return (
    <div className='container py-4'>
      <Row className='mb-4'>
        <Col>
          <h4>Thống kê lịch hẹn tháng {month + 1}</h4>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, idx) => (
              <option key={idx} value={idx}>
                Tháng {idx + 1}
              </option>
            ))}
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
