"use client";

import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../../../../features/auth/authApi';
import { saveToken } from '../../../../utils/storage';

interface ApiError {
  data?: {
    message?: string;
  };
}

interface LoginResponse {
  message?: string;
  data?: {
    accessToken: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  });
  const router = useRouter();



  const [Login, { isLoading }] = useLoginMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };

    // Validation
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      try {
        const credentials: LoginCredentials = {
          email: email,
          password: password
        };

        const response = await Login(credentials).unwrap() as LoginResponse;

        // Save token to storage
        if (response.data) {
          saveToken(response?.data?.accessToken);
          const decoded = jwtDecode<{ id: string }>(response?.data?.accessToken);
          localStorage.setItem("HeroItemsAdminId", decoded?.id);
          toast.success(response.message || 'Login successful!');
          await new Promise(resolve => setTimeout(resolve, 800));
          router.push('/');
        } else {
          toast.error('No access token received');
        }
      } catch (error) {
        const apiError = error as ApiError;
        toast.error(apiError?.data?.message || 'Login failed! Please check your credentials.');
      }
    }
  };

  // Check if form is valid
  const isFormValid = email.length > 0 &&
    password.length > 0 &&
    !errors.email &&
    !errors.password;

  return (
    <div className="relative min-h-screen bg-linear-to-r from-[#101922] via-[#15202B] to-[#101922] overflow-hidden">
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
          {/* Card Container with Glass Morphism Effect */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-linear-to-r from-[#1C2936]/90 to-[#1C2936]/70 border border-white/10 shadow-2xl">
            {/* Accent Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500"></div>

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
                      className="relative w-32 h-auto rounded-full p-2 bg-linear-to-r from-white/10 to-transparent border border-white/10"
                    />
                  </div> */}

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Welcome Back
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Sign in to continue
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Mail size={16} className="text-blue-400" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300 ${isFocused.email ? 'opacity-30' : ''}`}></div>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        onFocus={() => setIsFocused({ ...isFocused, email: true })}
                        onBlur={() => setIsFocused({ ...isFocused, email: false })}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 pl-11 bg-[#101922]/50 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500`}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 animate-pulse">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Lock size={16} className="text-blue-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300 ${isFocused.password ? 'optaity-30' : ''}`}></div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: '' });
                        }}
                        onFocus={() => setIsFocused({ ...isFocused, password: true })}
                        onBlur={() => setIsFocused({ ...isFocused, password: false })}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 pl-11 pr-11 bg-[#101922]/50 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500`}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 animate-pulse">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-end">

                  <div>

                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                  <button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative w-full bg-linear-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>






            </div>
          </div>


        </div>
      </div>

      {/* Add custom styles for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}