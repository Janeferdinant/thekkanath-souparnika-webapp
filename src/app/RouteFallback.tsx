import React from 'react';

export const RouteFallback: React.FC = () => (
  <div
    role="status"
    className="min-h-[50vh] flex items-center justify-center bg-[#1E0A10] text-[#D9CBBF] text-sm tracking-wide"
  >
    Loading…
  </div>
);
