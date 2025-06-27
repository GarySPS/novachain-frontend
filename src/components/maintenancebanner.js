import React from 'react';

export default function MaintenanceBanner() {
  return (
    <div className="w-full px-4 py-3 bg-theme-yellow-100 text-theme-primary text-center rounded-xl shadow text-base-1s font-semibold mb-4">
      ⚠️ Scheduled auto update daily at 2:00 AM UTC — Trading may be paused temporarily.
    </div>
  );
}
