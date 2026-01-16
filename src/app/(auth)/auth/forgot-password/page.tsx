"use client";

import { ArrowLeft, CheckCircle, Mail, Send, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useForgotEmailMutation } from '../../../../features/auth/authApi';

interface ApiError {
  data?: {
    message?: string;
  };
}

interface ForgotEmailResponse {
  message?: string;
  data?: {
    forgetToken: string;
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const router = useRouter();
  const [forgotEmail, { isLoading }] = useForgotEmailMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await forgotEmail({ email: email }).unwrap() as ForgotEmailResponse;

      // Show success state
      setIsSuccess(true);

      // Show success toast
      toast.success(response.message || 'OTP sent successfully!');

      // Redirect to OTP verification page with token
      if (response.data?.forgetToken) {
        // Add small delay for better UX
        setTimeout(() => {
          router.push(`/auth/verify-email?forgetToken=${response.data?.forgetToken}`);
        }, 1000);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError?.data?.message || 'Failed to send OTP. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#101922] via-[#15202B] to-[#101922] overflow-hidden">
      {/* Animated Background Elements - লগইন পেজের মতোই */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1C2936]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1C2936]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-br from-[#1C2936]/30 to-transparent rounded-full blur-2xl"></div>
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
            {/* Accent Border Top - লগইন পেজের মতোই */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-br from-cyan-400 via-blue-500 to-purple-500"></div>

            {/* Card Content */}
            <div className="p-8">
              {/* Logo and Header Section */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Logo with Glow Effect */}
                  {/* <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                    <Image
                      src={"/icons/logo2.png"}
                      alt="Logo"
                      height={120}
                      width={120}
                      className="relative w-32 h-auto rounded-full p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10"
                    />
                  </div> */}

                  {/* Security Icon Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-20"></div>
                    <Shield className="relative text-blue-400" size={48} />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-linear-to-br from-white to-gray-300 bg-clip-text text-transparent">
                      Reset Password
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Enter your email to receive a password reset OTP
                    </p>
                  </div>
                </div>
              </div>

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field - লগইন পেজের স্টাইলে */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Mail size={16} className="text-blue-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-linear-to-br from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300 ${isFocused ? 'opacity-30' : ''}`}></div>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                          setIsSuccess(false);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="you@example.com"
                        disabled={isSuccess}
                        className={`w-full px-4 py-3 pl-11 bg-[#101922]/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500 disabled:opacity-70 disabled:cursor-not-allowed`}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-400 animate-pulse">{error}</p>
                  )}
                </div>



                {/* Send OTP Button - লগইন বাটনের স্টাইলে */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-br from-blue-500 via-cyan-400 to-blue-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess || !email}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative w-full bg-linear-to-br from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle size={20} className="animate-bounce" />
                        <span>OTP Sent ✓</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {isSuccess && (
                  <div className="p-4 bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-400" size={20} />
                      <div>
                        <p className="text-sm text-green-300 font-medium">OTP Sent Successfully!</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Redirecting to verification page...
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}