import React, { useEffect, useState } from 'react';
import axios from '../../../Util/AxiosConfig';

const DepartmentRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentRatings = async () => {
      try {
        const res = await axios.get('/reviews/department-ratings');
        console.log(res.data);
        setRatings(res.data);
      } catch (error) {
        console.error('Failed to fetch department ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentRatings();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bảng đánh giá các khoa</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Tên khoa</th>
              <th style={thStyle}>Kiến thức</th>
              <th style={thStyle}>Thái độ</th>
              <th style={thStyle}>Tận tâm</th>
              <th style={thStyle}>Giao tiếp</th>
              <th style={thStyle}>Trung bình</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((dept, index) => (
              <tr key={dept.departmentId}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{dept.departmentName}</td>
                <td style={tdStyle}>{dept.avgKnowledge}</td>
                <td style={tdStyle}>{dept.avgAttitude}</td>
                <td style={tdStyle}>{dept.avgDedication}</td>
                <td style={tdStyle}>{dept.avgCommunicationSkill}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{dept.overallAverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'center',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'center'
};

export default DepartmentRatings;
