import { ApolloProvider } from '@apollo/client';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

import Layout from '../components/Layout';
import { useApollo } from '../lib/apolloClient';
import '../styles/global.css';
import '../styles/pollen.css';

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </ApolloProvider>
  );
}
