import React from 'react';
import manifest from '../../data/imageManifest.json';

export type ImageKey = keyof typeof manifest;

interface ResponsivePictureProps {
  image: ImageKey;
  sizes: string;
  /** Above-the-fold image: fetched with high priority and never lazy. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  imgRef?: React.Ref<HTMLImageElement>;
}

// React 18 only knows the camelCase `fetchPriority` prop and warns about the real
// attribute name, so the high-priority hint is passed as a plain lowercase attribute.
const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;

export const ResponsivePicture: React.FC<ResponsivePictureProps> = ({
  image,
  sizes,
  priority = false,
  className,
  imgClassName,
  alt,
  onLoad,
  onError,
  imgRef,
}) => {
  const entry = manifest[image];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={entry.avif} sizes={sizes} />
      <source type="image/webp" srcSet={entry.webp} sizes={sizes} />
      <img
        ref={imgRef}
        src={entry.fallback}
        srcSet={entry.jpg}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt ?? entry.alt}
        className={imgClassName}
        decoding={priority ? undefined : 'async'}
        loading={priority ? undefined : 'lazy'}
        onLoad={onLoad}
        onError={onError}
        {...(priority ? HIGH_PRIORITY : {})}
      />
    </picture>
  );
};
