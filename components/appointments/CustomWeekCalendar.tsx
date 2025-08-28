// components/appointments/CustomWeekCalendar.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import {
  isSameDay,
  FormattedAppointment,
} from "../../app/lib/appointment-utils";

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
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = (startHour - 9) * 60 + startMin;
    const endMinutes = (endHour - 9) * 60 + endMin;
    const top = (startMinutes / 60) * 80;
    const height = ((endMinutes - startMinutes) / 60) * 80;
    return {
      top: `${top}px`,
      height: `${Math.max(height, 80)}px`,
    };
  };

  const formatWeekRange = (startDate: Date) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const monthName = start.toLocaleDateString("en-US", { month: "long" });
    return `${monthName} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-3 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
            className="hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-center w-48">
            {formatWeekRange(currentWeek)}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
            className="hover:bg-blue-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="bg-blue-800 hover:bg-blue-700 shadow-md transition-all duration-200"
          onClick={onAddNewClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>

      <div className="relative overflow-x-auto">
        <div className="grid grid-cols-8 border-b border-gray-200 pb-2 md:pb-4 mb-2 md:mb-4 min-w-[600px] md:min-w-0">
          <div className="text-xs md:text-sm text-gray-500 font-medium px-1">
            Time
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center px-1">
              <div className="text-xs md:text-sm font-medium text-gray-900">
                {day.getDate()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
            </div>
          ))}
        </div>

        <div className="relative min-w-[600px] md:min-w-0">
          <div className="absolute left-0 top-0 w-16 md:w-20 z-10">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="flex items-start pt-3 md:pt-4 text-xs text-gray-400 bg-white"
                style={{ height: "80px" }}
              >
                {time}
              </div>
            ))}
          </div>

          <div className="ml-16 md:ml-20 relative">
            {/* Background lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-200"
                style={{ height: "80px" }}
              />
            ))}

            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative bg-white border-r border-gray-100 last:border-r-0"
                >
                  {/* Vertical hour lines */}
                  {timeSlots.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${hourIndex * 80}px`, height: "1px" }}
                    />
                  ))}

                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                    </div>
                  ) : (
                    appointments
                      .filter((apt) => isSameDay(apt.date, day))
                      .map((appointment) => {
                        const position = getAppointmentPosition(
                          appointment.startTime,
                          appointment.endTime
                        );
                        return (
                          <div
                            key={appointment.id}
                            onClick={() => onAppointmentClick(appointment)}
                            className={`
                              absolute left-1 right-1 
                              ${appointment.color} ${appointment.borderColor} 
                              border-l-4 rounded-xl shadow-sm hover:shadow-lg 
                              cursor-pointer transition-all duration-300 ease-in-out 
                              hover:scale-[1.02] hover:-translate-y-0.5 
                              z-20 flex flex-col justify-start 
                              p-3 overflow-hidden
                              backdrop-blur-sm border border-white/20
                              transform-gpu
                              active:scale-[0.98] select-none
                            `}
                            style={{
                              top: position.top,
                              height: position.height,
                              minHeight: "80px",
                            }}
                          >
                            {/* Time Header */}
                            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-current opacity-80 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-700 leading-none">
                                {appointment.timeDisplay}
                              </span>
                            </div>

                            {/* Appointment Title */}
                            <div className="flex-1 flex flex-col justify-start">
                              <div className="text-sm font-medium text-gray-900 leading-tight mb-1 break-words">
                                {appointment.title}
                              </div>

                              {appointment.description && (
                                <div className="text-xs text-gray-600 leading-tight opacity-90 line-clamp-2">
                                  {appointment.description}
                                </div>
                              )}
                            </div>

                            {/* Hover overlay effect */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                          </div>
                        );
                      })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomWeekCalendar;
