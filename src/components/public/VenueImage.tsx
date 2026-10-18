import type { ImgHTMLAttributes } from 'react';
import { VenuePhoto } from '../../data/venueMedia';

type VenueImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  photo: VenuePhoto;
  small?: boolean;
};

export function VenueImage({ photo, small = false, loading = 'lazy', ...props }: VenueImageProps) {
  const file = `venue-${photo.id}`;
  return (
    <picture>
      <source srcSet={`/assets/venue/optimized/${file}${small ? '-small' : ''}.webp`} type="image/webp" />
      <img
        src={`/assets/venue/${file}.jpg`}
        alt={photo.alt}
        width={photo.id === '006' ? 600 : 1364}
        height={photo.id === '006' ? 800 : 680}
        loading={loading}
        decoding="async"
        {...props}
      />
    </picture>
  );
}
