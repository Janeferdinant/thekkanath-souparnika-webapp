import React from 'react';
import { GlassSurface, type GlassSurfaceProps } from './GlassSurface';

type GlassHeroPanelProps = Omit<GlassSurfaceProps, 'tone' | 'elevation' | 'lens'>;

/** The info panel that sits over the hero photo. A lens, so the photo bends through it. */
export const GlassHeroPanel: React.FC<GlassHeroPanelProps> = (props) => (
  <GlassSurface {...props} tone="dark" elevation="raised" lens />
);
