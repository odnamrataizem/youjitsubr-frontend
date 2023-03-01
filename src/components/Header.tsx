import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useMediaQuery } from '@react-hook/media-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { CgDarkMode } from 'react-icons/cg';
import { tween } from '../lib/misc';
import { useColorScheme } from '../lib/store/color-scheme';

import { Breakpoints, Container } from '../styles/common';

export default function Header() {
  const [clientOnly, setClientOnly] = useState(false);
  useEffect(() => {
    setClientOnly(true);
  }, []);

  const [colorScheme, setColorScheme] = useColorScheme();

  const [open, setOpen] = useState(false);

  const openMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const closeMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
  }, []);

  const closeMenuAndNavigate = useCallback(() => {
    setOpen(false);
  }, []);

  const socialLinksRef = useRef<HTMLDivElement>(null);

  const [socialLinkBoxes, setSocialLinkBoxes] = useState<any[]>([]);
  const [blockSize, setBlockSize] = useState('auto');

  const isMobile = useMediaQuery(`(width < ${Breakpoints.LG})`);

  const isSupposedlyDark = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    if (!socialLinksRef.current) {
      return;
    }

    const nodes = socialLinksRef.current.querySelectorAll<HTMLElement>(
      `.${StyledSocialLink.__linaria.className}`,
    );

    if (!nodes) {
      return;
    }

    const boxes = [];

    for (const node of nodes) {
      boxes.push({ x: node.offsetLeft, y: node.offsetTop, node });
    }

    setSocialLinkBoxes(boxes);
  }, [isMobile, clientOnly]);

  useEffect(() => {
    if (!socialLinksRef.current) {
      return;
    }

    setBlockSize(
      isMobile ? 'auto' : getComputedStyle(socialLinksRef.current).blockSize,
    );
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    for (const box of socialLinkBoxes) {
      const lastX = box.x;
      const lastY = box.y;

      box.x = box.node.offsetLeft;
      box.y = box.node.offsetTop;

      if (lastX === box.x && lastY === box.y) {
        continue;
      }

      const x = lastX - box.x;
      const y = lastY - box.y;

      tween(
        box.node,
        { x, y },
        { x: 0, y: 0, duration: 250, easing: 'inOutSine' },
      );
    }
  }, [socialLinkBoxes, open, isMobile]);

  const changeColorScheme = useCallback(() => {
    if (colorScheme == null) {
      setColorScheme(isSupposedlyDark ? 'light' : 'dark');
      return;
    }

    if (colorScheme == 'dark') {
      setColorScheme(isSupposedlyDark ? undefined : 'light');
      return;
    }

    setColorScheme(isSupposedlyDark ? 'dark' : undefined);
  }, [colorScheme, isSupposedlyDark, setColorScheme]);

  return (
    <StyledHeader>
      <Link href="/">
        <StyledContainer as="div">
          <StyledImageContainer>
            <Image
              priority
              fill
              sizes={`(width < ${Breakpoints.MD}) 64px, 348px`}
              src="/kiyotaka-kei.png"
              alt=""
            />
          </StyledImageContainer>
          <StyledSiteTitle>
            <Image priority fill src="/yjbr.svg" alt="YouJitsuBR" />
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
            <Link href="/" onClick={closeMenuAndNavigate}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/posts/noticias" onClick={closeMenuAndNavigate}>
              Notícias
            </Link>
          </li>
          <li>
            <Link href="/posts/resenhas" onClick={closeMenuAndNavigate}>
              Resenhas
            </Link>
          </li>
          <li>
            <Link href="/sobre-nos" onClick={closeMenuAndNavigate}>
              Sobre
            </Link>
          </li>
          <li>
            <Link href="/contato" onClick={closeMenuAndNavigate}>
              Contato
            </Link>
          </li>
        </ul>
      </StyledMenu>
      <StyledSocialLinkContainer ref={socialLinksRef} style={{ blockSize }}>
        <StyledSocialLink href="https://twitter.com/YouJitsuNoBR">
          <Image priority fill src="/twitter.svg" alt="Twitter" />
        </StyledSocialLink>
        <StyledSocialLink href="https://facebook.com/YouJitsuBR">
          <Image priority fill src="/facebook.svg" alt="Facebook" />
        </StyledSocialLink>
        <StyledSocialLink href="#">
          <Image priority fill src="/discord.svg" alt="Discord" />
        </StyledSocialLink>
        {clientOnly && (
          <StyledSocialLink
            as="button"
            type="button"
            onClick={changeColorScheme}
          >
            {colorScheme === 'light' ? (
              <BsSunFill title="Tema claro - clique para trocar" />
            ) : colorScheme === 'dark' ? (
              <BsMoonStarsFill title="Tema escuro - clique para trocar" />
            ) : (
              <CgDarkMode title="Tema automático - clique para trocar" />
            )}
          </StyledSocialLink>
        )}
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
  position: relative;
  z-index: var(--layer-5);
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
  block-size: var(--size-full);

  > * {
    flex: 1;
  }

  @media (width < ${Breakpoints.MD}) {
    inline-size: var(--size-48);
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  block-size: var(--size-full);

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
  inline-size: var(--size-20);
  block-size: var(--size-20);
  color: transparent;
  background: var(--color-youjitsu-1);

  html.dark & {
    background: var(--color-youjitsu-2);
  }

  @media (width < ${Breakpoints.MD}) {
    inline-size: var(--size-14);
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
  transform: translate3d(calc(var(--size-80) - var(--size-20)), 0, 0);
  max-inline-size: var(--size-80);
  background: var(--color-youjitsu-1);
  transition: transform 0.25s ease-in-out;

  > * {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.25s ease-in-out, opacity 0.25s ease-in-out;
  }

  html[dir='rtl'] & {
    transform: translate3d(calc(var(--size-20) - var(--size-80)), 0, 0);
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
      color: var(--color-grey-50);
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
  inset-inline-end: var(--size-3);
  inset-block-start: var(--size-4);
  inline-size: var(--size-14);
  transition: transform 0.25s ease-in-out;
  z-index: var(--layer-3);

  span {
    position: absolute;
    inset-block-start: 0;
    block-size: var(--size-2);
    inline-size: var(--size-full);
    background: var(--color-grey-50);
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
    inline-size: var(--size-10);

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
  inset-inline-end: var(--size-4);
  inset-block-end: var(--size-4);
  inline-size: var(--size-72);
  aspect-ratio: 1 / 1;
  z-index: var(--layer-5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: var(--size-4);
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  ${StyledMenu}:target ~ &,
  ${StyledMenu}.open ~ & {
    flex-direction: row;
  }

  @media (width < ${Breakpoints.LG}) {
    visibility: hidden;
    opacity: 0;
    flex-direction: row;
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
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  position: relative;
  inline-size: var(--size-12);
  block-size: var(--size-12);
  font-size: var(--size-12);
  cursor: pointer;

  img {
    object-fit: contain;
  }
`;
