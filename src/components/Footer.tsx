import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Container, ProseContainer } from '../styles/common';

export default function Footer() {
  return (
    <StyledFooter>
      <Container as="div">
        <Link href="/">
          <StyledSiteTitle>
            <Image priority fill src="/yjbr.svg" alt="YouJitsuBR" />
          </StyledSiteTitle>
        </Link>
        <StyledPartnerList>
          <li>
            <Link href="https://google.com/">Google</Link>
          </li>
          <li>
            <Link href="https://google.com/">Google</Link>
          </li>
          <li>
            <Link href="https://google.com/">Google</Link>
          </li>
          <li>
            <Link href="https://google.com/">Google</Link>
          </li>
          <li>
            <Link href="https://google.com/">Google</Link>
          </li>
        </StyledPartnerList>
        <StyledCopyrightContainer>
          <p>Feito com ❤️ e por ❤️ à comunidade brasileira de COTE!</p>
        </StyledCopyrightContainer>
      </Container>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  border-block-start: var(--size-1) solid var(--color-youjitsu-1);

  padding-block: var(--size-5);

  html.dark & {
    border-block-start-color: var(--color-youjitsu-2);
  }
`;

const StyledSiteTitle = styled.div`
  position: relative;
  inline-size: var(--size-48);
  block-size: var(--size-40);
  margin-inline: auto;
`;

const StyledPartnerList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-block: var(--size-5);
  gap: var(--size-5);

  li::marker {
    color: transparent;
  }

  a {
    display: block;
    width: 88px;
    height: 31px;
    background: var(--color-gray-500);
    color: transparent;
  }
`;

const StyledCopyrightContainer = styled(ProseContainer)`
  font-weight: var(--weight-medium);

  p {
    text-align: center;
  }
`;
