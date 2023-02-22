import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import { Breakpoints, Container } from '../styles/common';

export default function Header() {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const closeMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
  }, []);

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
      <StyledMenuToggle
        className={menuToggle}
        href="#main-menu"
        id="menu-toggle"
        onClick={openMenu}
      >
        Abrir menu
      </StyledMenuToggle>
      <StyledMenu id="main-menu" className={open ? 'open' : ''}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts/noticias">Notícias</Link>
          </li>
          <li>
            <Link href="/posts/resenhas">Resenhas</Link>
          </li>
          <li>
            <Link href="/sobre-nos">Sobre</Link>
          </li>
          <li>
            <Link href="/contato">Contato</Link>
          </li>
        </ul>
      </StyledMenu>
      <StyledSocialLinkContainer>
        <StyledSocialLink href="https://twitter.com/YouJitsuNoBR">
          <Image priority fill src="/twitter.svg" alt="Twitter" />
        </StyledSocialLink>
        <StyledSocialLink href="https://facebook.com/YouJitsuBR">
          <Image priority fill src="/facebook.svg" alt="Facebook" />
        </StyledSocialLink>
      </StyledSocialLinkContainer>
      <StyledCloseMenu
        className={menuToggle}
        href="#menu-toggle"
        onClick={closeMenu}
      >
        Fechar menu
      </StyledCloseMenu>
      <StyledMenuIcon aria-hidden="true">
        <span />
        <span />
        <span />
      </StyledMenuIcon>
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

const menuToggle = css`
  position: fixed;
  inset-inline-end: 0;
  inset-block-start: 0;
  inline-size: var(--size-32);
  block-size: var(--size-24);
  color: transparent;
  background: var(--color-youjitsu-1);

  html.dark & {
    background: var(--color-youjitsu-2);
  }

  @media (width < ${Breakpoints.MD}) {
    inline-size: var(--size-16);
    block-size: var(--size-14);
  }
`;

const StyledMenuToggle = styled.a`
  z-index: var(--layer-2);

  @media (width < ${Breakpoints.LG}) {
    position: absolute;
  }
`;

const StyledCloseMenu = styled.a`
  display: none;
  z-index: var(--layer-3);
`;

const StyledMenu = styled.nav`
  position: fixed;
  display: flex;
  z-index: var(--layer-1);
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: var(--size-80);
  transform: translate3d(calc(var(--size-80) - var(--size-32)), 0, 0);
  max-inline-size: var(--size-80);
  background: var(--color-youjitsu-1);
  transition: transform 0.25s ease-in-out;

  > * {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.25s ease-in-out, opacity 0.25s ease-in-out;
  }

  html[dir='rtl'] & {
    transform: translate3d(calc(var(--size-32) - var(--size-80)), 0, 0);
  }

  html.dark & {
    background: var(--color-youjitsu-2);
  }

  &:target,
  &.open {
    transform: translate3d(0, 0, 0) !important;

    ~ ${StyledCloseMenu} {
      display: block;
      position: fixed;
    }

    ~ span {
      position: fixed;
    }

    > * {
      visibility: visible;
      opacity: 1;
    }
  }

  ul {
    display: flex;
    margin: auto;
    flex-direction: column;
    text-align: center;
    text-transform: uppercase;
    font-weight: var(--weight-bold);
    font-size: var(--scale-4);
    gap: var(--size-8);

    li::marker {
      color: transparent;
    }

    a {
      color: var(--color-gray-50);
      text-decoration: none;
    }
  }

  @media (width < ${Breakpoints.LG}) {
    transform: translate3d(var(--size-80), 0, 0);

    html[dir='rtl'] & {
      transform: translate3d(calc(var(--size-80) * -1), 0, 0);
    }
  }
`;

const StyledMenuIcon = styled.span`
  position: fixed;
  pointer-events: none;
  inset-inline-end: var(--size-6);
  inset-block-start: var(--size-6);
  inline-size: var(--size-20);
  transition: transform 0.25s ease-in-out;
  z-index: var(--layer-3);

  span {
    position: absolute;
    inset-block-start: 0;
    block-size: var(--size-2);
    inline-size: 100%;
    background: var(--color-gray-50);
    border-radius: var(--radius-full);
    opacity: 1;
    left: 0;
    transform: translate3d(0, 0, 0) rotate(0);
    transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;

    &:nth-child(2) {
      transform: translate3d(0, var(--size-5), 0);
    }

    &:nth-child(3) {
      transform: translate3d(0, var(--size-10), 0);
    }
  }

  ${StyledMenu}:target ~ &,
  ${StyledMenu}.open ~ & {
    span:nth-child(1) {
      transform: translate3d(0, var(--size-5), 0) rotate(135deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translate3d(0, var(--size-5), 0) rotate(-135deg);
    }
  }

  @media (width < ${Breakpoints.LG}) {
    position: absolute;
  }

  @media (width < ${Breakpoints.MD}) {
    inset-inline-end: var(--size-2);
    inset-block-start: var(--size-2);
    inline-size: var(--size-12);

    span {
      &:nth-child(2) {
        transform: translate3d(0, var(--size-4), 0);
      }

      &:nth-child(3) {
        transform: translate3d(0, var(--size-8), 0);
      }
    }

    ${StyledMenu}:target ~ &,
    ${StyledMenu}.open ~ & {
      span:nth-child(1) {
        transform: translate3d(0, var(--size-4), 0) rotate(135deg);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: translate3d(0, var(--size-4), 0) rotate(-135deg);
      }
    }
  }
`;

const StyledSocialLinkContainer = styled.div`
  position: fixed;
  inset-inline-end: var(--size-8);
  inset-block-end: var(--size-8);
  inline-size: var(--size-16);
  z-index: var(--layer-5);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--size-6);

  ${StyledMenu}:target ~ &,
  ${StyledMenu}.open ~ & {
    inline-size: var(--size-64);
  }

  @media (width < ${Breakpoints.LG}) {
    visibility: hidden;
    opacity: 0;
    inline-size: var(--size-64);
    transform: translate3d(var(--size-80), 0, 0);
    transition: visibility 0.25s ease-in-out, transform 0.25s ease-in-out,
      opacity 0.25s ease-in-out;

    html[dir='rtl'] & {
      transform: translate3d(calc(var(--size-80) * -1), 0, 0);
    }

    ${StyledMenu}:target ~ &,
    ${StyledMenu}.open ~ & {
      transform: translate3d(0, 0, 0);
      visibility: visible;
      opacity: 1;
    }
  }
`;

const StyledSocialLink = styled.a`
  position: relative;
  inline-size: var(--size-16);
  block-size: var(--size-16);

  img {
    object-fit: contain;
  }
`;
