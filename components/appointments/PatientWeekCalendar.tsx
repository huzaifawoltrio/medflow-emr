// components/appointments/CustomWeekCalendar.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Loader2, Clock } from "lucide-react";
import { isSameDay, FormattedAppointment } from "../../lib/appointment-utils";

interface CustomWeekCalendarProps {
  appointments: FormattedAppointment[];
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  onAddNewClick: () => void;
  onAppointmentClick: (appointment: FormattedAppointment) => void;
  loading: boolean;
}

const CustomWeekCalendar = ({
  appointments,
  currentWeek,
  setCurrentWeek,
  onAddNewClick,
  onAppointmentClick,
  loading,
}: CustomWeekCalendarProps) => {
  const getWeekDays = (startDate: Date) => {
    const days = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = (startHour - 9) * 60 + startMin;
    const endMinutes = (endHour - 9) * 60 + endMin;
    const top = (startMinutes / 60) * 60;
    const height = ((endMinutes - startMinutes) / 60) * 60;
    return {
      top: `${top}px`,
      height: `${Math.max(height, 60)}px`,
    };
  };

  const formatWeekRange = (startDate: Date) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const monthName = start.toLocaleDateString("en-US", { month: "long" });
    return `${monthName} ${start.getDate()}-${end.getDate()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const today = new Date();

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("prev")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <span className="text-base text-gray-700 mx-4 min-w-[120px] text-center">
            {formatWeekRange(currentWeek)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("next")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <div className="flex items-center gap-4"></div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="p-4 text-sm font-medium text-gray-600 border-r border-gray-200">
            Week
          </div>
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            return (
              <div key={index} className="p-4 text-center">
                <div
                  className={`text-lg font-medium ${
                    isToday ? "text-
blue-800" : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
                <div
                  className={`text-sm ${
                    isToday ? "text-
blue-800" : "text-gray-500"
                  }`}
                >
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
              style={{ height: "60px" }}
            >
              {/* Time Label */}
              <div className="p-4 text-sm text-gray-500 border-r border-gray-200 flex items-start pt-3 gap-2">
                {time}
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIndex) => (
                <div
                  key={`${time}-${dayIndex}`}
                  className="relative hover:bg-gray-50 transition-colors"
                >
                  {loading
                    ? index === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )
                    : appointments
                        .filter((apt) => isSameDay(apt.date, day))
                        .map((appointment) => {
                          const [startHour] = appointment.startTime
                            .split(":")
                            .map(Number);
                          const appointmentHour = 9 + index;

                          // Only render on the hour where the appointment starts
                          if (startHour !== appointmentHour) return null;

                          const position = getAppointmentPosition(
                            appointment.startTime,
                            appointment.endTime
                          );

                          // Get bolder text color based on background
                          const getBoldTextColor = (colorClass: string) => {
                            if (colorClass.includes("bg-blue"))
                              return "text-blue-800";
                            if (colorClass.includes("bg-green"))
                              return "text-green-800";
                            if (colorClass.includes("bg-purple"))
                              return "text-purple-800";
                            if (colorClass.includes("bg-red"))
                              return "text-red-800";
                            if (colorClass.includes("bg-yellow"))
                              return "text-yellow-800";
                            if (colorClass.includes("bg-pink"))
                              return "text-pink-800";
                            if (colorClass.includes("bg-cyan"))
                              return "text-cyan-800";
                            return "text-gray-800";
                          };

                          return (
                            <div
                              key={appointment.id}
                              onClick={() => onAppointmentClick(appointment)}
                              className={`
                              absolute left-1 right-1 top-1 
                              ${appointment.color} ${appointment.borderColor}
                              border-l-4 rounded-lg shadow-sm hover:shadow-md
                              cursor-pointer transition-all duration-200
                              z-10 p-2 text-xs
                            `}
                              style={{
                                height: position.height,
                                minHeight: "58px",
                              }}
                            >
                              <div
                                className={`font-medium leading-tight ${getBoldTextColor(
                                  appointment.color
                                )}`}
                              >
                                {appointment.title}
                              </div>
                              <div
                                className={`mt-1 flex items-center gap-1 ${getBoldTextColor(
                                  appointment.color
                                )} opacity-80`}
                              >
                                <Clock className="h-3 w-3 mt-0.5" />
                                <span>{appointment.timeDisplay}</span>
                              </div>
                              {appointment.description && (
                                <div
                                  className={`mt-1 line-clamp-1 ${getBoldTextColor(
                                    appointment.color
                                  )} opacity-70`}
                                >
                                  {appointment.description}
                                </div>
                              )}
                            </div>
                          );
                        })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomWeekCalendar;
