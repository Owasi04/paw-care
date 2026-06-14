import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Providers from "./Providers";

const inter = Inter({
  weight: ["400", "500", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Paw Care",
  description: "Your pet our responsibility",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      crxlauncher=""
      className="inter_b5431bfd-module__1awITq__className plus_jakarta_sans_24a75937-module__Cnjs1..."
    >
      <body className="">
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
