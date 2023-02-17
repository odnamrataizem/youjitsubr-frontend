import React from 'react';

import type { Post } from '../lib/fetching';
import Renderer from './Renderer';

type SinglePageProps = {
  data: Post;
};

export default function SinglePage({ data }: SinglePageProps) {
  return (
    data && (
      <>
        {data.cover?.url}
        <h1>{data.title}</h1>
        <Renderer document={data.content.document} />
      </>
    )
  );
}
