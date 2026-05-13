import './globals.css';

export const metadata = {
  title: 'TODO',
  description: 'A focused task board for daily todos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
