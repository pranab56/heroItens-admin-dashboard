"use client";

import { ArrowLeft, Check, Eye, EyeOff, Key, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState<boolean>(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const forgetToken = searchParams.get("forgetOtpMatchToken") || 'demo-reset-token-12345';

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors = { newPassword: '', confirmPassword: '' };

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    // If no errors, proceed with password reset
    if (!newErrors.newPassword && !newErrors.confirmPassword) {
      if (!forgetToken) {
        toast.error('Invalid or missing token. Please try again.');
        return;
      }

      setIsLoading(true);

      const resetData: ResetPasswordData = {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        token: forgetToken
      };

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        console.log("===============================");
        console.log("Reset Password Details:");
        console.log("===============================");
        console.log("Reset Data:", resetData);
        console.log("Timestamp:", new Date().toLocaleString());
        console.log("Password Strength:", calculatePasswordStrength(newPassword));
        console.log("===============================");

        toast.success('Password reset successful!');

        // Clear form fields
        setNewPassword('');
        setConfirmPassword('');

        // Show success animation
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }, 1500);
    }
  };

  const calculatePasswordStrength = (password: string): string => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score === 5) return 'Very Strong';
    if (score >= 3) return 'Strong';
    if (score >= 2) return 'Medium';
    return 'Weak';
  };

  // Check if form is valid for button state
  const isFormValid = newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    !errors.newPassword &&
    !errors.confirmPassword;

  return (
    <div className="relative  bg-linear-to-br from-[#101922] via-[#15202B] to-[#101922] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1C2936]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1C2936]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-r from-[#1C2936]/30 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#1C2936_1px,transparent_1px),linear-gradient(180deg,#1C2936_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.03]"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>

          {/* Card Container with Glass Morphism Effect */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-linear-to-br from-[#1C2936]/90 to-[#1C2936]/70 border border-white/10 shadow-2xl">
            {/* Accent Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-br from-green-400 via-blue-500 to-purple-500"></div>

            {/* Card Content */}
            <div className="p-8">
              {/* Logo and Header Section */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Logo with Glow Effect */}


                  {/* Security Icon Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping opacity-20"></div>
                    <Key className="relative text-green-400" size={48} />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-linear-to-br from-white to-gray-300 bg-clip-text text-transparent">
                      New Password
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Create a strong password to secure your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Lock size={16} className="text-blue-400" />
                    New Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-linear-to-br from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300 ${isNewPasswordFocused ? 'opacity-30' : ''}`}></div>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                        }}
                        onFocus={() => setIsNewPasswordFocused(true)}
                        onBlur={() => setIsNewPasswordFocused(false)}
                        placeholder="Enter strong password..."
                        className="w-full px-4 py-3 pl-11 bg-[#101922]/50 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-400 animate-pulse">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Shield size={16} className="text-blue-400" />
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-linear-to-br from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300 ${isConfirmPasswordFocused ? 'opacity-30' : ''}`}></div>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                        }}
                        onFocus={() => setIsConfirmPasswordFocused(true)}
                        onBlur={() => setIsConfirmPasswordFocused(false)}
                        placeholder="Re-enter your password..."
                        className="w-full px-4 py-3 pl-11 bg-[#101922]/50 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500"
                      />
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 animate-pulse">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="p-4 bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-300">Password Strength</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${calculatePasswordStrength(newPassword) === 'Very Strong' ? 'bg-green-500/20 text-green-300' :
                        calculatePasswordStrength(newPassword) === 'Strong' ? 'bg-blue-500/20 text-blue-300' :
                          calculatePasswordStrength(newPassword) === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                        }`}>
                        {calculatePasswordStrength(newPassword)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${calculatePasswordStrength(newPassword) === 'Very Strong' ? 'w-full bg-linear-to-br from-green-400 to-emerald-400' :
                          calculatePasswordStrength(newPassword) === 'Strong' ? 'w-3/4 bg-linear-to-br from-blue-400 to-cyan-400' :
                            calculatePasswordStrength(newPassword) === 'Medium' ? 'w-1/2 bg-linear-to-br from-yellow-400 to-orange-400' :
                              'w-1/4 bg-linear-to-br from-red-400 to-pink-400'
                          }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-300">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { condition: newPassword.length >= 8, text: '8+ characters' },
                      { condition: /[a-z]/.test(newPassword), text: 'Lowercase letter' },
                      { condition: /[A-Z]/.test(newPassword), text: 'Uppercase letter' },
                      { condition: /\d/.test(newPassword), text: 'Number' },
                      { condition: /[@$!%*?&]/.test(newPassword), text: 'Special character' },
                      { condition: newPassword === confirmPassword && confirmPassword.length > 0, text: 'Passwords match' }
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.condition ? 'bg-green-500/20' : 'bg-white/5'
                          }`}>
                          {req.condition ? (
                            <Check size={12} className="text-green-400" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <span className={`text-xs ${req.condition ? 'text-green-300' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Password Button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative w-full bg-linear-to-r from-green-600 to-blue-500 hover:from-green-500 hover:to-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-green-500/25 flex cursor-pointer items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key size={20} className={`transition-transform duration-300 ${isHovered ? 'rotate-90' : ''}`} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message Placeholder */}
                {isLoading && (
                  <div className="p-4 bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <p className="text-sm text-green-300 font-medium">Securing your account...</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Updating password and encrypting your data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>


            </div>
          </div>


        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}