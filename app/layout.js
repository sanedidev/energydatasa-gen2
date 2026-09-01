import "./globals.css";
import "./ConfigureAmplify";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./context/auth";
import { PermissionsProvider } from "./context/permissions";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata = {
    title: "Energy Data SA",
    description: "Energy Data for SA",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased">
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
