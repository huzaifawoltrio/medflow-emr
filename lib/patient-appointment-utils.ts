// lib/patient-appointment-utils.ts
export interface PatientAppointment {
  id: number;
  appointment_datetime: string;
  appointment_fee: number;
  billing_type: string;
  doctor_id: number;
  duration: number;
  location: string;
  patient_id: number;
  repeat: boolean;
  services: string[];
  status: string;
  // Additional fields that might be populated by joins
  doctor_name?: string;
  doctor_specialization?: string;
  notes?: string;
}

export interface FormattedPatientAppointment {
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
  location: string;
  services: string[];
  status: string;
  fee: number;
  billingType: string;
  duration: number;
  doctorName?: string;
  doctorSpecialization?: string;
}

export const formatPatientAppointmentsForCalendar = (
  appointments: PatientAppointment[]
): FormattedPatientAppointment[] => {
  return appointments.map((appointment) => {
    const appointmentDate = new Date(appointment.appointment_datetime);
    const startTime = appointmentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const endTime = new Date(
      appointmentDate.getTime() + appointment.duration * 60000
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const timeDisplay = `${appointmentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })} - ${new Date(
      appointmentDate.getTime() + appointment.duration * 60000
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;

    // Color coding based on appointment status
    let color, borderColor, textColor;
    switch (appointment.status?.toLowerCase()) {
      case "scheduled":
        color = "bg-blue-100";
        borderColor = "border-blue-400";
        textColor = "text-blue-800";
        break;
      case "completed":
        color = "bg-green-100";
        borderColor = "border-green-400";
        textColor = "text-green-800";
        break;
      case "cancelled":
        color = "bg-red-100";
        borderColor = "border-red-400";
        textColor = "text-red-800";
        break;
      case "no-show":
        color = "bg-gray-100";
        borderColor = "border-gray-400";
        textColor = "text-gray-800";
        break;
      case "requested":
        color = "bg-yellow-100";
        borderColor = "border-yellow-400";
        textColor = "text-yellow-800";
        break;
      default:
        color = "bg-blue-100";
        borderColor = "border-blue-400";
        textColor = "text-blue-800";
    }

    // Create a descriptive title
    const primaryService = appointment.services?.[0] || "Appointment";
    const doctorName = appointment.doctor_name
      ? `Dr. ${appointment.doctor_name}`
      : "Doctor";
    const title = `${primaryService} - ${doctorName}`;

    return {
      id: appointment.id,
      title,
      date: appointmentDate,
      startTime,
      endTime,
      timeDisplay,
      color,
      borderColor,
      textColor,
      description:
        appointment.notes || `${appointment.services.join(", ")} appointment`,
      location: appointment.location,
      services: appointment.services,
      status: appointment.status,
      fee: appointment.appointment_fee,
      billingType: appointment.billing_type,
      duration: appointment.duration,
      doctorName: appointment.doctor_name,
      doctorSpecialization: appointment.doctor_specialization,
    };
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getAppointmentsByStatus = (
  appointments: FormattedPatientAppointment[]
) => {
  return {
    scheduled: appointments.filter(
      (apt) => apt.status?.toLowerCase() === "scheduled"
    ),
    completed: appointments.filter(
      (apt) => apt.status?.toLowerCase() === "completed"
    ),
    cancelled: appointments.filter(
      (apt) => apt.status?.toLowerCase() === "cancelled"
    ),
    requested: appointments.filter(
      (apt) => apt.status?.toLowerCase() === "requested"
    ),
    noShow: appointments.filter(
      (apt) => apt.status?.toLowerCase() === "no-show"
    ),
  };
};

export const getUpcomingAppointments = (
  appointments: FormattedPatientAppointment[]
) => {
  const now = new Date();
  return appointments.filter(
    (apt) =>
      apt.date > now &&
      (apt.status?.toLowerCase() === "scheduled" ||
        apt.status?.toLowerCase() === "requested")
  );
};

export const getTodaysAppointments = (
  appointments: FormattedPatientAppointment[]
) => {
  const today = new Date();
  return appointments.filter((apt) => isSameDay(apt.date, today));
};

export const getNextAppointment = (
  appointments: FormattedPatientAppointment[]
) => {
  const upcoming = getUpcomingAppointments(appointments);
  return (
    upcoming.sort((a, b) => a.date.getTime() - b.date.getTime())[0] || null
  );
};

// Helper function to format appointment status for display
export const formatAppointmentStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "scheduled":
      return "Scheduled";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "no-show":
      return "No Show";
    case "requested":
      return "Requested";
    default:
      return status || "Unknown";
  }
};

// Helper function to check if appointment can be cancelled/rescheduled
export const canModifyAppointment = (
  appointment: FormattedPatientAppointment
) => {
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  const hoursUntilAppointment =
    (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return (
    appointment.status?.toLowerCase() === "scheduled" &&
    hoursUntilAppointment > 24
  );
};

// Helper function to get appointment urgency color
export const getUrgencyColor = (urgency?: string) => {
  switch (urgency?.toLowerCase()) {
    case "emergency":
      return "bg-red-100 text-red-800 border-red-200";
    case "urgent":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "routine":
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
};

// Helper function to calculate appointment statistics
export const getAppointmentStats = (
  appointments: FormattedPatientAppointment[]
) => {
  const stats = getAppointmentsByStatus(appointments);
  const upcoming = getUpcomingAppointments(appointments);
  const today = getTodaysAppointments(appointments);

  return {
    total: appointments.length,
    scheduled: stats.scheduled.length,
    completed: stats.completed.length,
    cancelled: stats.cancelled.length,
    upcoming: upcoming.length,
    today: today.length,
    todayScheduled: today.filter(
      (apt) => apt.status?.toLowerCase() === "scheduled"
    ).length,
  };
};
