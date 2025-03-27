import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UncontrolledExample({ doctors }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    if (!doctors || doctors.length === 0) {
        return <p>Không có bác sĩ nào để hiển thị.</p>;
    }

    const totalDoctors = doctors.length;

    // Xử lý chỉ số theo cơ chế vòng lặp vô tận
    const getLoopedIndex = (index) => {
        if (index < 0) return index + totalDoctors;
        if (index >= totalDoctors) return index - totalDoctors;
        return index;
    };

    const handlePrev = () => {
        setActiveIndex((prev) => getLoopedIndex(prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => getLoopedIndex(prev + 1));
    };

    // Lấy danh sách 4 bác sĩ theo chỉ mục vòng lặp
    const visibleDoctors = [
        doctors[getLoopedIndex(activeIndex)],
        doctors[getLoopedIndex(activeIndex + 1)],
        doctors[getLoopedIndex(activeIndex + 2)],
        doctors[getLoopedIndex(activeIndex + 3)]
    ];

    console.log(visibleDoctors[0])
    return (
        <div>
            {/* Hiển thị thông tin bác sĩ đầu tiên */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <img
                    src={visibleDoctors[0]?.doctorImage}
                    alt={visibleDoctors[0]?.userName}
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid blue', // Viền xanh
                        padding: '5px', // Giữ khoảng cách giữa ảnh và viền
                        backgroundColor: 'white' // Đảm bảo nền viền trắng không bị hòa lẫn
                    }}
                />
                <div>
                    <h3>{visibleDoctors[0]?.degree + " " + visibleDoctors[0]?.userName}</h3>
                    <h5>{visibleDoctors[0]?.position}</h5>
                    <h5>{"Có hơn " + visibleDoctors[0]?.experienceYears + " năm kinh nghiệm trong ngành."}</h5>
                    <p style={{ color: 'orange', fontWeight: 'bold' }}>{visibleDoctors[0]?.doctorTitle}</p>
                    <p>{visibleDoctors[0]?.description}</p>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/bac-si/${visibleDoctors[0]?.userName}`)}
                        className="mt-auto"
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>

            {/* Carousel hiển thị nhóm bác sĩ */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <Button variant="light" onClick={handlePrev}>
                    ❮
                </Button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {visibleDoctors.map((doctor, index) => (
                        <img
                            key={index}
                            src={doctor.doctorImage}
                            alt={doctor.userName}
                            className="mx-auto mt-3"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: index === 0 ? '2px solid blue' : '1px solid lightgray',
                            }}
                        />
                    ))}
                </div>

                <Button variant="light" onClick={handleNext}>
                    ❯
                </Button>
            </div>
        </div>
    );
}

export default UncontrolledExample;
