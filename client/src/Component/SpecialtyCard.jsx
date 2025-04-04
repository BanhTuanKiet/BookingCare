import React from 'react';
import { useNavigate } from "react-router-dom";
import SpecialtyIntroduce from '../Image/SpecialtyIntroduce/Index';


function SpecialtyCard({ specialty }) {
    const navigate = useNavigate(); // ✅ Đặt bên trong component
    const images = SpecialtyIntroduce

    // Hàm cắt mô tả và thêm dấu "..." nếu có nhiều hơn 30 từ
    const truncateDescription = (description, wordLimit = 30) => {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    };

    return (
        <div 
            className="specialty-card"
            onClick={() => navigate(`/chuyên khoa/${specialty.name}`)} // ✅ Dùng backticks
        >
            <img
                src={images[specialty.name]}
                alt={`Hình ảnh của ${specialty.name}`}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div style={{ padding: "10px" }}>
                <h5>{specialty.name}</h5>
                <p>{truncateDescription(specialty.description)}</p>
            </div>
        </div>
    );
}

export default SpecialtyCard;
