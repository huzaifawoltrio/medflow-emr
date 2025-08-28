"use client";

import { useState, useMemo, Fragment } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Search,
  FileText,
  Calendar,
  User,
  ChevronDown,
  Eye,
  AlertTriangle,
  Activity,
  TestTube,
  Camera,
  Heart,
  TrendingUp,
  X,
  CheckCircle,
  Download,
  MessageSquare,
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface Patient {
  id: string;
  name: string;
}

interface Result {
  id: number;
  patientName: string;
  patientId: string;
  date: string;
  category: "Labs" | "Imaging" | "Vitals";
  type: string;
  status: string;
  result: string;
  critical: boolean;
  values: string;
  referenceRange: string | null;
  orderedBy?: string;
  notes?: string;
}

// --- MOCK DATA ---
const mockResults: Result[] = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientId: "MRN-789012",
    date: "2025-08-25T10:30:00",
    category: "Labs",
    type: "Complete Blood Count",
    status: "completed",
    result: "Normal",
    critical: false,
    values: "WBC: 6.5, RBC: 4.2, Hgb: 13.8, Hct: 41.2",
    referenceRange: "WBC: 4.5-11.0, RBC: 3.8-5.2, Hgb: 12.0-15.5, Hct: 36-46",
    orderedBy: "Dr. Smith",
    notes: "Routine check. All values are within the expected normal ranges.",
  },
  {
    id: 2,
    patientName: "John Martinez",
    patientId: "MRN-456789",
    date: "2025-08-24T14:15:00",
    category: "Imaging",
    type: "Chest X-Ray",
    status: "completed",
    result: "No acute findings",
    critical: false,
    values: "Clear lung fields, normal cardiac silhouette.",
    referenceRange: null,
    orderedBy: "Dr. Chen",
    notes:
      "X-ray performed to rule out pneumonia. No acute cardiopulmonary process identified.",
  },
  {
    id: 3,
    patientName: "Robert Wilson",
    patientId: "MRN-987654",
    date: "2025-08-26T09:00:00",
    category: "Vitals",
    type: "Blood Pressure",
    status: "completed",
    result: "Elevated",
    critical: true,
    values: "180/95 mmHg",
    referenceRange: "<120/80 mmHg",
    orderedBy: "Nurse Patricia",
    notes:
      "Patient reported a headache. BP is critically high. Dr. Smith has been notified.",
  },
];

const allPatients: Patient[] = Array.from(
  new Set(
    mockResults.map((r) =>
      JSON.stringify({ id: r.patientId, name: r.patientName })
    )
  )
).map((p) => JSON.parse(p));

// --- UI COMPONENTS ---
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: any;
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-blue-800 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  const sizes = { default: "px-4 py-2 text-sm", sm: "px-3 py-1.5 text-xs" };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: React.ComponentProps<"input">) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${className}`}
    {...props}
  />
);

const Select = ({ children, ...props }: React.ComponentProps<"select">) => (
  <div className="relative">
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white"
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  </div>
);

// --- MODAL COMPONENT ---
const ResultDetailsModal = ({
  result,
  isOpen,
  onClose,
}: {
  result: Result | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !result) return null;

  const CategoryIcon =
    { Labs: TestTube, Imaging: Camera, Vitals: Activity }[result.category] ||
    FileText;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                result.critical ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              <CategoryIcon
                className={`h-6 w-6 ${
                  result.critical ? "text-red-700" : "text-blue-700"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{result.type}</h2>
              <p className="text-sm text-gray-600">
                {result.patientName} ({result.patientId})
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {result.critical && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    Critical Finding
                  </h3>
                  <p className="text-sm text-red-700">
                    This result requires immediate attention.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Date</p>
              <p className="text-gray-800 font-semibold">
                {new Date(result.date).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Status</p>
              <p className="text-gray-800 font-semibold">{result.result}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 font-medium">Ordered By</p>
              <p className="text-gray-800 font-semibold">{result.orderedBy}</p>
            </div>
          </div>

          {/* Values & Reference Range */}
          <div className="border rounded-lg">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Result Values
              </h3>
              <p className="text-gray-700 font-mono bg-gray-50 p-3 rounded-md">
                {result.values}
              </p>
            </div>
            {result.referenceRange && (
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Reference Range
                </h3>
                <p className="text-sm text-gray-600">{result.referenceRange}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {result.notes && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {result.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t sticky bottom-0 bg-white">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ResultsReviewPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewResult = (result: Result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  const getResultBadge = (result: string, critical: boolean) => {
    if (critical)
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Critical
        </Badge>
      );
    if (result === "Normal")
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Normal
        </Badge>
      );
    if (result === "Borderline" || result === "Elevated")
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {result}
        </Badge>
      );
    return <Badge className="bg-gray-100 text-gray-800">{result}</Badge>;
  };
  const getCategoryIcon = (category: "Labs" | "Imaging" | "Vitals") =>
    ({ Labs: TestTube, Imaging: Camera, Vitals: Activity }[category] ||
    FileText);

  const filteredResults = useMemo(
    () =>
      mockResults
        .filter(
          (result) =>
            (result.patientName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              result.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedPatient === "all" ||
              result.patientId === selectedPatient) &&
            (categoryFilter === "all" || result.category === categoryFilter)
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [searchTerm, selectedPatient, categoryFilter]
  );

  const groupedResults = useMemo(
    () =>
      filteredResults.reduce((acc, result) => {
        if (!acc[result.category]) acc[result.category] = [];
        acc[result.category].push(result);
        return acc;
      }, {} as Record<string, Result[]>),
    [filteredResults]
  );

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Results Review</h1>
            <p className="mt-2 text-gray-600">
              Review and manage all patient results
            </p>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search results by patient, test type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="all">All Patients</option>
                  {allPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </Select>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Labs">Labs</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Vitals">Vitals</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {Object.keys(groupedResults).length > 0 ? (
              Object.entries(groupedResults).map(([category, results]) => {
                const CategoryIcon = getCategoryIcon(
                  category as "Labs" | "Imaging" | "Vitals"
                );
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-5 w-5 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        {category}
                      </h2>
                      <Badge className="bg-gray-100 text-gray-700">
                        {results.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div
                          key={result.id}
                          className="bg-white rounded-lg shadow-sm border p-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    result.critical
                                      ? "bg-red-100"
                                      : "bg-blue-100"
                                  }`}
                                >
                                  <CategoryIcon
                                    className={`h-5 w-5 ${
                                      result.critical
                                        ? "text-red-800"
                                        : "text-blue-800"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {result.type}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {result.patientName} ({result.patientId})
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                {getResultBadge(result.result, result.critical)}
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(result.date)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">
                                  Result:{" "}
                                </span>
                                <span className="text-sm text-gray-800">
                                  {result.values}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResult(result)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Full
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No results found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      <ResultDetailsModal
        result={selectedResult}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
}
