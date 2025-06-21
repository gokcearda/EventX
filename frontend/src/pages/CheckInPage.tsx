import React, { useState } from 'react';
import { QRCodeScanner } from '../components/qr/QRCodeScanner';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { ticketAPI } from '../services/api';
import { Ticket } from '../types';

export const CheckInPage: React.FC = () => {
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    ticket?: Ticket;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    try {
      const result = await ticketAPI.checkInTicket(qrCode);
      setScanResult(result);
    } catch (error) {
      setScanResult({
        success: false,
        error: error instanceof Error ? error.message : 'Check-in failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Event Check-In
        </h1>
        <p className="text-lg text-gray-600">
          Scan ticket QR codes to check in attendees
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {!scanResult ? (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-center">Scan Ticket QR Code</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Processing ticket...</p>
                </div>
              ) : (
                <QRCodeScanner
                  onScan={handleScan}
                  onError={(error) => setScanResult({ success: false, error })}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                {scanResult.success ? (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">
                      Check-in Successful!
                    </h3>
                    {scanResult.ticket && scanResult.ticket.event && (
                      <div className="bg-green-50 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {scanResult.ticket.event.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {scanResult.ticket.event.venue}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Ticket ID: {scanResult.ticket.id}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-4">
                      Check-in Failed
                    </h3>
                    <div className="bg-red-50 rounded-lg p-6 mb-6">
                      <p className="text-red-700">
                        {scanResult.error || 'Invalid or expired ticket'}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleReset}
                  icon={RefreshCw}
                  size="lg"
                >
                  Scan Another Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};