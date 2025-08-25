"use client";

import { useState, useEffect, Fragment } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  User,
  MapPin,
  Shield,
  Phone,
} from "lucide-react";

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Upload", "Processing", "Validation", "Complete"];

  return (
    <div className="flex items-center justify-start space-x-6">
      {steps.map((step, index) => (
        <Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-medium ${
                index + 1 === currentStep
                  ? "bg-blue-800 text-white border-blue-800"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-xs ${
                index + 1 === currentStep
                  ? "text-blue-800 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-gray-300" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

const ProcessingScreen = ({
  fileName,
  fileSize,
}: {
  fileName: string;
  fileSize: string;
}) => {
  const [progress, setProgress] = useState([
    { text: "Document uploaded successfully", done: false },
    { text: "OCR text extraction completed", done: false },
    { text: "AI data extraction in progress...", done: false },
  ]);

  useEffect(() => {
    const timers = [
      setTimeout(
        () =>
          setProgress((p) =>
            p.map((item, i) => (i === 0 ? { ...item, done: true } : item))
          ),
        500
      ),
      setTimeout(
        () =>
          setProgress((p) =>
            p.map((item, i) => (i === 1 ? { ...item, done: true } : item))
          ),
        1500
      ),
      setTimeout(
        () =>
          setProgress((p) =>
            p.map((item, i) => (i === 2 ? { ...item, done: true } : item))
          ),
        2500
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-center p-12 bg-white rounded-lg shadow-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        Processing Document
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        AI is analyzing your document and extracting patient information...
      </p>
      <div className="mt-6 text-left inline-block">
        {progress.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            {item.done ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
            )}
            <span
              className={`text-sm ${
                item.done ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
        Processing: {fileName} | Size: {fileSize}
      </div>
    </div>
  );
};

const ConfidenceBadge = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 90) return "border-green-500 text-green-600";
    if (score >= 70) return "border-yellow-500 text-yellow-600";
    return "border-red-500 text-red-600";
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-md border bg-white ${getColor()}`}
    >
      {score}%
    </span>
  );
};

const EditableField = ({
  label,
  value,
  confidence,
  warning,
}: {
  label: string;
  value: string;
  confidence?: number;
  warning?: string;
}) => (
  <div className="p-3 border rounded-lg bg-white shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center space-x-2">
        <Label className="text-sm text-gray-600">{label}</Label>
        {confidence && <ConfidenceBadge score={confidence} />}
      </div>
      <Pencil className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
    </div>
    <Input
      defaultValue={value}
      className="text-base font-medium border-none bg-transparent p-0 h-auto focus-visible:ring-0"
    />
    {warning && <p className="text-xs text-yellow-600 mt-1">{warning}</p>}
  </div>
);

const ValidationForm = () => (
  <div>
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 mb-6">
      <AlertTriangle className="h-5 w-5 text-blue-800 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">
        Please review and verify the extracted information below. Fields with
        lower confidence scores may require manual correction.
      </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-800" /> Personal Information
        </h3>
        <div className="space-y-3">
          <EditableField label="First Name" value="John" confidence={98} />
          <EditableField label="Last Name" value="Doe" confidence={95} />
          <EditableField
            label="Date of Birth"
            value="1985-03-15"
            confidence={90}
          />
          <EditableField
            label="Social Security"
            value="***-**-1234"
            confidence={95}
          />
          <EditableField
            label="Phone Number"
            value="(555) 123-4567"
            confidence={75}
            warning="Phone number format should be verified"
          />
          <EditableField
            label="Email Address"
            value="john.doe@email.com"
            confidence={85}
          />
        </div>
      </div>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-blue-800" /> Address Information
        </h3>
        <div className="space-y-3">
          <EditableField
            label="Street Address"
            value="123 Main Street"
            confidence={85}
          />
          <EditableField label="City" value="Springfield" confidence={92} />
          <EditableField label="State" value="IL" confidence={99} />
          <EditableField
            label="ZIP Code"
            value="62701"
            confidence={68}
            warning="ZIP code appears to be standard format"
          />
        </div>
      </div>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg flex items-center">
          <Shield className="mr-2 h-5 w-5 text-blue-800" /> Insurance
          Information
        </h3>
        <div className="space-y-3">
          <EditableField
            label="Insurance Provider"
            value="Blue Cross Blue Shield"
            confidence={92}
          />
          <EditableField
            label="Policy Number"
            value="BC123456789"
            confidence={88}
          />
          <EditableField label="Group Number" value="GRP001" confidence={82} />
        </div>
      </div>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg flex items-center">
          <Phone className="mr-2 h-5 w-5 text-blue-800" /> Emergency Contact
        </h3>
        <div className="space-y-3">
          <EditableField
            label="Emergency Contact"
            value="Jane Doe"
            confidence={78}
          />
          <EditableField
            label="Emergency Phone"
            value="(555) 987-6543"
            confidence={72}
          />
        </div>
      </div>
    </div>
  </div>
);

export default function OCRWorkflow() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"upload" | "processing" | "validation">(
    "upload"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("processing");
      setTimeout(() => setStatus("validation"), 4000);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("processing");
      setTimeout(() => setStatus("validation"), 4000);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getCurrentStep = () => {
    switch (status) {
      case "upload":
        return 1;
      case "processing":
        return 2;
      case "validation":
        return 3;
      default:
        return 1;
    }
  };

  return (
    <MainLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            OCR Document Processing
          </h1>
          <p className="text-sm text-gray-500 mt-1">Powered By AI</p>
        </div>

        {/* Stepper */}
        <div className="mb-10 bg-white rounded-lg shadow-sm p-6">
          <Stepper currentStep={getCurrentStep()} />
        </div>

        {/* Upload Screen */}
        {status === "upload" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Upload Header */}
            <div className="text-center mb-6">
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                Upload Patient Document
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload a scanned patient face sheet, insurance card, or intake
                form for automatic data extraction.
              </p>
            </div>

            {/* Upload Drop Zone */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-800 transition"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <label
                htmlFor="file-upload"
                className="font-semibold text-blue-800 cursor-pointer hover:underline"
              >
                Choose file or drag and drop
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Supports: JPG, PNG, PDF (Max 10MB)
              </p>
            </div>

            {/* Supported Docs inside same card */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800">
                Supported Document Types:
              </h3>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                <li>Patient face sheets and intake forms</li>
                <li>Insurance cards (front and back)</li>
                <li>Medical history forms</li>
                <li>Registration documents</li>
              </ul>
            </div>
          </div>
        )}

        {/* Processing */}
        {status === "processing" && file && (
          <ProcessingScreen
            fileName={file.name}
            fileSize={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
          />
        )}

        {/* Validation */}
        {status === "validation" && <ValidationForm />}
      </div>
    </MainLayout>
  );
}
