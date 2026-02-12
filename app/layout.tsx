import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eco – Asistente del curso Ecosistemas Digitales',
  description: 'Chatbot tutor del curso Ecosistemas Digitales en Entornos de Aprendizaje - Virtual Educa 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
