import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Nav";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx

export const metadata = {
  title: "Hệ thống thi thử",
  description: "Luyện thi Hào khí Đồng Nai - 2025 cùng Chí Lý",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto px-4">{children}</div>
          <Toaster
            position="top-right"
            richColors
            closeButton={false}
            toastOptions={{
              className: "bg-white text-black shadow-lg",
              style: {
                background: "#fff",
                color: "#000",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
