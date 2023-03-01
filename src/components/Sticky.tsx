import { styled } from '@linaria/react';
import React from 'react'
import { BsFillStarFill } from 'react-icons/bs';

export function Sticky() {
  return (
    <StyledSticky>
      <BsFillStarFill title="Post fixado" />
    </StyledSticky>
  );
}

const StyledSticky = styled.div`
  position: absolute;
  inset-inline-end: var(--size-2);
  inset-block-start: var(--size-2);
  color: var(--color-grey-50);
  z-index: var(--layer-1);
  filter: drop-shadow(0 0 var(--size-1) var(--color-grey-900));
`;
