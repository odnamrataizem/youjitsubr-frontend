import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  const __html = `
    var colorScheme = localStorage ? localStorage.theme : null;
    var media = matchMedia('(prefers-color-scheme: dark)');
    colorScheme = colorScheme || (media && media.matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  `;

  return (
    <Html lang={process.env.NEXT_PUBLIC_LOCALE}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="initial-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html }}
        ></Script>
      </body>
    </Html>
  );
}
