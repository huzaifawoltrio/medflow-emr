"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Upload", "Processing", "Validation", "Complete"];

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {steps.map((step, index) => (
        <>
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index + 1 <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-xs font-medium ${
                index + 1 <= currentStep ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index + 1 < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </>
      ))}
    </div>
  );
};

export default function OCRWorkflow() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <MainLayout>
      <div className="p-8 bg-white min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            OCR Document Processing
          </h1>
          <p className="text-sm text-gray-500">Powered By AI</p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <Stepper currentStep={1} />
        </div>

        {/* Upload Section */}
        <div className="text-center mb-8">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Upload Patient Document
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload a scanned patient face sheet, insurance card, or intake form
            for automatic data extraction.
          </p>
        </div>

        {/* Drag and Drop Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="h-8 w-8 text-gray-500 mb-2" />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <label
              htmlFor="file-upload"
              className="font-semibold text-blue-600 cursor-pointer hover:underline"
            >
              Choose file or drag and drop
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Supports: JPG, PNG, PDF (Max 10MB)
            </p>
            {file && (
              <p className="mt-4 text-sm font-medium text-gray-700">
                Selected file: {file.name}
              </p>
            )}
          </div>
        </div>

        {/* Supported Document Types */}
        <div className="mt-8">
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
    </MainLayout>
  );
}
