import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handlePasskeyAuth = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (isLogin) {
        await login();
      } else {
        if (!email) {
          setError('Email is required for registration');
          return;
        }
        await register(email);
      }
      
      // Başarılı login sonrası ana sayfaya yönlendir
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Join EventX'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Sign in with your passkey to continue' 
                : 'Create your account with passkey authentication'
              }
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {!isLogin && (
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
              />
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handlePasskeyAuth}
              loading={isLoading}
              icon={Key}
              className="w-full"
              size="lg"
            >
              {isLogin ? 'Sign in with Passkey' : 'Create Account with Passkey'}
            </Button>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setEmail('');
                }}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center space-y-2">
              <p>
                Passkeys provide secure, passwordless authentication using your device's biometric or PIN.
              </p>
              <p>
                <strong>Demo Mode:</strong> Authentication is simulated for hackathon purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};