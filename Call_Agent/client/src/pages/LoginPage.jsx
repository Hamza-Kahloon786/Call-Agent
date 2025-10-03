import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { signIn } from '@/services/authApi';
import { useToast } from '@/components/ui/use-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for payment success in URL
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('orderId');
    const emailFromUrl = searchParams.get('email');

    if (paymentStatus === 'success' && orderId) {
      toast({
        title: "Payment Successful! 🎉",
        description: "Please login to view your order status and download reports.",
        duration: 8000,
      });
      
      // Pre-fill email if provided
      if (emailFromUrl) {
        setEmail(decodeURIComponent(emailFromUrl));
      }
    }
  }, [searchParams, toast]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      // Check if it's an email verification error
      if (error.message.includes('Email not confirmed') || error.message.includes('verify')) {
        setError('Please verify your email first. Check your inbox for the verification link.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you just signed up, please verify your email first.');
      } else {
        setError(error.message);
      }
    } else {
      const orderId = searchParams.get('orderId');
      
      toast({
        title: "Login Successful! 🎉",
        description: orderId ? "Redirecting to your order dashboard..." : "Welcome back!",
      });
      
      // Always go to dashboard (not order-status)
      navigate('/dashboard');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to view your order status</p>
        </div>

        {searchParams.get('payment') === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <p className="font-semibold text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-700 mt-1">
                  Your order has been placed. Login to track your order status and download call reports.
                </p>
              </div>
            </div>
            <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
              <Mail className="inline mr-1" size={14} />
              If you just signed up, please check your email and verify your account before logging in.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Login Failed</p>
              <p className="mt-1">{error}</p>
              {error.includes('verify') && (
                <p className="mt-2 text-xs">
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link to="/signup" className="underline font-semibold">
                    sign up again
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to={`/signup${searchParams.get('orderId') ? `?orderId=${searchParams.get('orderId')}&email=${searchParams.get('email')}` : ''}`}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Don't have an account? Sign up
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-600 text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;