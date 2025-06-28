import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test app for 3205 team",
  description: "Kobelev Aleksandr. Your best employee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <ul className="navList container">
            <li>
              <Link href="/create-short-link" className="navLink">
                <h3>Create link</h3>
              </Link>
            </li>
            <li>
              <Link href="/delete-link" className="navLink">
                <h3>Delete link</h3>
              </Link>
            </li>
            <li>
              <Link href="/info-link" className="navLink">
                <h3>Info</h3>
              </Link>
            </li>
            <li>
              <Link href="/analitic-link" className="navLink">
                <h3>Analitic</h3>
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
