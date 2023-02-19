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
  return (
    data && (
      <article>
        <header>
          <StyledHero>
            <Image priority fill alt="" src={data.cover?.url ?? ''} />
          </StyledHero>
          <h1>{data.title}</h1>
          <p>{data.lead}</p>
          <p>
            <EntityLink kind="posts" data={data.category} />
          </p>
          <ul>
            {data.tags.map(tag => (
              <li key={tag.id}>
                <EntityLink kind="tags" data={tag} />
              </li>
            ))}
          </ul>
        </header>
        <ProseContainer>
          <Renderer document={data.content.document} />
        </ProseContainer>
      </article>
    )
  );
}

const StyledHero = styled.div`
  position: relative;
  max-inline-size: var(--size-96);
  aspect-ratio: 16 / 9;

  img {
    object-fit: cover;
  }
`
