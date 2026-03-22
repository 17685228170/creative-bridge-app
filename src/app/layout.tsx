import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "创意桥 - AI创意产业化平台",
  description: "覆盖创意确权-产业对接-IP保护-商业变现的全链路服务平台",
  keywords: ["创意", "版权", "区块链", "设计", "IP", "变现"],
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
