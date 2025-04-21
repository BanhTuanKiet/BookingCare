import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import PrescriptionCard from '../../../Component/Card/PrescriptionCard'

function Prescriptions({ tabActive, setTabActive }) {
    const [medicalRecords, setMedicalRecords] = useState([])

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get("/medicalRecords/prescriptions")

                setMedicalRecords(response.data)
            } catch (error) {
                console.log(error)
            }
        }
    
        if (tabActive === "prescriptions") {
            fetchPrescriptions()
        }
    }, [tabActive])
    
    return (
        <Card>
            <Card.Body>
                <h4>Đơn Thuốc</h4>
                <p>Lịch sử đơn thuốc đã kê</p>
                
                {medicalRecords && medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                        <PrescriptionCard record={record} tabActive={tabActive} setTabActive={setTabActive} />
                    ))
                ) : (
                    <div className="text-center p-4">
                        <p>Không có đơn thuốc nào trong hồ sơ</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default Prescriptions