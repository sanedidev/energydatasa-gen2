import "./globals.css";
import "./ConfigureAmplify";
import { Geist, Geist_Mono, Shippori_Mincho } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./context/auth";
import { PermissionsProvider } from "./context/permissions";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const shipporiMincho = Shippori_Mincho({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-shippori-mincho" });

export const metadata = {
    title: "Energy Data SA",
    description: "Energy Data for SA",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${shipporiMincho.variable}`}>
            <body className="bg-[var(--color-cream)] text-[var(--color-ink)] min-h-screen flex flex-col antialiased">
                <AuthProvider>
                    <PermissionsProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </PermissionsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
