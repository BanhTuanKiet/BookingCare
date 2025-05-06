import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Spinner, Row, Col } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import axios from '../../../Util/AxiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RevenueChart = () => {
  const chartRefs = {
    daily: useRef(null),
    monthly: useRef(null),
    quarterly: useRef(null),
    yearly: useRef(null),
  };

  const chartInstances = useRef({});
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState({
    daily: [],
    monthly: [],
    quarterly: [],
    yearly: []
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const typeLabels = {
    daily: 'ngày',
    monthly: 'tháng',
    quarterly: 'quý',
    yearly: 'năm'
  };

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start = startDate.toISOString().split('T')[0];
      if (endDate) params.end = endDate.toISOString().split('T')[0];

      const response = await axios.get('/payments/payment', { params });
      setRevenueData(response.data);
    } catch (err) {
      console.error('Lỗi khi gọi API doanh thu:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (type, data) => {
    const labelFieldMap = {
      daily: 'date',
      monthly: 'month',
      quarterly: 'quarter',
      yearly: 'year'
    };
    const labelField = labelFieldMap[type];

    const labels = data.map(d => d[labelField]);
    const totals = data.map(d => d.total);

    if (chartInstances.current[type]) {
      chartInstances.current[type].destroy();
    }

    const ctx = chartRefs[type].current.getContext('2d');
    chartInstances.current[type] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Doanh thu (${typeLabels[type]})`,
          data: totals,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Biểu đồ doanh thu theo ${typeLabels[type]}`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => value.toLocaleString('vi-VN') + ' đ'
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenue();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    Object.entries(revenueData).forEach(([type, data]) => {
      if (chartRefs[type]?.current && data.length > 0) {
        renderChart(type, data);
      }
    });

    return () => {
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };
  }, [revenueData]);

  return (
    <Container fluid>
      <div className="mb-3">
        <h4>Biểu đồ Doanh thu</h4>
        <p>Thống kê doanh thu theo ngày, tháng, quý và năm</p>
      </div>

      <div className="d-flex align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <label className="me-2">Từ ngày:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            maxDate={new Date()}
            placeholderText="Chọn ngày bắt đầu"
          />
        </div>
        <div>
          <label className="me-2">Đến ngày:</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            maxDate={new Date()}
            placeholderText="Chọn ngày kết thúc"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {['daily', 'monthly', 'quarterly', 'yearly'].map(type => (
            <Col key={type} md={12} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="text-capitalize">Doanh thu theo {typeLabels[type]}</Card.Title>
                  <canvas ref={chartRefs[type]} height="200" />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RevenueChart;
