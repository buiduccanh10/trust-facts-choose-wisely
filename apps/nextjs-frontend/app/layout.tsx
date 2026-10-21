import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RightWISE — Trust Facts, Choose Wisely",
  description:
    "Kiểm tra thông tin sản phẩm, nhãn mác và bằng chứng OCOP từ nguồn chính thức.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=JetBrains+Mono:wght@500;700&display=swap"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
