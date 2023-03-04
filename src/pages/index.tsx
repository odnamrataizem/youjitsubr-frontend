import { gql } from '@apollo/client';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Authors from '../components/Authors';
import EntityLink from '../components/EntityLink';
import Metadata from '../components/Metadata';
import PostLink from '../components/PostLink';
import { Sticky } from '../components/Sticky';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import type { Post } from '../lib/fetching';
import { Breakpoints, innerShadow, styledLinks, visuallyHidden } from '../styles/common';

const FRONT_PAGE_QUERY = gql`
  query FrontPageQuery {
    posts(
      where: { status: { equals: PUBLISHED } }
      orderBy: [{ sticky: desc }, { publishedAt: desc }]
      take: 10
    ) {
      id
      title
      slug
      lead
      publishedAt
      sticky
      category {
        name
        slug
      }
      cover {
        url
      }
      authors {
        id
        name
        slug
      }
    }
  }
`;

type HomeProps = {
  data: Post[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async context => {
  const client = initializeApollo();
  const { data } = await client.query({ query: FRONT_PAGE_QUERY });
  return addApolloState(client, { props: { data: data.posts } });
};

export default function Home({ data }: HomeProps) {
  const topPost = data[0];

  if (!topPost) {
    return;
  }

  const threePosts = data.slice(1, 4);
  const morePosts = data.slice(4);

  return (
    <>
      <Metadata
        description="Website dedicado à comunidade brasileira de Classroom of the Elite."
        cover="/yjbr.svg"
      />
      <section>
        <h2 className={visuallyHidden}>Últimos posts</h2>
        <StyledTopPosts>
          <StyledImageContainer as="li" className={innerShadow}>
            <Image
              priority
              fill
              sizes={`(width < ${Breakpoints.SM}) calc(100vw - 40px), (width < ${Breakpoints.MD}) 600px, (width < ${Breakpoints.LG}) 728px, (width < ${Breakpoints.XL}) 904px, (width < ${Breakpoints.XXL}) 696px, 850px`}
              alt=""
              src={topPost.cover?.url ?? ''}
            />
            {topPost.sticky && <Sticky />}
            <PostLink post={topPost}>
              <span>{topPost.title}</span>
            </PostLink>
          </StyledImageContainer>
          {threePosts.map(post => (
            <StyledTopPost key={post.id}>
              <StyledImageContainer className={innerShadow}>
                <Image
                  priority
                  fill
                  sizes={`(width < ${Breakpoints.XL}) 96px, 144px`}
                  alt=""
                  src={post.cover?.url ?? ''}
                />
                {post.sticky && <Sticky />}
              </StyledImageContainer>
              <div className={styledLinks}>
                <EntityLink kind="posts" data={post.category} />
                <PostLink post={post} />
              </div>
            </StyledTopPost>
          ))}
        </StyledTopPosts>
      </section>
      <StyledColumns>
        <section>
          <h2 className={visuallyHidden}>Mais posts</h2>
          <StyledMorePosts>
            {morePosts.map(post => (
              <li key={post.id}>
                <StyledImageContainer>
                  <Image fill alt="" src={post.cover?.url ?? ''} />
                  {post.sticky && <Sticky />}
                </StyledImageContainer>
                <div className={styledLinks}>
                  <EntityLink kind="posts" data={post.category} />
                  <PostLink post={post} />
                  <p>{post.lead}</p>
                  <p>
                    Por <Authors data={post.authors} /> a{' '}
                    {new Date(post.publishedAt).toLocaleString(
                      process.env.NEXT_PUBLIC_LOCALE,
                      {
                        dateStyle: 'short',
                      },
                    )}
                  </p>
                </div>
              </li>
            ))}
          </StyledMorePosts>
          <Link className={styledAllPostsLink} href="/posts/~all">
            Ver todos os posts
          </Link>
        </section>
      </StyledColumns>
    </>
  );
}

const StyledImageContainer = styled.div`
  position: relative;
  inline-size: var(--size-36);
  block-size: var(--size-28);

  @media (width < ${Breakpoints.XL}) {
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

  a {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: var(--scale-5);
    line-height: var(--line-sm);
    color: var(--color-grey-50);
    text-shadow: 0 0 var(--size-1) var(--color-grey-900);

    span {
      display: block;
      padding-inline: var(--size-8);
      padding-block-start: var(--size-8);
      padding-block-end: var(--size-4);
      max-block-size: var(--size-full);
      border-end-start-radius: var(--radius-sm);
      border-end-end-radius: var(--radius-sm);
      background: linear-gradient(
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.013) 8.1%,
        rgba(0, 0, 0, 0.049) 15.5%,
        rgba(0, 0, 0, 0.104) 22.5%,
        rgba(0, 0, 0, 0.175) 29%,
        rgba(0, 0, 0, 0.259) 35.3%,
        rgba(0, 0, 0, 0.352) 41.2%,
        rgba(0, 0, 0, 0.45) 47.1%,
        rgba(0, 0, 0, 0.55) 52.9%,
        rgba(0, 0, 0, 0.648) 58.8%,
        rgba(0, 0, 0, 0.741) 64.7%,
        rgba(0, 0, 0, 0.825) 71%,
        rgba(0, 0, 0, 0.896) 77.5%,
        rgba(0, 0, 0, 0.951) 84.5%,
        rgba(0, 0, 0, 0.987) 91.9%,
        rgb(0, 0, 0) 100%
      );
    }

    @media (width < ${Breakpoints.SM}) {
      font-size: var(--scale-2);

      span {
        padding-inline: var(--size-4);
        padding-block-start: var(--size-4);
        padding-block-end: var(--size-2);
      }
    }
  }
`;

const StyledTopPosts = styled.ul`
  padding: 0;
  display: grid;
  column-gap: var(--size-7);
  row-gap: var(--size-5);
  margin-block: var(--size-10);
  font-weight: var(--weight-medium);

  @media (${Breakpoints.MD} <= width < ${Breakpoints.XL}) {
    grid-template: 1fr auto / 1fr 1fr 1fr;
  }

  @media (${Breakpoints.XL} <= width) {
    grid-template: 1fr 1fr 1fr / auto 40%;
  }

  li {
    line-height: var(--line-xs);

    a {
      text-decoration: none;
    }

    &::marker {
      color: transparent;
    }

    &:first-child {
      inline-size: var(--size-full);
      block-size: var(--size-full);

      ${StyledImageContainer} {
        inline-size: unset;
        block-size: unset;
      }

      @media (width < ${Breakpoints.XL}) {
        aspect-ratio: var(--ratio-widescreen);
      }

      @media (${Breakpoints.MD} <= width < ${Breakpoints.XL}) {
        grid-column: 1 / span 3;
      }

      @media (${Breakpoints.XL} <= width) {
        grid-row: 1 / span 3;
      }
    }
  }
`;

const StyledTopPost = styled.li`
  display: flex;
  position: relative;
  align-items: center;
  gap: var(--size-5);

  ${StyledImageContainer} {
    flex: none;
  }

  a {
    display: block;
    font-size: var(--scale-2);

    &:hover {
      text-decoration: underline;
    }

    &:first-of-type {
      margin-block-end: var(--size-2);
    }

    &:last-of-type {
      font-size: var(--scale-3);
      color: var(--color-grey-900);

      html.dark & {
        color: var(--color-grey-50);
      }

      &::after {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        inline-size: var(--size-36);

        @media (width < ${Breakpoints.XL}) {
          inline-size: var(--size-24);
        }
      }
    }

    @media (width < ${Breakpoints.XL}) {
      font-size: var(--scale-00);

      &:last-of-type {
        font-size: var(--scale-0);
      }
    }
  }
`;

const StyledMorePosts = styled.ul`
  li {
    display: flex;
    position: relative;
    gap: var(--size-9);
    margin-block-end: var(--size-10);
    font-size: var(--scale-3);

    a {
      display: block;
      text-decoration: none;
      font-weight: var(--weight-medium);

      &:hover {
        text-decoration: underline;
      }
    }

    > div > a:nth-child(2) {
      color: var(--color-grey-900);

      &::after {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        inline-size: var(--size-60);

        @media (width < ${Breakpoints.MD}) {
          inline-size: var(--size-36);
        }
      }

      html.dark & {
        color: var(--color-grey-50);
      }
    }

    p {
      font-size: var(--scale-1);

      a {
        display: revert;
      }

      &:last-of-type {
        font-weight: var(--weight-medium);
      }

      @media (width < ${Breakpoints.MD}) {
        font-size: var(--scale-00);
      }
    }

    &::marker {
      color: transparent;
    }

    @media (width < ${Breakpoints.MD}) {
      font-size: var(--scale-0);
    }
  }

  ${StyledImageContainer} {
    inline-size: var(--size-60);
    block-size: var(--size-40);

    @media (width < ${Breakpoints.MD}) {
      inline-size: var(--size-36);
      block-size: var(--size-28);
    }
  }
`;

const StyledColumns = styled.div`
  display: flex;
  align-items: flex-start;

  @media (${Breakpoints.XL} <= width) {
    > :first-child {
      inline-size: 70%;
    }
  }
`;

const styledAllPostsLink = css`
  display: block;
  text-decoration: none;
  font-size: var(--scale-3);
  text-align: center;
  padding-inline: var(--size-6);
  padding-block: var(--size-3);
  margin-block-end: var(--size-10);
  border-radius: var(--radius-sm);
  color: var(--color-grey-50);
  background: var(--color-youjitsu-1);
  transition: background 0.25s ease-in-out;

  &:hover,
  &:focus {
    background: var(--color-youjitsu-2);
  }

  html.dark & {
    background: var(--color-youjitsu-2);

    &:hover,
    &:focus {
      background: var(--color-youjitsu-1);
    }
  }
`;
