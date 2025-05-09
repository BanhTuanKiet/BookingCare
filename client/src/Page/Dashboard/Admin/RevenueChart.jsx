import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Spinner, Row, Col, ButtonGroup, Button, Alert } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import axios from '../../../Util/AxiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RevenueChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedType] = useState('daily');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');

  const typeLabels = {
    daily: 'ngày',
    monthly: 'tháng',
    quarterly: 'quý',
    yearly: 'năm'
  };

  const labelFieldMap = {
    daily: 'date',
    monthly: 'month',
    quarterly: 'quarter',
    yearly: 'year'
  };

  const fetchRevenue = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/payments/${selectedType}`);
      console.log(response.data);
      setChartData(response.data);
    } catch (err) {
      console.error('Lỗi khi gọi API doanh thu:', err.response?.data || err.message);
      setError('Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    setError('');
  
    if (!startDate || !endDate) {
      setError('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc để thống kê.');
      return;
    }
  
    if (endDate < startDate) {
      setError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
      return;
    }
  
    const labelField = labelFieldMap[selectedType];
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const filteredData = chartData.filter(item => {
      const value = item[labelField];
      if (!value) return false;
    
      if (selectedType === 'yearly') {
        const year = parseInt(value);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        return year >= startYear && year <= endYear;
      }
    
      let parsedDate;
      if (selectedType === 'daily') {
        parsedDate = new Date(value);
      } else if (selectedType === 'monthly') {
        parsedDate = new Date(`${value}-01`);
      } else if (selectedType === 'quarterly') {
        const [q, year] = value.split('-');
        const month = (parseInt(q.replace('Q', '')) - 1) * 3 + 1;
        parsedDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      }
    
      return parsedDate >= startDate && parsedDate <= endDate;
    });
    
  
    if (filteredData.length === 0) {
      setError('Không có dữ liệu trong khoảng thời gian đã chọn.');
      return;
    }
  
    const labels = filteredData.map(d => d[labelField]);
    const totals = filteredData.map(d => d.total);
  
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
  
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Doanh thu (${typeLabels[selectedType]})`,
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
            text: `Biểu đồ doanh thu theo ${typeLabels[selectedType]}`
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
  }, [selectedType]);

  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      renderChart();
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, startDate, endDate]);

  return (
    <Container fluid>
      <div className="mb-3">
        <h4>Biểu đồ Doanh thu</h4>
        <p>Chọn loại thống kê và khoảng ngày để xem biểu đồ doanh thu</p>
      </div>

      <div className="d-flex align-items-center mb-3 gap-3 flex-wrap">
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
        <div>
          <label className="me-2">Loại thống kê:</label>
          <ButtonGroup>
            {['daily', 'monthly', 'quarterly', 'yearly'].map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedType(type)}
              >
                {typeLabels[type]}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card>
          <Card.Body>
            <canvas ref={chartRef} height="200" />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default RevenueChart;
