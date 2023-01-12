import { DocumentRenderer } from '@keystone-6/document-renderer';
import React from 'react';

import type { Post } from '../lib/fetching';

type SinglePageProps = {
  data: Post;
};

export default function SinglePage({ data }: SinglePageProps) {
  return (
    data && (
      <>
        {data.cover?.url}
        <h1>{data.title}</h1>
        <DocumentRenderer document={data.content.document} />
        <p>{JSON.stringify(data)}</p>
      </>
    )
  );
}
