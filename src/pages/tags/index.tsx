import { gql } from '@apollo/client';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

import { addApolloState, initializeApollo } from '../../lib/apolloClient';
import type { Tag } from '../../lib/fetching';

const ALL_TAGS_QUERY = gql`
  query AllTags {
    tags(orderBy: [{ name: asc }]) {
      id
      name
      slug
      postsCount
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const client = initializeApollo();
  const { data } = await client.query({ query: ALL_TAGS_QUERY });
  return addApolloState(client, { props: { list: data.tags } });
};

type TagsProps = {
  list: Tag[];
};

export default function Tags({ list }: TagsProps) {
  return (
    <>
      <h1>Tags</h1>
      <ul>
        {list.filter(tag => tag.postsCount).map(tag => (
          <li key={tag.id}>
            <Link href={`/tags/${encodeURIComponent(tag.slug)}`}>
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
