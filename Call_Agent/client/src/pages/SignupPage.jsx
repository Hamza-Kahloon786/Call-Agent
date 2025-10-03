import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { signUp } from '@/services/authApi';
import { useToast } from '@/components/ui/use-toast';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Pre-fill email if provided in URL (e.g., from payment success)
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, [searchParams]);

  const handleSignup = async () => {
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { data, error } = await signUp(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Account Created Successfully!",
        description: "Please check your email to verify your account, then login.",
      });
      
      // Redirect to login with email pre-filled
      const orderId = searchParams.get('orderId');
      if (orderId) {
        navigate(`/login?email=${encodeURIComponent(email)}&orderId=${orderId}`);
      } else {
        navigate(`/login?email=${encodeURIComponent(email)}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to track your orders</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
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
            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to={`/login${searchParams.get('orderId') ? `?orderId=${searchParams.get('orderId')}` : ''}`}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Already have an account? Sign in
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

export default SignupPage;