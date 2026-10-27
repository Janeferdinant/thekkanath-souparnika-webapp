import { useContext } from 'react';
import { GlassContext, type GlassCapabilities } from './GlassPerformanceManager';

export const useGlassCapabilities = (): GlassCapabilities => useContext(GlassContext);
