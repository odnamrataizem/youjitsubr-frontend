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
    width: 100%;
  }

  @media (width >= ${Breakpoints.SM}) {
    width: ${Breakpoints.SM};
  }

  @media (width >= ${Breakpoints.MD}) {
    width: ${Breakpoints.MD};
  }

  @media (width >= ${Breakpoints.LG}) {
    width: ${Breakpoints.LG};
    padding-inline-end: calc(10px + var(--size-32));
  }

  @media (width >= ${Breakpoints.XL}) {
    width: ${Breakpoints.XL};
  }

  @media (width >= ${Breakpoints.XXL}) {
    width: ${Breakpoints.XXL};
  }
`;
