"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/auth";
import { Codepen, Eye, EyeOff, Lock, Mail, User, ArrowRight, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Password requirements check
  const passwordRequirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (!passwordRequirements.length) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!passwordRequirements.uppercase) {
      setError("Password must contain at least one uppercase letter");
      setIsLoading(false);
      return;
    }

    if (!passwordRequirements.lowercase) {
      setError("Password must contain at least one lowercase letter");
      setIsLoading(false);
      return;
    }

    if (!passwordRequirements.number) {
      setError("Password must contain at least one number");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, name);
      router.push("/login?message=Registration successful");
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors -ml-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-3 rounded-2xl group-hover:scale-105 transition-transform duration-200">
              <Codepen className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Gamanitas
            </span>
          </Link>
          <p className="text-gray-400 text-lg">
            Join our community today
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-white text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-white font-medium text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 pr-4 py-3 h-12 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 pr-4 py-3 h-12 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 pr-12 py-3 h-12 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                    <p className="text-xs font-medium text-gray-400">Password Requirements:</p>
                    <div className="space-y-1">
                      {Object.entries(passwordRequirements).map(([key, met]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          {met ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <X className="w-3 h-3 text-red-400" />
                          )}
                          <span className={met ? "text-green-400" : "text-red-400"}>
                            {key === 'length' && 'At least 6 characters'}
                            {key === 'uppercase' && 'One uppercase letter'}
                            {key === 'lowercase' && 'One lowercase letter'}
                            {key === 'number' && 'One number'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-white font-medium text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pl-10 pr-12 py-3 h-12 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <X className="w-3 h-3" />
                    Passwords do not match
                  </div>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <Check className="w-3 h-3" />
                    Passwords match
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Already a member?</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Sign in to your existing account
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-gray-700 pt-6">
            <div className="text-center w-full text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-gray-400 hover:text-gray-300 underline underline-offset-4">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline underline-offset-4">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2"></div>
            <p className="text-xs">Secure</p>
          </div>
          <div className="text-gray-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mb-2"></div>
            <p className="text-xs">Fast</p>
          </div>
          <div className="text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mb-2"></div>
            <p className="text-xs">Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}