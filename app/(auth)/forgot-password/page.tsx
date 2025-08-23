"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: "#E9F0FF" }}
    >
      <div className="w-full max-w-md mx-auto">
        {/* Header Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-2">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Daisy</h1>
          <p className="text-sm text-gray-500">
            Secure Healthcare Management Platform
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="inline-block p-3 bg-orange-100 rounded-full mb-3">
              <Lock className="h-5 w-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Send Reset Instructions
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login">
              <span className="text-sm text-blue-600 hover:underline">
                Back to Sign in
              </span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>© 2025 Daisy. All rights reserved.</p>
          <p>HIPAA Compliant | SOC 2 Certified | ISO 27001</p>
        </div>
      </div>
    </div>
  );
}
