import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Spinner, Row, Col } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import axios from '../../../Util/AxiosConfig';

const RevenueChart = () => {
  const chartRefs = {
    daily: useRef(null),
    monthly: useRef(null),
    quarterly: useRef(null),
    yearly: useRef(null),
  };

  const chartInstances = useRef({});
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    daily: [],
    monthly: [],
    quarterly: [],
    yearly: []
  });

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/payments/payment`);
      console.log(response.data)
      setRevenueData(response.data);
    } catch (err) {
      console.error('Lỗi khi gọi API doanh thu:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    daily: 'ngày',
    monthly: 'tháng',
    quarterly: 'quý',
    yearly: 'năm'
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
    fetchRevenue();
  }, []);

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

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {['daily', 'monthly', 'quarterly', 'yearly'].map(type => (
            <Col key={type} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="text-capitalize">Doanh thu theo {typeLabels[type]}</Card.Title>
                  <canvas ref={chartRefs[type]} height="300" />
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
