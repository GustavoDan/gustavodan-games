import type { Metadata } from "next";
import { Orbitron, Audiowide } from "next/font/google";
import { cn } from "@/utils/cn";
import "./globals.css";

const title_font = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-title",
});

const main_font = Audiowide({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-main",
});

export const metadata: Metadata = {
    title: "Game Hub",
    description: "A game selection hub.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn(main_font.variable, title_font.variable)}>
            <body
                className={cn(
                    "font-main antialiased text-[#e3e3ff] bg-[#121212] bg-gradient bg-blend-lighten",
                    "w-screen h-screen overflow-hidden flex items-center justify-center",
                    "before:absolute before:inset-0 before:size-full before:pointer-events-none before:bg-stripe"
                )}
            >
                {children}
            </body>
        </html>
    );
}
