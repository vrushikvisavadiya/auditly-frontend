import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "material-symbols/rounded.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
});

export const metadata: Metadata = {
  title: "auditly",
  description: "Audit readiness in the NDIS space",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            toastOptions={{
              style: { maxWidth: "500px" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
