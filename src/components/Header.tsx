import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Breakpoints, Container, visuallyHidden } from '../styles/common';

export default function Header() {
  return (
    <StyledHeader>
      <Link href="/">
        <StyledContainer as="div">
          <StyledImageContainer>
            <Image priority fill src="/kiyotaka-kei.png" alt="" />
          </StyledImageContainer>
          <StyledSiteTitle>
            <Image priority fill src="/yjbr.svg" alt="YoujitsuBR" />
          </StyledSiteTitle>
        </StyledContainer>
      </Link>
      <StyledMenu id="main-menu"></StyledMenu>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  border-block-end: var(--size-1) solid var(--color-youjitsu-1);
  block-size: var(--size-14);

  html.dark & {
    border-block-end-color: var(--color-youjitsu-2);
  }

  @media (width >= ${Breakpoints.MD}) {
    block-size: var(--size-72);
  }
`;

const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  block-size: 100%;

  > * {
    flex: 1;
  }

  @media (width < ${Breakpoints.MD}) {
    inline-size: var(--size-48);
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  block-size: 100%;

  img {
    object-fit: contain;
  }
`;

const StyledSiteTitle = styled.h1`
  position: relative;
  block-size: 70%;
`;

const StyledMenu = styled.nav`
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: var(--size-32);
  background: var(--color-youjitsu-1);

  html.dark & {
    background: var(--color-youjitsu-2);
  }

  @media (width < ${Breakpoints.LG}) {
    display: none;
  }
`;
