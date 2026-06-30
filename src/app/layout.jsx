import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import { Providers } from "./Providers";
import Footer from "./Components/Footer/Footer";
import MainContent from "./Components/MainContent";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

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

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <Providers session={session}>
          <header className="w-full">
            <Navbar />
          </header>
          <MainContent>{children}</MainContent>
          <footer>
            <Footer />
          </footer>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
