import React, { useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    let message = "An unexpected error occurred.";
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.error.includes("insufficient permissions")) {
        message = "Security Violation: You do not have permission to perform this action.";
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="min-h-screen bg-[#0c0c0d] flex items-center justify-center p-6">
        <div className="bg-[#1c1c21] border border-red-500/30 p-8 rounded-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">System Error</h2>
          <p className="text-[#9ca3af] mb-6">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#9333ea] text-white font-bold rounded hover:bg-opacity-90 transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
