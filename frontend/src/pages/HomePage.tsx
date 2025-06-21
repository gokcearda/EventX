import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure NFT Tickets',
      description: 'Each ticket is a unique NFT on Stellar blockchain, preventing fraud and counterfeiting.'
    },
    {
      icon: Zap,
      title: 'Gasless Transactions',
      description: 'Powered by Launchtube relayer for seamless, zero-gas fee ticket purchases.'
    },
    {
      icon: Globe,
      title: 'Passkey Authentication',
      description: 'Modern, passwordless login using biometric authentication for enhanced security.'
    },
    {
      icon: Ticket,
      title: 'Easy Resale',
      description: 'Securely transfer or resell your tickets with built-in marketplace functionality.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">
            The Future of Event Ticketing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the next generation of event ticketing with NFT-powered tickets on Stellar blockchain. 
            Secure, transparent, and fraud-proof.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/events">
                  <Button size="lg" icon={Ticket}>
                    Browse Events
                  </Button>
                </Link>
                <Link to="/my-tickets">
                  <Button variant="outline" size="lg">
                    My Tickets
                  </Button>
                </Link>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-6">
                <p className="text-purple-800 font-medium mb-4">
                  Get started with secure passkey authentication
                </p>
                <Button size="lg" icon={ArrowRight} onClick={handleSignIn}>
                  Sign In to Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose EventX?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built on cutting-edge blockchain technology with user experience at the forefront
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} hover>
              <CardContent>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};