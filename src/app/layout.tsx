import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — Spa chăm sóc da Quận 3 & Phú Nhuận`,
  description:
    "Yên Spa & Beaute: chăm sóc da mặt chuyên sâu, điều trị mụn, thâm, nám, phục hồi và trẻ hóa da tại Quận 3 và Phú Nhuận, TP.HCM. Mở cửa 09:00–21:00 mỗi ngày.",
};

export const viewport: Viewport = {
  themeColor: "#36422c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${body.variable} ${display.variable} antialiased`}>
      <head>
        {/* Đánh dấu có JS sớm để CSS ẩn trước các phần tử chờ animation (tránh nháy nội dung) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh font-sans">
        {children}
      </body>
    </html>
  );
}
