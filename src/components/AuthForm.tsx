import { useState } from 'react';
import { signInWithGoogle } from '../api/auth';

export default function AuthForm() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) alert(error.message);
  };

  return (
    <div className="max-w-sm mx-auto p-8 bg-white rounded shadow space-y-6 mt-20">
      <h2 className="text-2xl font-bold text-center">Sign In / Sign Up</h2>
      <button
        type="button"
        className="w-full bg-red-600 text-white p-3 rounded text-lg font-semibold"
        onClick={handleGoogle}
        disabled={loading}
      >
        {loading ? 'Redirecting...' : 'Sign in with Google'}
      </button>
      {/* You can add email/password fields here if needed */}
    </div>
  );
}