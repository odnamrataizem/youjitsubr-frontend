import React from 'react';

import { Container } from '../styles/common';
import Footer from './Footer';
import Header from './Header';

type WrapperProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: WrapperProps) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
