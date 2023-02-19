import { styled } from '@linaria/react';
import Image from 'next/image';
import React from 'react';

import type { Post } from '../lib/fetching';
import { ProseContainer } from '../styles/common';
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
            <StyledHero>
              <Image priority fill alt="" src={data.cover?.url ?? ''} />
            </StyledHero>
          </ProseContainer>
        </StyledHeader>
        <ProseContainer>
          <Renderer document={data.content.document} />
        </ProseContainer>
        <StyledFooter>
          <ProseContainer>
            <StyledTags>
              {data.tags.map(tag => (
                <li key={tag.id}>
                  <EntityLink kind="tags" data={tag} />
                </li>
              ))}
            </StyledTags>
          </ProseContainer>
        </StyledFooter>
      </article>
    )
  );
}

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

const StyledHero = styled.div`
  position: relative;
  max-inline-size: var(--size-96);
  aspect-ratio: 16 / 9;

  img {
    object-fit: cover;
  }
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
