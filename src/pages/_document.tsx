import { Html, Head, Main, NextScript } from 'next/document';

import Header from '../components/Header';

export default function Document() {
  return (
    <Html lang={process.env.NEXT_PUBLIC_LOCALE}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
