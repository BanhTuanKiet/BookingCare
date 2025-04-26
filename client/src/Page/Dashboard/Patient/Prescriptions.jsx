import React, { useEffect, useState } from 'react'
import { Card, Button, Modal } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import PrescriptionCard from '../../../Component/Card/PrescriptionCard'

function Prescriptions({ key, record, tabActive, setTabActive, isSelected }) {
    const [medicalRecords, setMedicalRecords] = useState([])
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get("/medicalRecords/prescriptions");
                setMedicalRecords(response.data);

                const storedPrescriptionId = sessionStorage.getItem('selectedPrescriptionId');
                if (storedPrescriptionId) {
                    setSelectedPrescriptionId(storedPrescriptionId);

                    setTimeout(() => {
                        sessionStorage.removeItem('selectedPrescriptionId');
                    }, 1000);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (tabActive === "prescriptions" || tabActive === "overview") {
            fetchPrescriptions();
        }
    }, [tabActive]);

    const handlePaymentClick = () => {
        setShowPaymentModal(true)
    }

    const handleCloseModal = () => {
        setShowPaymentModal(false)
    }

    const handleSelectVnpay = async () => {
        try {
            const response = await axios.post('vnpaypayment/create-payment', {
                orderId: new Date().getTime().toString(),   // tạo orderId ngẫu nhiên
                orderInfo: "Thanh toán đơn thuốc",
                amount: 100000 // số tiền (ví dụ: 100k)
            });
            window.location.href = response.data.url;  // Redirect tới VNPay
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectMomo = () => {
        alert('Chức năng MoMo đang được phát triển'); // sau này sẽ gọi API MoMo
    }

    return (
        <Card>
            <Card.Body>
                <h4>Đơn Thuốc</h4>
                <p>Lịch sử đơn thuốc đã kê</p>

                {medicalRecords && medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                        <PrescriptionCard
                            key={record.recordId}
                            record={record}
                            tabActive={tabActive}
                            setTabActive={setTabActive}
                            isSelected={isSelected || selectedPrescriptionId === record.recordId}
                        />
                    ))
                ) : (
                    <div className="text-center p-4">
                        <p>Không có đơn thuốc nào trong hồ sơ</p>
                    </div>
                )}

                {/* Nút Thanh toán */}
                <div className="text-center mt-4">
                    <Button variant="primary" onClick={handlePaymentClick}>
                        Thanh toán
                    </Button>
                </div>

                {/* Modal chọn phương thức thanh toán */}
                <Modal show={showPaymentModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Button variant="success" className="m-2" onClick={handleSelectVnpay}>
                            Thanh toán VNPay
                        </Button>
                        <Button variant="warning" className="m-2" onClick={handleSelectMomo}>
                            Thanh toán MoMo
                        </Button>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    )
}

export default Prescriptions
