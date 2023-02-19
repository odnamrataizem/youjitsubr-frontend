import React from 'react';

import type { Post } from '../lib/fetching';
import { ProseContainer } from '../styles/common';
import Renderer from './Renderer';

type SinglePageProps = {
  data: Post;
};

export default function SinglePage({ data }: SinglePageProps) {
  return (
    data && (
      <article>
        <header>
          {data.cover?.url}
          <h1>{data.title}</h1>
        </header>
        <ProseContainer>
          <Renderer document={data.content.document} />
        </ProseContainer>
      </article>
    )
  );
}
