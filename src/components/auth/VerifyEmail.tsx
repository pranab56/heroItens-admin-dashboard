"use client";

import { CheckCircle, Key, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6 digits
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResendHovered, setIsResendHovered] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60); // 60 seconds countdown
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const forgetToken = searchParams.get("forgetToken") || 'demo-token-12345';

  // Fixed ref callback
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error('Only numbers are allowed');
      return;
    }

    const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');

    // Validation for 6 digits
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!forgetToken) {
      setError('Invalid token. Please try again.');
      toast.error('Invalid token. Please try again.');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);

      console.log("===============================");
      console.log("OTP Verification Details:");
      console.log("===============================");
      console.log("OTP Entered:", otpValue);
      console.log("Forget Token:", forgetToken);
      console.log("Timestamp:", new Date().toLocaleString());
      console.log("Device Info:", {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });
      console.log("===============================");

      toast.success('OTP verified successfully!');

      // Simulate successful verification
      const mockResponse = {
        data: {
          forgetOtpMatchToken: 'demo-otp-match-token-67890'
        },
        message: 'OTP verified successfully!'
      };

      console.log("Mock API Response:", mockResponse);

      // Redirect to reset password page
      router.push(`/auth/reset-password?forgetOtpMatchToken=${mockResponse.data.forgetOtpMatchToken}`);
    }, 1500);
  };

  // Handle resend
  const handleResend = async (): Promise<void> => {
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before resending`);
      return;
    }

    setResendLoading(true);

    console.log("===============================");
    console.log("Resend OTP Request:");
    console.log("===============================");
    console.log("Forget Token:", forgetToken);
    console.log("Resend Time:", new Date().toLocaleString());
    console.log("===============================");

    // Simulate API call delay
    setTimeout(() => {
      setResendLoading(false);
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setError('');

      console.log("OTP Resent Successfully!");
      console.log("New OTP would be sent to registered email");

      toast.success('OTP resent successfully!');

      // Focus first input
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  return (
    <div className="relative bg-linear-to-br from-[#101922] via-[#15202B] to-[#101922] overflow-hidden">
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
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-linear-to-br from-[#1C2936]/90 to-[#1C2936]/70 border border-white/10 shadow-2xl">
            {/* Accent Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-br from-cyan-400 via-blue-500 to-purple-500"></div>

            {/* Card Content */}
            <div className="p-8">
              {/* Logo and Header Section */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center justify-center gap-4">


                  {/* Security Icon Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping opacity-20"></div>
                    <Key className="relative text-blue-400" size={48} />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Verify Identity
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Display */}


              {/* OTP Form */}
              <form onSubmit={handleSubmit} className="space-y-6 ">
                {/* OTP Input Fields */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-center text-gray-300">
                    6-digit verification code
                  </label>

                  <div className="flex justify-center gap-3 w-full">
                    {otp.map((digit, index) => (
                      <div key={index} className="relative group">
                        <div className={`absolute -inset-1  bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300 ${digit ? 'opacity-10' : ''}`}></div>
                        <input
                          ref={setInputRef(index)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className={`relative w-14 h-14 text-center text-3xl font-bold bg-[#101922]/50 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white`}
                        />
                        {digit && (
                          <div className="absolute inset-0 border-2 border-blue-400/30 rounded-xl pointer-events-none"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p className="text-center text-sm text-red-400 animate-pulse">{error}</p>
                  )}

                  <p className="text-center text-xs text-gray-500 mt-2">
                    Click on each box or paste the entire code
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">
                      Code expires in: <span className="font-mono text-blue-300">{countdown}s</span>
                    </span>
                  </div>
                </div>

                {/* Verify Button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                        <span>Verify & Continue</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Resend Section */}
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || countdown > 0}
                    onMouseEnter={() => setIsResendHovered(true)}
                    onMouseLeave={() => setIsResendHovered(false)}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <RotateCcw size={16} className={`transition-transform duration-300 ${isResendHovered ? 'rotate-180' : ''} ${resendLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </span>
                  </button>
                </div>

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