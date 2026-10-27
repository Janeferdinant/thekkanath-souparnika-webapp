import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

/**
 * Shown when a page fails to load or render (most often a chunk that could not be fetched on a flaky
 * connection). Replaces React Router's default developer error screen with something a visitor can act on.
 */
export const RouteError: React.FC<{ fullPage?: boolean }> = ({ fullPage = false }) => {
  const error = useRouteError();
  console.error('Route error:', error);

  return (
    <div className={`${fullPage ? 'surface-burgundy min-h-screen' : 'surface-ivory min-h-[60vh]'} flex items-center justify-center px-4 py-16`}>
      <div className="max-w-md text-center space-y-4">
        <h1 className={`font-serif text-3xl font-light ${fullPage ? 'text-brand-ivory-100' : 'text-brand-charcoal-900'}`}>
          This page didn’t load
        </h1>
        <p className={`text-sm leading-relaxed ${fullPage ? 'text-brand-ivory-muted' : 'text-brand-charcoal-600'}`}>
          Your connection may have dropped for a moment. Reload to try again, or go back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full text-xs font-semibold text-brand-burgundy-900 bg-gradient-to-r from-brand-champagne-300 via-brand-champagne-400 to-brand-champagne-500 border border-brand-champagne-400 shadow-md"
          >
            Reload the page
          </button>
          <Link
            to="/"
            className={`inline-flex items-center justify-center min-h-[44px] px-6 rounded-full text-xs font-semibold border ${
              fullPage
                ? 'text-brand-ivory-100 border-brand-champagne-500 hover:bg-white/10'
                : 'text-brand-burgundy-700 border-brand-burgundy-700 hover:bg-brand-burgundy-700 hover:text-brand-ivory-100'
            }`}
          >
            Go to the home page
          </Link>
        </div>
      </div>
    </div>
  );
};
