import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useGlassCapabilities } from './useGlassCapabilities';
import { pointerLightAllowed, usePointerLight } from './usePointerLight';
import { registerLens } from './lensRegistry';

export type GlassTone = 'light' | 'dark';

/** Sections can set the default tone for cards placed inside them. */
export const GlassToneContext = createContext<GlassTone>('light');
export const useGlassTone = (): GlassTone => useContext(GlassToneContext);

export type GlassSurfaceProps = {
  as?: keyof JSX.IntrinsicElements;
  tone: GlassTone;
  elevation?: 'flat' | 'raised';
  interactive?: boolean;
  /** Registers this surface as a refraction lens for the hero renderer. */
  lens?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  as = 'div',
  tone,
  elevation = 'flat',
  interactive = false,
  lens = false,
  className,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const { tier } = useGlassCapabilities();

  usePointerLight(ref, interactive && pointerLightAllowed(tier));

  useEffect(() => {
    if (!lens || !ref.current) return;
    return registerLens(ref.current);
  }, [lens]);

  return React.createElement(
    as,
    {
      ...rest,
      ref,
      className: ['glass-surface', className].filter(Boolean).join(' '),
      'data-tone': tone,
      'data-elevation': elevation,
      'data-interactive': interactive ? '' : undefined,
      'data-glass-lens': lens ? '' : undefined,
    },
    children,
  );
};
