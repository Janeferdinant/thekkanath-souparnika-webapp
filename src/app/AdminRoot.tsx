import React from 'react';
import { AuthProvider } from '../context/AuthContext';

/** Auth is only needed on /login and /admin, so it is loaded with those routes. */
export const AdminRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);
