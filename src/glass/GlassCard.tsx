import React from 'react';
import { GlassSurface, useGlassTone, type GlassSurfaceProps } from './GlassSurface';

type GlassCardProps = Omit<GlassSurfaceProps, 'tone' | 'elevation' | 'interactive'> & { tone?: GlassSurfaceProps['tone'] };

/** Venue and hall cards: a raised, interactive glass surface. Tone follows the surrounding section. */
export const GlassCard: React.FC<GlassCardProps> = ({ tone, ...rest }) => {
  const inherited = useGlassTone();
  return <GlassSurface {...rest} tone={tone ?? inherited} elevation="raised" interactive />;
};
