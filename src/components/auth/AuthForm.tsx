"use client";

import React, { useState } from 'react';
import { signInUser, signUpUser } from '@/lib/authService';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // --- Logic Sign Up ---
        if (!fullName) {
          setError("Full name is required.");
          setLoading(false);
          return;
        }
        await signUpUser({ email, password, fullName });
        setMessage("Sign up successful! Please check your email to confirm.");
        
      } else {
        // --- Logic Sign In ---
        await signInUser({ email, password });
        setMessage("Sign in successful! Redirecting...");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-neutral-90">
        {isSignUp ? 'Create an Account' : 'Sign In'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}
        
        <div>
          <Button
            type="submit"
            variant="primary"
            width="full"
            size="large"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </div>
      </form>
      
      <div className="text-sm text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setMessage(null);
          }}
          className="font-medium text-primary-main hover:underline"
        >
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

