'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function TestEmail() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { user } = useAuth();

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          name: user?.name,
        }),
      });
      const data = await response.json();
      setResult(data.message);
    } catch (error) {
      setResult('Error sending email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Test Email System</h1>
        <button
          onClick={testEmail}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
        {result && <p className="mt-4">{result}</p>}
      </div>
    </div>
  );
}