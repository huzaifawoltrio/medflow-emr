"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Shield, Info } from "lucide-react"

export default function SecurityVerification() {
  const [code, setCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle verification logic
    console.log("Verification code:", code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🩺</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MedFlow EMR</h1>
            <p className="text-gray-600">Secure Healthcare Management Platform</p>
          </div>
        </div>

        {/* Verification Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Security Verification</h2>
            <p className="text-gray-600 text-sm">We've sent a verification code to your registered device</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center">Enter the 6-digit code from your authenticator app</p>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Verify & Continue
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-blue-600 hover:text-blue-700">
                Resend Code
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  Two-factor authentication is required for HIPAA compliance and enhanced security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>© 2024 MedFlow EMR. All rights reserved.</p>
          <p>HIPAA Compliant | SOC 2 Certified | ISO 27001</p>
        </div>
      </div>
    </div>
  )
}
