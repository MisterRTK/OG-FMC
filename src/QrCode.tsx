import React from "react";
export default function QRCode({ value, size = 200 }: { value: string; size?: number }) {
  return (
    <img
      src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(value)}&chs=${size}x${size}&chld=L|0`}
      alt="QR Code"
      width={size}
      height={size}
      style={{ background: "white", borderRadius: 8 }}
      draggable={false}
    />
  );
}