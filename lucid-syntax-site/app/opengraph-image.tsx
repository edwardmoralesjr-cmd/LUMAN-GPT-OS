import { ImageResponse } from 'next/og';
import { SITE } from '@/content/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#07080A',
          backgroundImage: 'radial-gradient(circle at 30% 20%, #3D0A13 0%, #07080A 55%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#C22A3F',
            marginBottom: 24,
            display: 'flex',
          }}
        >
          Cinematic Metalcore
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            color: '#EDE6D8',
            letterSpacing: -4,
            lineHeight: 0.95,
            display: 'flex',
          }}
        >
          {SITE.name}
        </div>
        <div style={{ fontSize: 30, color: '#C9C1AE', marginTop: 28, display: 'flex' }}>
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
