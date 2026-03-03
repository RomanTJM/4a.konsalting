import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: '--font-montserrat' });
const raleway = Raleway({ subsets: ["latin", "cyrillic"], weight: ["700"], variable: '--font-raleway' });

export const metadata: Metadata = {
  title: "Выбери тариф",
  description: "Выберите подходящий тариф",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Aggressive cleanup of browser extension attributes
              const cleanup = () => {
                document.querySelectorAll('[bis_skin_checked]').forEach(el => {
                  el.removeAttribute('bis_skin_checked');
                });
              };
              
              // Run immediately
              cleanup();
              
              // Use MutationObserver to catch attributes added during hydration
              const observer = new MutationObserver(cleanup);
              observer.observe(document.documentElement, {
                attributes: true,
                subtree: true,
                attributeFilter: ['bis_skin_checked']
              });
              
              // Also listen for DOM changes
              document.addEventListener('DOMContentLoaded', cleanup);
              
              // Clean up observer after React loads (to prevent performance issues)
              setTimeout(() => observer.disconnect(), 3000);
            `,
          }}
        />
      </head>
      <body className={`${montserrat.className} ${montserrat.variable} ${raleway.variable}`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
