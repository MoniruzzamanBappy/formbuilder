import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WemPro Form Builder",
  description: "A form builder for WemPro",
  icons: {
    icon: "/images/wempro_com_logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="WemPro Form Builder" key="title" />
        <link rel="shortcut icon" href={metadata.icons.shortcut} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
