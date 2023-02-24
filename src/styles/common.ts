import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export enum Breakpoints {
  SM = '640px',
  MD = '768px',
  LG = '1024px',
  XL = '1280px',
  XXL = '1536px',
}

export const Container = styled.main`
  margin-inline: auto;
  padding-inline: var(--size-5);

  @media (width < ${Breakpoints.SM}) {
    inline-size: var(--size-full);
  }

  @media (width >= ${Breakpoints.SM}) {
    inline-size: ${Breakpoints.SM};
  }

  @media (width >= ${Breakpoints.MD}) {
    inline-size: ${Breakpoints.MD};
  }

  @media (width >= ${Breakpoints.LG}) {
    inline-size: ${Breakpoints.LG};
    padding-inline-end: calc(var(--size-5) + var(--size-32));
  }

  @media (width >= ${Breakpoints.XL}) {
    inline-size: ${Breakpoints.XL};
  }

  @media (width >= ${Breakpoints.XXL}) {
    inline-size: ${Breakpoints.XXL};
  }
`;

export const styledLinks = css`
  a {
    color: var(--color-youjitsu-1);
    transition: color 0.25s ease-in-out;

    &:hover,
    &:focus {
      color: var(--color-youjitsu-2);
    }

    html.dark & {
      color: var(--color-youjitsu-2);

      &:hover,
      &:focus {
        color: var(--color-youjitsu-1);
      }
    }
  }
`;

export const ProseContainer = styled.div`
  max-inline-size: var(--prose-md);
  margin-inline: auto;
  font-size: var(--scale-2);
  line-height: var(--scale-4);

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  hr,
  blockquote,
  pre,
  figure {
    margin-block: var(--scale-4);
  }

  p,
  li {
    text-align: justify;
  }

  h1 {
    font-size: var(--scale-5);
    line-height: var(--scale-6);
  }

  h2 {
    font-size: var(--scale-4);
  }

  h3 {
    font-size: var(--scale-3);
  }

  h4 {
    font-size: var(--scale-2);
  }

  h5 {
    font-size: var(--scale-1);
  }

  h6 {
    font-size: var(--scale-0);
  }

  hr {
    border: 0;
    position: relative;
    display: flow-root;
    overflow: visible;

    &::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      inset-block-start: 0;
      border-block-end: var(--size-px) solid;
    }
  }

  ul,
  ol {
    padding-inline-start: var(--size-8);

    ul,
    ol {
      margin: 0;
    }
  }

  ul ul {
    list-style: circle;

    ul {
      list-style: square;

      ul {
        list-style: disc;
      }
    }
  }

  ol ol {
    list-style: lower-alpha;

    ol {
      list-style: lower-roman;

      ol {
        list-style: numeric;
      }
    }
  }

  figure img {
    margin-inline: auto;
  }

  figcaption {
    text-align: center;
    font-size: var(--scale-0);
  }
`;

export const visuallyHidden = css`
  inline-size: 1px !important;
  block-size: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;

  &:not(caption) {
    position: absolute !important;
  }
`;

export const StyledAboutSection = styled.section`
  background: var(--color-gray-100);
  display: flex;
  flex-wrap: wrap;
  position: relative;
  border-radius: var(--radius-sm);
  margin-block: var(--scale-4);
  padding: var(--size-6);
  gap: var(--size-6);
  align-items: center;
  font-size: var(--scale-0);

  h3 {
    margin-block-start: 0;
  }

  html.dark & {
    background: var(--color-gray-800);
  }

  @media (width >= ${Breakpoints.MD}) {
    border-radius: var(--radius-lg);
    margin-block: var(--scale-4);
    padding: var(--size-8);
    gap: var(--size-8);
  }
`;

export const StyledAboutPictureContainer = styled.div`
  position: relative;
  inline-size: var(--size-20);
  block-size: var(--size-20);
  align-self: flex-start;
  margin-block-start: calc(var(--size-5) * -1);

  img {
    object-fit: cover;
    border-radius: var(--radius-full);
  }

  @media (width >= ${Breakpoints.MD}) {
    inline-size: var(--size-36);
    block-size: var(--size-36);
    margin-block-start: 0;
    align-self: unset;
  }
`;

export const StyledAboutInfoContainer = styled.div`
  flex: 1;

  > div {
    :first-child {
      margin-block-start: 0;
    }

    :last-child {
      margin-block-end: 0;
    }
  }

  @media (width < ${Breakpoints.MD}) {
    > div {
      margin-inline-start: calc(var(--size-20) * -1 + var(--size-6) * -1);
    }
  }
`;
