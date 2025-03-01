import "./globals.css";
import { Poppins } from "next/font/google";
import Naviagtion from "@/components/Navigation";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <header>
          <Naviagtion />
        </header>
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
