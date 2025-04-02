import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Unemployed Shoppinglist",
    description: "Finanziert vom Buergergeld",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex w-full flex-row grow justify-center">
                        <div className="h-full lg:w-[75vw] w-full flex flex-col space-y-2">
                            <Header />
                            {children}
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
