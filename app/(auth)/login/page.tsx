"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Shield,
  Loader2,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { loginUser } from "@/app/redux/features/auth/authActions";

export default function Login() {
  const [username, setUsername] = useState("janedoe6");
  const [password, setPassword] = useState("*r{6q>d2SC|^");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  // 1. Get the user object from the Redux store
  const { loading, error, success, user } = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  const handlePatientLogin = () => {
    dispatch(loginUser({ username: "johnsmith", password: "tS~&<+U0w9V{" }));
  };

  // 2. Update the useEffect to handle role-based redirection
  useEffect(() => {
    if (success && user) {
      router.push("/");
    }
  }, [success, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daisy</h1>
            <p className="text-gray-600">
              Secure Healthcare Management Platform
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to your secure medical account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-800 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In →"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePatientLogin}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Temp Patient Login"
                )}
              </Button>
            </form>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-800 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium">HIPAA Compliant Security</p>
                  <p>
                    Your medical data is protected with enterprise-grade
                    encryption and security protocols.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>© 2025 Daisy. All rights reserved.</p>
          <p>HIPAA Compliant | SOC 2 Certified | ISO 27001</p>
        </div>
      </div>
    </div>
  );
}
