import { styled } from '@linaria/react';
import Image from 'next/image';
import React from 'react';

import type { Post } from '../lib/fetching';
import { ProseContainer, visuallyHidden } from '../styles/common';
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
      <article>
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
            <section>
              <h2 className={visuallyHidden}>Tags</h2>
              <StyledTags>
                {data.tags.map(tag => (
                  <li key={tag.id}>
                    <EntityLink kind="tags" data={tag} />
                  </li>
                ))}
              </StyledTags>
            </section>
          </ProseContainer>
        </StyledFooter>
      </article>
    )
  );
}

const StyledHeader = styled.header`
  padding-block-start: var(--size-12);

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

  ul {
    margin: 0;
    padding: 0;
  }

  a {
    font-weight: var(--weight-black);
    text-decoration: none;
  }
`;

const StyledTags = styled.ul`
  li {
    display: inline-block;

    &:not(:first-child) {
      margin-inline-start: 1em;
    }

    a {
      &::before {
        content: '#';
        opacity: 0.75;
      }
    }
  }
`;
