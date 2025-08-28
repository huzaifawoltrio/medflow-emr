"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/main-layout";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchAppointments } from "@/app/redux/features/appointments/appointmentActions";
import {
  formatAppointmentsForCalendar,
  isSameDay,
  FormattedAppointment,
} from "../../../lib/appointment-utils";
import CustomWeekCalendar from "@/components/appointments/CustomWeekCalendar";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import AppointmentDetailsModal from "@/components/appointments/AppointmentDetailsModal";
import SidebarCards from "@/components/appointments/SidebarCards";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<FormattedAppointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const dispatch = useAppDispatch();
  const {
    appointments: rawAppointments,
    loading,
    error,
  } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    dispatch(
      fetchAppointments({
        startDate: formatDate(start),
        endDate: formatDate(end),
      })
    );
  }, [dispatch, currentWeek]);

  const formattedAppointments = useMemo(
    () => formatAppointmentsForCalendar(rawAppointments),
    [rawAppointments]
  );

  // Calculate today's summary from appointments
  const today = new Date();
  const todaysAppointments = formattedAppointments.filter((appt) =>
    isSameDay(appt.date, today)
  );

  const confirmedAppointments = todaysAppointments.filter(
    (appt) => appt.textColor === "text-blue-700"
  ).length;

  const pendingAppointments = todaysAppointments.length - confirmedAppointments;

  const handleAppointmentClick = (appointment: FormattedAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-3 md:space-y-4 p-4 md:p-0 max-h-screen overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Scheduling
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-120px)]">
          <div className="lg:col-span-3">
            {error && <p className="text-red-500">Error: {error}</p>}
            <CustomWeekCalendar
              appointments={formattedAppointments}
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              onAddNewClick={() => setIsModalOpen(true)}
              onAppointmentClick={handleAppointmentClick}
              loading={loading}
            />
          </div>

          <SidebarCards
            todaysAppointments={todaysAppointments}
            confirmedAppointments={confirmedAppointments}
            pendingAppointments={pendingAppointments}
          />
        </div>

        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      </div>
    </MainLayout>
  );
}
