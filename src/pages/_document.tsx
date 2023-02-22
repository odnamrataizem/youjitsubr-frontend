import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang={process.env.NEXT_PUBLIC_LOCALE}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script id="initial-theme" strategy="beforeInteractive">{`
          const colorScheme =
            localStorage?.theme ??
            (matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light');
          document.documentElement.classList.toggle('dark', colorScheme === 'dark');
        `}</Script>
      </body>
    </Html>
  );
}
