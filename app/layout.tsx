// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-options";
import { Navbar } from "./component/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PEA NMO Popup",
  description: "ระบบติดตามสถานะการเบิกจ่ายเงิน",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/back.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30 backdrop-filter backdrop-blur-sm"></div>
          <div className="relative z-10">
            <Navbar session={session} />
            <main className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-24">
              <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-8 mt-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
