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
  Mail,
  Lock,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Redux imports (using relative paths to fix module resolution)
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/auth/authActions";
import { AppDispatch, RootState } from "../../redux/store";

export default function Login() {
  // Component state
  const [username, setUsername] = useState("janedoe6");
  const [password, setPassword] = useState("U-Xky})XS1kr");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dispatch the login action with username and password
      await dispatch(loginUser({ username, password })).unwrap();
      // The useEffect below will handle the redirection
    } catch (err) {
      // unwrap() will throw an error on rejection, which we can catch here
      // The error message is already set in the Redux state, so we don't need to do much here.
      console.error("Login failed:", err);
    }
  };

  // Effect to redirect user on successful login
  useEffect(() => {
    if (user) {
      // Redirect based on user role after a successful login
      switch (user.role) {
        case "doctor":
          router.push("/");
          break;
        case "patient":
          router.push("/");
          break;
        case "superadmin":
          router.push("/");
          break;
        default:
          router.push("/dashboard"); // Fallback dashboard
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🩺</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daisy EMR</h1>
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="janedoe6"
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
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Display login error message from Redux state */}
              {error && (
                <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In →"
                )}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <Link
                href="/auth/register"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
          <p>© 2024 Daisy EMR. All rights reserved.</p>
          <p>HIPAA Compliant | SOC 2 Certified | ISO 27001</p>
        </div>
      </div>
    </div>
  );
}
