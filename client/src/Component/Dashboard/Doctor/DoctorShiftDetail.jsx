import React, { useEffect, useState } from 'react'
import axios from "../../../Util/AxiosConfig"

function DoctorShiftDetail({ tabActive }) {
    const time = tabActive.slice(9)
    const params = time.split(" - ")

    const [dateTime, setDateTime] = useState(() => {
        const rawDate = params[0].trim();
        const rawTime = params[1].trim();
        const [day, month, year] = rawDate.split("/");
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        return {
            date: formattedDate,
            time: rawTime
        };
    })

    useEffect(() => {
        const fetchDoctorSchedule = async () => {
            try {
                const response = await axios.get('/appointments/schedule_detail', {
                    params: {
                        date: dateTime.date,
                        time: dateTime.time
                    }
                })
                console.log(response.data)
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }

        fetchDoctorSchedule()
    }, [dateTime])

    return (
        <div>{dateTime.date} {dateTime.time}</div>
    )
}

export default DoctorShiftDetail
