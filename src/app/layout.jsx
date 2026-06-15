import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Providers from "./Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Paw Care",
  description: "Your pet our responsibility",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" crxlauncher="" className="light">
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <Providers>
          <header className="w-full">
            <Navbar />
          </header>
          <main className="w-11/12 mx-auto">{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  );
}
