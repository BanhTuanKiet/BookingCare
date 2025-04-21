import React, { useEffect, useState } from "react"
import { Container, Card } from "react-bootstrap"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import axios from "../../../Util/AxiosConfig"

const localizer = momentLocalizer(moment)

const DoctorSchedule = ({ setShowShiftDetail, setDateTime }) => {
  const [events, setEvents] = useState([])
  const [schedules, setSchedules] = useState()

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
        try {
            const response = await axios.get("/appointments/schedule")

            setSchedules(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    fetchDoctorSchedule()
  }, [])

  useEffect(() => {
    const formatSchedule = () => {
      if (!schedules || schedules.length === 0) return

      const schedulesTmp = []
  
      schedules.forEach((group, groupIndex) => {
        const date = new Date(group.date)
        const time = group.appointmentTime

        const start = new Date(date)
        const end = new Date(date)
  
        if (time === "Sáng") {
          start.setHours(7, 0, 0)
          end.setHours(11, 0, 0)
        } else {
          start.setHours(13, 0, 0)
          end.setHours(17, 0, 0)
        }
  
        schedulesTmp.push({
          id: groupIndex,
          title: time === "Sáng" ? `Sáng ${group.patientCount} bệnh nhân` : `Chiều ${group.patientCount} bệnh nhân`,
          start,
          end,
          time,
        })
      })
  
      setEvents(schedulesTmp)
    }
  
    formatSchedule()
  }, [schedules])

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad" 
    let color = "white"

    if (event.time === "Sáng") {
      backgroundColor = "#27ae60"
    } else {
      backgroundColor = "#f39c12"
    }

    if (event.start < new Date()) {
      backgroundColor = "#e74c3c"
    }

    const style = {
      backgroundColor, 
      color,
      borderRadius: "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "5px",
    }

    return { style }
  }

  return (
    <Container className="p-0">
      <Card className="border-0 w-100 mx-auto p-0">
        <h4 className="mb-4 fw-bold">Quản Lý Lịch Làm Việc</h4>
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
            selectable
            onSelectEvent={(event) => {
              const selectedDate = event.start
              const formattedDate = selectedDate.toLocaleDateString("vi-VN")

              setShowShiftDetail(true)
              setDateTime({
                date: formattedDate,
                time: event.time
              })
            }}
            // onSelectSlot={(slotInfo) => console.log("Slot selected: ", slotInfo)}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </Card>
    </Container>
  )
}

export default DoctorSchedule
