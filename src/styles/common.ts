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
  padding-inline: 10px;

  @media (width < ${Breakpoints.SM}) {
    inline-size: 100%;
  }

  @media (width >= ${Breakpoints.SM}) {
    inline-size: ${Breakpoints.SM};
  }

  @media (width >= ${Breakpoints.MD}) {
    inline-size: ${Breakpoints.MD};
  }

  @media (width >= ${Breakpoints.LG}) {
    inline-size: ${Breakpoints.LG};
    padding-inline-end: calc(10px + var(--size-32));
  }

  @media (width >= ${Breakpoints.XL}) {
    inline-size: ${Breakpoints.XL};
  }

  @media (width >= ${Breakpoints.XXL}) {
    inline-size: ${Breakpoints.XXL};
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

  figcaption {
    text-align: center;
    font-size: var(--scale-0);
  }
`;
