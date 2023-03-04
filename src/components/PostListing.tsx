import { styled } from '@linaria/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Post, SlateDocument, UploadedFile } from '../lib/fetching';
import {
  Breakpoints,
  innerShadow,
  ProseContainer,
  StyledAboutDescriptionContainer,
  StyledAboutPictureContainer,
  StyledAboutSection,
} from '../styles/common';
import Metadata from './Metadata';
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

type PostListingProps<T extends ListingObject> = {
  data: T;
  dataList: string;
  page?: number;
  lastPage?: number;
  timeframe?: string[];
};

export default function PostListing<T extends ListingObject>({
  data,
  dataList,
  page,
  lastPage,
  timeframe,
}: PostListingProps<T>) {
  page ??= 1;
  lastPage ??= 1;

  const image = data.picture?.url ?? data.cover?.url ?? '';
  const description = data.description?.document;

  let title = <b>{data.name ?? data.title}</b>;
  let plainTitle = data.name ?? data.title;
  switch (dataList) {
    case 'categories': {
      if (plainTitle == null) {
        title = <>Todos os posts</>;
        plainTitle = 'Todos os posts';
        break;
      }

      title = <>Posts na categoria {title}</>;
      plainTitle = `Posts na categoria ${plainTitle}`;

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
        plainTitle = `${plainTitle} (${date})`;
      }

      break;
    }
    case 'users': {
      title = <>Posts de {title}</>;
      plainTitle = `Posts de ${plainTitle}`;
      break;
    }
    case 'tags': {
      title = <>Posts com a tag {title}</>;
      plainTitle = `Posts com a tag ${plainTitle}`;
      break;
    }
  }

  return (
    <StyledContainer>
      <Metadata title={plainTitle} cover={image} />
      <StyledTitle>{title}</StyledTitle>
      {description && (
        <ProseContainer>
          <StyledStyledAboutSection>
            <StyledAboutPictureContainer className={innerShadow}>
              <Image
                fill
                sizes={`(width < ${Breakpoints.MD}) 80px, 144px`}
                src={image}
                alt=""
              />
            </StyledAboutPictureContainer>
            <StyledAboutDescriptionContainer>
              <Renderer document={description} />
            </StyledAboutDescriptionContainer>
          </StyledStyledAboutSection>
        </ProseContainer>
      )}
      <StyledListing>
        {data.posts.map(post => (
          <li key={post.id}>
            <StyledImageContainer className={innerShadow}>
              <Image
                fill
                sizes={`(width < ${Breakpoints.XL}) 96px, 144px`}
                alt=""
                src={post.cover?.url ?? ''}
              />
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

const StyledStyledAboutSection = styled(StyledAboutSection)`
  display: flex;
  flex-direction: column;

  ${StyledAboutPictureContainer} {
    flex: none;
    margin-block-start: 0;
  }

  ${StyledAboutDescriptionContainer} {
    place-self: unset;

    > :last-child {
      margin-block-end: 0;
    }
  }

  @media (width > ${Breakpoints.MD}) {
    flex-direction: row;
  }
`;

const StyledListing = styled.ul`
  padding: 0;

  li {
    position: relative;
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

        &:hover {
          text-decoration: underline;
        }

        &::after {
          content: '';
          position: absolute;
          inset-block: 0;
          inset-inline-start: 0;
          inline-size: var(--size-36);

          @media (width < ${Breakpoints.MD}) {
            inline-size: var(--size-24);
          }
        }

        @media (width < ${Breakpoints.MD}) {
          font-size: var(--scale-1);
        }
      }

      p {
        font-size: var(--scale-2);
        margin-block: var(--size-3) 0;

        @media (width < ${Breakpoints.MD}) {
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

  &::after {
    border-radius: var(--radius-sm);
  }
`;
