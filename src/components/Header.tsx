import { styled } from '@linaria/react';
import React from 'react';

import { Breakpoints, Container } from '../styles/common';

export default function Header() {
  return (
    <StyledHeader>
      <Container as="div">
        <h1>YouJitsuBR</h1>
      </Container>
      <StyledMenu id="main-menu"></StyledMenu>
    </StyledHeader>
  );
}

export const StyledHeader = styled.header`
  border-block-end: var(--size-1) solid #a3003e;
  block-size: var(--size-12);

  @media (width >= ${Breakpoints.MD}) {
    block-size: var(--size-72);
  }
`;

export const StyledMenu = styled.nav`
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: var(--size-32);
  background: #a3003e;

  @media (width < ${Breakpoints.LG}) {
    display: none;
  }
`;
