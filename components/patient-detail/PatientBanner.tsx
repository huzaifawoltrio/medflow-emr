// components/patient-detail/PatientBanner.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, Mail, MapPin, Phone } from "lucide-react";

interface PatientBannerProps {
  patientData: {
    name: string;
    avatar: string;
    initials: string;
    gender: string;
    age: number;
    mrn: string;
    location: string;
    contact: {
      phone: string;
      email: string;
      address: string;
    };
    dob: string;
    admitDate: string;
    dischargeDate: string | null;
  };
}

export function PatientBanner({ patientData }: PatientBannerProps) {
  return (
    <div className="z-40 w-full bg-white rounded-2xl border border-slate-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
          {/* Left Section: Patient Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20 ring-4 ring-blue-100">
                <AvatarImage src={patientData.avatar} alt={patientData.name} />
                <AvatarFallback className="bg-blue-800 text-white text-2xl font-semibold">
                  {patientData.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 truncate">
                  {patientData.name}
                </h1>
                <Badge
                  className={
                    patientData.dischargeDate
                      ? "bg-emerald-100 text-emerald-800 border-transparent"
                      : "bg-blue-100 text-blue-800 border-transparent font-semibold"
                  }
                >
                  {patientData.dischargeDate ? "Discharged" : "Active Patient"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 bg-blue-800 rounded-full"></span>
                  <span className="font-medium text-slate-700">
                    {patientData.gender}, {patientData.age} years
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 bg-blue-800 rounded-full"></span>
                  <span>
                    MRN:{" "}
                    <span className="font-mono font-medium tracking-wider text-slate-700">
                      {patientData.mrn}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-800" />
                  <span className="truncate">{patientData.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-3 text-slate-600 text-sm">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                    <span>{patientData.contact.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                    <span className="truncate">
                      {patientData.contact.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 col-span-1 sm:col-span-2 xl:col-span-1">
                    <Home className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                    <span>{patientData.contact.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
                    <span>DOB: {patientData.dob}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Quick Info only */}
          <div className="grid grid-cols-1 gap-3 text-sm w-full sm:w-auto flex-shrink-0">
            <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-800" />
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                  Admitted
                </span>
              </div>
              <span className="font-semibold text-slate-800 text-base">
                {patientData.admitDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
