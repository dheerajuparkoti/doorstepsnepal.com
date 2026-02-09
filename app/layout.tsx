// import React from "react"
// import type { Metadata, Viewport } from "next";
// import { Poppins, Noto_Sans_Devanagari } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";
// import { ThemeProvider } from "@/lib/theme/context";
// import { I18nProvider } from "@/lib/i18n/context";
// import "./globals.css";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-poppins",
// });

// const notoSansDevanagari = Noto_Sans_Devanagari({
//   subsets: ["devanagari"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-devanagari",
// });

// export const metadata: Metadata = {
//   title: "Doorsteps Nepal | Trusted Home Services at Your Doorstep",
//   description:
//     "Connect with verified professionals for plumbing, electrical, cleaning, beauty, repairs and more. Quality home services in Nepal.",
//   keywords: [
//     "home services",
//     "Nepal",
//     "plumbing",
//     "electrician",
//     "cleaning",
//     "beauty",
//     "repairs",
//     "Kathmandu",
//   ],
//   authors: [{ name: "Doorsteps Nepal" }],
//   openGraph: {
//     title: "Doorsteps Nepal | Trusted Home Services",
//     description: "Book verified professionals for all your home service needs",
//     type: "website",
//     locale: "en_US",
//   },
//     generator: 'v0.app'
// };

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#22c55e" },
//     { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
//   ],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${poppins.variable} ${notoSansDevanagari.variable} font-sans antialiased`}
//       >
//         <ThemeProvider>
//           <I18nProvider>{children}</I18nProvider>
//         </ThemeProvider>
//         <Analytics />
//       </body>
//     </html>
//   );
// }


import React from "react"
import type { Metadata, Viewport } from "next";
import { Poppins, Noto_Sans_Devanagari } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/lib/theme/context";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/context/auth-context"; 
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "Doorsteps Nepal | Trusted Home Services at Your Doorstep",
  description:
    "Connect with verified professionals for plumbing, electrical, cleaning, beauty, repairs and more. Quality home services in Nepal.",
  keywords: [
    "home services",
    "Nepal",
    "plumbing",
    "electrician",
    "cleaning",
    "beauty",
    "repairs",
    "Kathmandu",
  ],
  authors: [{ name: "Doorsteps Nepal" }],
  openGraph: {
    title: "Doorsteps Nepal | Trusted Home Services",
    description: "Book verified professionals for all your home service needs",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.app'
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${notoSansDevanagari.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider> {/* Add AuthProvider*/}
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
