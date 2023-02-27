import { styled } from '@linaria/react';
import Image from 'next/image';
import React from 'react';

import { UploadedFile, type EntityWithPosts } from '../lib/fetching';
import { Breakpoints, ProseContainer, styledLinks } from '../styles/common';
import EntityLink from './EntityLink';
import Metadata from './Metadata';

type Data = EntityWithPosts & {
  cover?: UploadedFile;
  picture?: UploadedFile;
};

type ListingProps = {
  data: Data[];
  title: string;
  path: string;
};

export default function Listing({ data, title, path }: ListingProps) {
  return (
    <ProseContainer className={styledLinks}>
      <Metadata title={title} />
      <StyledTitle>{title}</StyledTitle>
      <StyledListing>
        {data
          .filter(item => item.postsCount)
          .map(item => (
            <li key={item.id}>
              <StyledImageContainer>
                <Image
                  fill
                  sizes="112px"
                  alt=""
                  src={item.picture?.url ?? item.cover?.url ?? ''}
                />
              </StyledImageContainer>
              <EntityLink kind={path} data={item} />
              <br />
              {item.postsCount} posts
            </li>
          ))}
      </StyledListing>
    </ProseContainer>
  );
}

const StyledTitle = styled.h1`
  text-align: center;
  font-size: var(--scale-6) !important;
  font-weight: var(--weight-medium);

  @media (width < ${Breakpoints.MD}) {
    font-size: var(--scale-4) !important;
  }
`;

const StyledListing = styled.ul`
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--size-12);

  li {
    text-align: center;

    &::marker {
      color: transparent;
    }
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  inline-size: var(--size-28);
  block-size: var(--size-28);

  img {
    border-radius: var(--radius-full);
    object-fit: cover;
  }
`;
