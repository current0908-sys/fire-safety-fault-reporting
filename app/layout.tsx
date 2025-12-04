import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '機電消防故障回報系統',
  description: '機電消防設備故障回報與管理系統',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}





