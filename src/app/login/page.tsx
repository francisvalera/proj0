"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isLoading}>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100" />
            </div>
          </fieldset>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full h-10 flex items-center justify-center py-2 text-white bg-black rounded-md disabled:bg-gray-500">
            {isLoading ? <LoadingSpinner /> : 'Login'}
          </button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>
        <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full py-2 border flex justify-center items-center rounded-md disabled:opacity-50">
          Sign in with Google
        </button>
        <p className="text-sm text-center">
          Don&apos;t have an account? <Link href="/register" className="text-red-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
