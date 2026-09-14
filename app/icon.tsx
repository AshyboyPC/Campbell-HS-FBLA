// Never use @iconify/react inside this file.
import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00205B', color: '#FFC72C', fontSize: 18, fontWeight: 700 }}>FBLA</div>
      </div>
    ),
    {
      ...size, 
    }
  );
}
