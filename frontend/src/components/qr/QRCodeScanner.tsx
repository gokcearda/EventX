import React, { useState, useRef } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onError
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      const errorMessage = 'Camera access denied. Please allow camera permissions.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Simulate QR code scanning for demo purposes
  const simulateScan = () => {
    const mockQRCode = `ticket${Date.now()}-1-${Date.now()}`;
    onScan(mockQRCode);
    stopCamera();
  };

  return (
    <div className="space-y-4">
      {!isScanning ? (
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Scan QR Code
          </h3>
          <p className="text-gray-600 mb-4">
            Position the QR code within the camera frame to check in
          </p>
          <Button onClick={startCamera} icon={Camera}>
            Start Camera
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-purple-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />
                
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-purple-500 animate-pulse" />
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={stopCamera}
                icon={X}
                className="bg-black/50 text-white hover:bg-black/70"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={stopCamera}
            >
              Cancel
            </Button>
            <Button
              onClick={simulateScan}
              icon={RefreshCw}
            >
              Simulate Scan (Demo)
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Position the ticket QR code in the center of the frame
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};