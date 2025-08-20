"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CreditCard, ClipboardList, UserCheck, CheckCircle } from "lucide-react"

const steps = [
  { id: 1, name: "Upload", icon: Upload, active: true },
  { id: 2, name: "Processing", icon: FileText, active: false },
  { id: 3, name: "Validation", icon: CheckCircle, active: false },
  { id: 4, name: "Complete", icon: CheckCircle, active: false },
]

const supportedDocuments = [
  {
    icon: UserCheck,
    title: "Patient face sheets and intake forms",
    description: "Automatically extract patient demographics and contact information",
  },
  {
    icon: CreditCard,
    title: "Insurance cards (front and back)",
    description: "Extract insurance details, policy numbers, and coverage information",
  },
  {
    icon: ClipboardList,
    title: "Medical history forms",
    description: "Process medical history, medications, and allergy information",
  },
  {
    icon: FileText,
    title: "Registration documents",
    description: "Extract data from patient registration and consent forms",
  },
]

export default function OCRWorkflow() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">OCR Document Processing</h1>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Powered by AI
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8 py-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center space-x-2 ${step.active ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.id}
              </div>
              <span className="font-medium">{step.name}</span>
            </div>
            {index < steps.length - 1 && <div className="w-16 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-12">
          <div
            className={`text-center space-y-4 ${dragActive ? "scale-105" : ""} transition-transform`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Upload Patient Document</h3>
              <p className="text-gray-600">
                Upload a scanned patient face sheet, insurance card, or intake form for automatic data extraction.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50">
                <div className="text-center space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-600">Choose file or drag and drop</p>
                  <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Document Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Supported Document Types:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportedDocuments.map((doc, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <doc.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Files:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <Badge variant="secondary">Ready to process</Badge>
              </div>
            ))}
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Processing</Button>
        </div>
      )}
    </div>
  )
}
