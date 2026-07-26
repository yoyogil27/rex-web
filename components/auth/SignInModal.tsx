// components/auth/SignInModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function SignInModal({ isOpen, onClose, onSuccess }: Props) {
  const { signIn, signUp, isLoading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        const data = isPhone 
          ? { name, phone: identifier, password }
          : { name, email: identifier, password };
        await signUp(data);
      } else {
        if (isPhone && !otpSent) {
          // Send OTP
          await signIn({ identifier });
          setOtpSent(true);
          return;
        }
        
        if (isPhone && otpSent) {
          // Verify OTP
          await signIn({ identifier, otp });
        } else {
          // Email sign in
          await signIn({ identifier, password });
        }
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIdentifier('');
    setName('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
  };

  const togglePhone = () => {
    setIsPhone(!isPhone);
    setIdentifier('');
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white">
            REX
            <span className="text-gold text-sm font-light tracking-wider block">Return on Experience</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isSignUp ? 'Create your account' : 'Sign in to save experiences'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* OTP Status */}
        {otpSent && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-3 rounded-xl mb-4">
            OTP sent to {identifier}. Please check your phone.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Only for sign up */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                placeholder="John Doe"
                required={isSignUp}
              />
            </div>
          )}

          {/* Email/Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {isPhone ? 'Phone Number' : 'Email Address'}
            </label>
            <input
              type={isPhone ? 'tel' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
              placeholder={isPhone ? '+250 788 000 000' : 'you@example.com'}
              required
            />
          </div>

          {/* Password - Only for email sign in or sign up with email */}
          {(!isPhone || !otpSent) && !(isSignUp && isPhone) && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                placeholder="••••••••"
                required={!isPhone || !otpSent}
              />
            </div>
          )}

          {/* OTP - For phone sign in */}
          {isPhone && otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
                placeholder="123456"
                required
              />
            </div>
          )}

          {/* Phone toggle */}
          <button
            type="button"
            onClick={togglePhone}
            className="text-sm text-gold hover:text-gold/80 transition"
          >
            {isPhone ? 'Use email instead' : 'Use phone instead'}
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gold text-black font-bold rounded-xl hover:bg-gold/80 transition disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 
             isSignUp ? 'Create Account' : 
             (isPhone && !otpSent) ? 'Send OTP' :
             'Sign In'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="text-center mt-6">
          <button
            onClick={toggleMode}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Guest option */}
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-300 transition"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}