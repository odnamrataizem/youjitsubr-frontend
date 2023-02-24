import { styled } from '@linaria/react';
import Image from 'next/image';
import React from 'react';

import type { Post } from '../lib/fetching';
import { Breakpoints, ProseContainer, visuallyHidden } from '../styles/common';
import EntityLink from './EntityLink';
import Renderer from './Renderer';

type SinglePostProps = {
  data: Post;
};

export default function SinglePost({ data }: SinglePostProps) {
  const authors = new Intl.ListFormat(
    process.env.NEXT_PUBLIC_LOCALE,
  ).formatToParts(data.authors.map((_, index) => index.toString()));

  return (
    data && (
      <StyledArticle>
        <StyledHeader>
          <ProseContainer>
            <StyledTitle>{data.title}</StyledTitle>
            <StyledLead>{data.lead}</StyledLead>
            <StyledMeta>
              Postado em <EntityLink kind="posts" data={data.category} /> a{' '}
              {new Date(data.publishedAt).toLocaleString(
                process.env.NEXT_PUBLIC_LOCALE,
                {
                  dateStyle: 'short',
                  timeZone: process.env.NEXT_PUBLIC_TZ,
                },
              )}{' '}
              {new Date(data.publishedAt).toLocaleString(
                process.env.NEXT_PUBLIC_LOCALE,
                {
                  timeStyle: 'short',
                  timeZone: process.env.NEXT_PUBLIC_TZ,
                },
              )}
              {data.updatedAt !== data.publishedAt && (
                <>
                  , atualizado a{' '}
                  {new Date(data.updatedAt).toLocaleString(
                    process.env.NEXT_PUBLIC_LOCALE,
                    {
                      dateStyle: 'short',
                      timeZone: process.env.NEXT_PUBLIC_TZ,
                    },
                  )}{' '}
                  {new Date(data.updatedAt).toLocaleString(
                    process.env.NEXT_PUBLIC_LOCALE,
                    {
                      timeStyle: 'short',
                      timeZone: process.env.NEXT_PUBLIC_TZ,
                    },
                  )}
                </>
              )}{' '}
              — Por{' '}
              {authors.map(part =>
                part.type === 'literal' ? (
                  <React.Fragment key={JSON.stringify(part)}>
                    {part.value}
                  </React.Fragment>
                ) : (
                  <EntityLink
                    key={JSON.stringify(part)}
                    kind="people"
                    data={data.authors[Number.parseInt(part.value, 10)]}
                  />
                ),
              )}
            </StyledMeta>
            <Image
              priority
              alt=""
              src={data.cover?.url ?? ''}
              width={data.cover?.width ?? 0}
              height={data.cover?.height ?? 0}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: `${data.cover?.width ?? 0} / ${
                  data.cover?.height ?? 0
                }`,
              }}
            />
          </ProseContainer>
        </StyledHeader>
        <ProseContainer>
          <Renderer document={data.content.document} />
        </ProseContainer>
        <StyledFooter>
          <ProseContainer>
            <StyledTagsSection>
              <h2 className={visuallyHidden}>Tags</h2>
              <ul>
                {data.tags.map(tag => (
                  <li key={tag.id}>
                    <EntityLink kind="tags" data={tag} />
                  </li>
                ))}
              </ul>
            </StyledTagsSection>
            <section>
              <h2 className={visuallyHidden}>Autores</h2>
              {data.authors.map(author => (
                <StyledAboutSection key={author.id}>
                  <StyledAuthorPictureContainer>
                    <Image fill src={author.picture?.url ?? ''} alt="" />
                  </StyledAuthorPictureContainer>
                  <StyledAuthorInfoContainer>
                    <h3>{author.name}</h3>
                    <div>
                      <Renderer document={author.description.document} />
                    </div>
                  </StyledAuthorInfoContainer>
                  <StyledLinkContainer>
                    <EntityLink kind="people" data={author}>
                      Ver posts
                      <span className={visuallyHidden}> de {author.name}</span>
                    </EntityLink>
                  </StyledLinkContainer>
                </StyledAboutSection>
              ))}
            </section>
          </ProseContainer>
        </StyledFooter>
      </StyledArticle>
    )
  );
}

const StyledArticle = styled.article`
  padding-block: var(--size-12);

  @media (width < ${Breakpoints.MD}) {
    padding-block: var(--size-6);
  }
`;

const StyledHeader = styled.header`
  h1,
  p {
    margin: 0;
  }

  a {
    font-weight: var(--weight-semibold);
  }
`;

const StyledTitle = styled.h1`
  font-weight: var(--weight-medium);
`;

const StyledLead = styled.p`
  font-size: var(--scale-3);
  font-weight: var(--weight-light);
`;

const StyledMeta = styled.p`
  font-size: var(--scale-0);
`;

const StyledFooter = styled.footer`
  font-size: var(--scale-3);
`;

const StyledTagsSection = styled.section`
  ul {
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;

    &:not(:first-child) {
      margin-inline-start: 1em;
    }

    a {
      font-weight: var(--weight-black);
      text-decoration: none;

      &::before {
        content: '#';
        opacity: 0.75;
      }
    }
  }
`;

const StyledAboutSection = styled.section`
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

    + div :last-child {
      margin-block-end: 0;
    }

    @media (width < ${Breakpoints.MD}) {
      + div {
        margin-inline-start: calc(var(--size-20) * -1 + var(--size-6) * -1);
      }
    }
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

const StyledAuthorPictureContainer = styled.div`
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

const StyledAuthorInfoContainer = styled.div`
  flex: 1;
`;

const StyledLinkContainer = styled.small`
  align-self: flex-start;

  a {
    text-decoration: none;
    color: var(--color-gray-900);
    border: var(--size-px) solid var(--color-youjitsu-1);
    border-radius: var(--radius-xs);
    padding-inline: var(--size-3);
    padding-block: var(--size-2);

    &:hover {
      color: var(--color-youjitsu-1);
    }

    html.dark & {
      color: var(--color-gray-50);
      border-color: var(--color-youjitsu-2);

      &:hover {
        color: var(--color-youjitsu-2);
      }
    }
  }

  @media (width > ${Breakpoints.MD}) {
    inset-inline-end: var(--size-8);
  }
`;
