import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eco · ECODIG26A — Asistente del curso',
  description: 'Asistente virtual del curso Ecosistemas Digitales en Entornos de Aprendizaje',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
