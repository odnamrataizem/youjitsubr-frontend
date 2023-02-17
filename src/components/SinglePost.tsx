import React from 'react';

import type { Post } from '../lib/fetching';
import EntityLink from './EntityLink';
import Renderer from './Renderer';

type SinglePostProps = {
  data: Post;
};

export default function SinglePost({ data }: SinglePostProps) {
  return (
    data && (
      <>
        {data.cover?.url}
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
        <Renderer document={data.content.document} />
      </>
    )
  );
}
