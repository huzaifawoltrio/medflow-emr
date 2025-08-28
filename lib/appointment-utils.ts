// lib/appointment-utils.ts
import { Appointment } from "@/app/redux/features/appointments/appointmentActions";

export interface FormattedAppointment {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  timeDisplay: string;
  color: string;
  borderColor: string;
  textColor: string;
  description?: string;
}

export const formatAppointmentsForCalendar = (
  appointments: Appointment[] = []
): FormattedAppointment[] => {
  return appointments.map((appt) => {
    const startDate = new Date(appt.appointment_datetime);
    const endDate = new Date(startDate.getTime() + appt.duration * 60000);

    const formatTime = (date: Date) => date.toTimeString().substring(0, 5);

    return {
      id: appt.id,
      title: appt.services.join(", "),
      date: startDate,
      startTime: formatTime(startDate),
      endTime: formatTime(endDate),
      timeDisplay: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      color: appt.status === "Scheduled" ? "bg-blue-100" : "bg-gray-100",
      borderColor:
        appt.status === "Scheduled" ? "border-l-blue-400" : "border-l-gray-400",
      textColor:
        appt.status === "Scheduled" ? "text-blue-700" : "text-gray-700",
    };
  });
};

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
