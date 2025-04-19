import React, { useEffect, useState } from "react"
import { Container, Card } from "react-bootstrap"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const DoctorSchedule = ({ infor, setTabActive }) => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const formatSchedule = () => {
      if (!infor || infor.length === 0) return

      const schedules = []
  
      infor.forEach((group, groupIndex) => {
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
  
        schedules.push({
          id: groupIndex,
          title: time === "Sáng" ? `Sáng ${group.patientCount} bệnh nhân` : `Chiều ${group.patientCount} bệnh nhân`,
          start,
          end,
          time,
        })
      })
  
      setEvents(schedules)
    }
  
    formatSchedule()
  }, [infor])

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
    <Container className="py-4">
      <Card className="border-0 shadow w-100 mx-auto p-4">
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
              const selectedTime = event.time
              
              const formattedDate = selectedDate.toLocaleDateString("vi-VN")

              setTabActive(`chi tiết ${formattedDate} - ${selectedTime}`)
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
