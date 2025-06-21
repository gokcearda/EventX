import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  level = 'M'
}) => {
  return (
    <div className="flex justify-center p-4 bg-white rounded-lg">
      <QRCode
        value={value}
        size={size}
        level={level}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};