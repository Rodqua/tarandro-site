import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tarandro - Qualité & Formation';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          TARANDRO
        </div>
        <div
          style={{
            fontSize: 40,
            opacity: 0.9,
            textAlign: 'center',
          }}
        >
          Expert en Accompagnement Qualité & Formation Professionnelle
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 40,
            opacity: 0.8,
          }}
        >
          ISO • HAS • PSAD • Bureautique • SST
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
