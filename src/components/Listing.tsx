import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Post, SlateDocument, UploadedFile } from '../lib/fetching';
import { Breakpoints, ProseContainer } from '../styles/common';
import Paginator from './Paginator';
import PostLink from './PostLink';
import Renderer from './Renderer';
import { Sticky } from './Sticky';

type ListingObject = {
  id: string;
  name?: string;
  title?: string;
  description?: SlateDocument;
  cover?: UploadedFile;
  picture?: UploadedFile;
  posts: Post[];
};

type ListingProps<T extends ListingObject> = {
  data: T;
  dataList: string;
  page?: number;
  lastPage?: number;
  timeframe?: string[];
};

export default function Listing<T extends ListingObject>({
  data,
  dataList,
  page,
  lastPage,
  timeframe,
}: ListingProps<T>) {
  page ??= 1;
  lastPage ??= 1;

  const image = data.picture?.url ?? data.cover?.url ?? '';
  const description = data.description?.document;

  let title = <b>{data.name ?? data.title}</b>;
  switch (dataList) {
    case 'categories': {
      title = <>Posts na categoria {title}</>;

      if (timeframe?.length) {
        const date = new Date(
          Number.parseInt(timeframe[0]),
          Number.parseInt(timeframe[1] ?? '1') - 1,
        ).toLocaleString(process.env.NEXT_PUBLIC_LOCALE, {
          year: 'numeric',
          month: timeframe[1] ? 'long' : undefined,
        });
        title = (
          <>
            {title} ({date})
          </>
        );
      }

      break;
    }
    case 'users': {
      title = <>Posts de {title}</>;
      break;
    }
    case 'tags': {
      title = <>Posts com a tag {title}</>;
      break;
    }
  }

  return (
    <StyledContainer>
      <StyledTitle>{title}</StyledTitle>
      {image && (
        <Image
          alt=""
          src={image}
          width="400"
          height="400"
          style={{ objectFit: 'cover' }}
        />
      )}
      {description && (
        <ProseContainer>
          <Renderer document={description} />
        </ProseContainer>
      )}
      <StyledListing>
        {data.posts.map(post => (
          <li key={post.id}>
            <StyledImageContainer>
              <Image fill alt="" src={post.cover?.url ?? ''} />
              {post.sticky && <Sticky />}
            </StyledImageContainer>
            <div>
              <PostLink post={post} />
              <p>{post.lead}</p>
            </div>
          </li>
        ))}
      </StyledListing>
      <Paginator page={page} lastPage={lastPage} />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  max-inline-size: var(--prose-md);
  font-size: var(--scale-2);
  margin-inline: auto;
  margin-block: var(--size-8);
`;

const StyledTitle = styled.h1`
  text-align: center;
  font-size: var(--scale-6);
  font-weight: var(--weight-medium);

  @media (width < ${Breakpoints.MD}) {
    font-size: var(--scale-4);
  }
`;

const StyledListing = styled.ul`
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    margin-block: var(--size-8);

    > div:last-of-type {
      a {
        color: inherit;
        text-decoration: none;
        font-size: var(--scale-3);
        font-weight: var(--weight-semibold);
      }

      p {
        font-size: var(--scale-2);
        margin-block: var(--size-3) 0;
      }

      @media (width < ${Breakpoints.MD}) {
        a {
          font-size: var(--scale-1);
        }

        p {
          font-size: var(--scale-0);
          margin-block: var(--size-2) 0;
        }
      }
    }

    &::marker {
      color: transparent;
    }
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  flex: none;
  inline-size: var(--size-36);
  block-size: var(--size-28);

  @media (width < ${Breakpoints.MD}) {
    inline-size: var(--size-24);
    block-size: var(--size-20);
  }

  img {
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
`;
