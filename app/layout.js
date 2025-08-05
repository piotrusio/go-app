import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/shared/app-layout";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata = {
  title: {
    template: '%s | Fargotex',
    default: 'Fargotex',
  },
  description: '',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={`${openSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
